import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleTermin } from '../worker/termin'
import type { Env } from '../worker/index'

const LIVE = 'www.weitmarer-brillenstudio.de'
const gueltig = { name: 'Erika Muster', telefon: '0234 111111', einwilligung: true, anliegen: 'Sehtest', wunschtermin: 'Montag' }

function anfrage(body: unknown, host = LIVE) {
  return new Request(`https://${host}/api/termin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.5' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function umgebung(extra: Partial<Env> = {}): Env {
  return {
    ASSETS: {} as Env['ASSETS'],
    RESEND_API_KEY: 're_test',
    TERMIN_TO_EMAIL: 'laden@example.de',
    TERMIN_TO_EMAIL_TEST: 'test@example.de',
    TERMIN_FROM_EMAIL: 'Studio <termin@example.de>',
    LIVE_HOST: LIVE,
    ...extra,
  }
}

const ok = () => new Response(JSON.stringify({ id: 'x' }), { status: 200 })
let fetchMock: ReturnType<typeof vi.fn>
let ctx: { waitUntil: ReturnType<typeof vi.fn>; passThroughOnException: () => void }

const aufrufe = (teil: string) => fetchMock.mock.calls.filter(([u]) => String(u).includes(teil))
const mails = () => aufrufe('api.resend.com').map(([, init]) => JSON.parse((init as RequestInit).body as string))

beforeEach(() => {
  fetchMock = vi.fn(async () => ok())
  vi.stubGlobal('fetch', fetchMock)
  ctx = { waitUntil: vi.fn(), passThroughOnException: () => {} }
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

const run = (req: Request, env: Env) => handleTermin(req, env, ctx as unknown as ExecutionContext)

describe('handleTermin', () => {
  it('kaputtes JSON -> 400', async () => {
    expect((await run(anfrage('{kaputt'), umgebung())).status).toBe(400)
  })

  it('Honeypot gefüllt -> 200 ok, kein fetch', async () => {
    const res = await run(anfrage({ ...gueltig, website: 'http://spam' }), umgebung())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    ['Name zu kurz', { ...gueltig, name: 'E' }],
    ['weder Telefon noch E-Mail', { ...gueltig, telefon: '', email: 'ohne-at' }],
    ['keine Einwilligung', { ...gueltig, einwilligung: false }],
  ])('%s -> 422', async (_n, body) => {
    expect((await run(anfrage(body), umgebung())).status).toBe(422)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('Turnstile: success:false -> 403, keine Mail', async () => {
    fetchMock.mockImplementation(async (u: string) =>
      String(u).includes('siteverify') ? new Response(JSON.stringify({ success: false })) : ok(),
    )
    const res = await run(anfrage({ ...gueltig, turnstileToken: 'tok' }), umgebung({ TURNSTILE_SECRET_KEY: 'geheim' }))
    expect(res.status).toBe(403)
    expect(aufrufe('api.resend.com')).toHaveLength(0)
  })

  it('Turnstile: success:true -> weiter, Token und IP gehen an Siteverify', async () => {
    fetchMock.mockImplementation(async (u: string) =>
      String(u).includes('siteverify') ? new Response(JSON.stringify({ success: true })) : ok(),
    )
    const res = await run(anfrage({ ...gueltig, turnstileToken: 'tok' }), umgebung({ TURNSTILE_SECRET_KEY: 'geheim' }))
    expect(res.status).toBe(200)
    const body = JSON.parse((aufrufe('siteverify')[0][1] as RequestInit).body as string)
    expect(body).toEqual({ secret: 'geheim', response: 'tok', remoteip: '203.0.113.5' })
  })

  it('Turnstile: Secret gesetzt, Token fehlt -> 403', async () => {
    const res = await run(anfrage(gueltig), umgebung({ TURNSTILE_SECRET_KEY: 'geheim' }))
    expect(res.status).toBe(403)
  })

  it('ohne Secret keine Turnstile-Prüfung', async () => {
    await run(anfrage(gueltig), umgebung())
    expect(aufrufe('siteverify')).toHaveLength(0)
  })

  it('Live-Host -> Laden-Mail an TERMIN_TO_EMAIL', async () => {
    const res = await run(anfrage(gueltig, LIVE), umgebung())
    expect(res.status).toBe(200)
    expect(mails()[0].to).toBe('laden@example.de')
  })

  it('anderer Host -> Laden-Mail an TERMIN_TO_EMAIL_TEST', async () => {
    await run(anfrage(gueltig, 'staging.pages.dev'), umgebung())
    expect(mails()[0].to).toBe('test@example.de')
  })

  it('LIVE_HOST nicht gesetzt -> immer Test', async () => {
    await run(anfrage(gueltig, LIVE), umgebung({ LIVE_HOST: undefined }))
    expect(mails()[0].to).toBe('test@example.de')
  })

  it('Testversion ohne TERMIN_TO_EMAIL_TEST -> 503, nie an den Laden', async () => {
    const res = await run(anfrage(gueltig, 'staging.pages.dev'), umgebung({ TERMIN_TO_EMAIL_TEST: undefined }))
    expect(res.status).toBe(503)
    expect(aufrufe('api.resend.com')).toHaveLength(0)
  })

  it('live ohne TERMIN_TO_EMAIL -> Fallback auf Stammdaten-E-Mail', async () => {
    await run(anfrage(gueltig, LIVE), umgebung({ TERMIN_TO_EMAIL: undefined }))
    expect(mails()[0].to).toBe('info@weitmarer-brillenstudio.de')
  })

  it('mit Kunden-E-Mail -> zweite Mail (Bestätigung) an Kunden', async () => {
    await run(anfrage({ ...gueltig, email: 'kunde@example.de' }), umgebung())
    const m = mails()
    expect(m).toHaveLength(2)
    expect(m[1].to).toBe('kunde@example.de')
  })

  it('Telefon + ungültige E-Mail -> 200, kein reply_to, keine Bestätigung', async () => {
    const res = await run(anfrage({ ...gueltig, email: 'a@b' }), umgebung())
    expect(res.status).toBe(200)
    const m = mails()
    expect(m).toHaveLength(1)
    expect(m[0]).not.toHaveProperty('reply_to')
    expect(m[0].html).toContain('a@b')
  })

  it('kein Telefon + ungültige E-Mail -> 422', async () => {
    const res = await run(anfrage({ ...gueltig, telefon: '', email: 'max.muster.de' }), umgebung())
    expect(res.status).toBe(422)
  })

  it('Bestätigung schlägt fehl -> trotzdem 200', async () => {
    let n = 0
    fetchMock.mockImplementation(async () => (++n === 1 ? ok() : new Response('x', { status: 500 })))
    const res = await run(anfrage({ ...gueltig, email: 'kunde@example.de' }), umgebung())
    expect(res.status).toBe(200)
  })

  it('Laden-Mail schlägt fehl -> 502', async () => {
    fetchMock.mockImplementation(async () => new Response('x', { status: 500 }))
    expect((await run(anfrage(gueltig), umgebung())).status).toBe(502)
  })

  it('ohne RESEND_API_KEY -> 503', async () => {
    expect((await run(anfrage(gueltig), umgebung({ RESEND_API_KEY: undefined }))).status).toBe(503)
  })

  it('n8n: Ereignis über ctx.waitUntil, Antwort bleibt 200 auch wenn Webhook wirft', async () => {
    fetchMock.mockImplementation(async (u: string) => {
      if (String(u).includes('n8n.example')) throw new Error('nicht erreichbar')
      return ok()
    })
    const res = await run(
      anfrage({ ...gueltig, website: '', turnstileToken: 'tok' }),
      umgebung({ N8N_WEBHOOK_URL: 'https://n8n.example/hook' }),
    )
    expect(res.status).toBe(200)
    expect(mails()[0].to).toBe('laden@example.de')
    expect(ctx.waitUntil).toHaveBeenCalledTimes(1)
    await expect(ctx.waitUntil.mock.calls[0][0]).resolves.toBeUndefined()
    const [, init] = aufrufe('n8n.example')[0]
    const e = JSON.parse((init as RequestInit).body as string)
    expect(e.typ).toBe('termin-anfrage')
    expect(e.quelle).toBe('live')
    expect(e.daten.name).toBe('Erika Muster')
    expect(e.daten).not.toHaveProperty('website')
    expect(e.daten).not.toHaveProperty('turnstileToken')
    expect(e.daten).not.toHaveProperty('einwilligung')
  })

  it('n8n: Quelle test auf anderem Host', async () => {
    await run(anfrage(gueltig, 'staging.pages.dev'), umgebung({ N8N_WEBHOOK_URL: 'https://n8n.example/hook' }))
    await ctx.waitUntil.mock.calls[0][0]
    const e = JSON.parse((aufrufe('n8n.example')[0][1] as RequestInit).body as string)
    expect(e.quelle).toBe('test')
  })

  it('n8n: hängender Webhook bricht nach 3 s ab, Antwort kommt sofort', async () => {
    fetchMock.mockImplementation((u: string, init?: RequestInit) => {
      if (String(u).includes('n8n.example')) {
        return new Promise((_res, rej) => init?.signal?.addEventListener('abort', () => rej(new Error('abort'))))
      }
      return Promise.resolve(ok())
    })
    vi.useFakeTimers()
    const res = await run(anfrage(gueltig), umgebung({ N8N_WEBHOOK_URL: 'https://n8n.example/hook' }))
    expect(res.status).toBe(200)
    const fertig = ctx.waitUntil.mock.calls[0][0] as Promise<void>
    await vi.advanceTimersByTimeAsync(3000)
    await expect(fertig).resolves.toBeUndefined()
  })

  it('ohne N8N_WEBHOOK_URL kein Webhook-Aufruf und kein waitUntil', async () => {
    await run(anfrage(gueltig), umgebung())
    expect(aufrufe('n8n')).toHaveLength(0)
    expect(ctx.waitUntil).not.toHaveBeenCalled()
  })
})
