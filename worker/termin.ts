import stammdaten from '../content/stammdaten.json'
import { sendeEreignis } from './ereignis'
import type { Env } from './index'
import { sendeMail } from './mail'

/**
 * Terminanfrage → zwei Mails über Resend:
 *   1. Benachrichtigung an den Laden (nur auf der Live-Adresse, sonst an das Test-Postfach)
 *   2. Bestätigung an den Kunden (nur wenn E-Mail angegeben)
 * Danach optional ein Ereignis an n8n (blockiert die Antwort nie).
 */
type Payload = {
  name?: string
  telefon?: string
  email?: string
  nachricht?: string
  anliegen?: string
  wunschtermin?: string
  einwilligung?: boolean
  website?: string // Honeypot
  turnstileToken?: string
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function zeile(label: string, wert?: string) {
  if (!wert) return ''
  return `<tr><td style="padding:6px 0;color:#4A5868;width:140px;font-size:13px;">${label}</td><td style="padding:6px 0;font-weight:600;">${esc(wert)}</td></tr>`
}

function rahmen(kicker: string, titel: string, inhalt: string) {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#F4F2EE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0E1B2B;">
  <div style="max-width:560px;margin:32px auto;background:#fff;padding:32px 28px;border-top:4px solid #0A62A8;border-radius:12px;">
    <p style="font-size:11px;letter-spacing:0.2em;color:#0A62A8;text-transform:uppercase;margin:0 0 6px;font-weight:700;">${kicker}</p>
    <h1 style="font-size:22px;margin:0 0 20px;">${titel}</h1>${inhalt}
  </div></body></html>`
}

const antwort = (body: Record<string, unknown>, status: number) => Response.json(body, { status })

async function turnstileOk(env: Env, token: string | undefined, ip: string | null): Promise<boolean> {
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, ...(ip ? { remoteip: ip } : {}) }),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    console.error('[termin] Turnstile nicht erreichbar', err)
    return false
  }
}

export async function handleTermin(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let p: Payload
  try {
    p = (await req.json()) as Payload
  } catch {
    return antwort({ ok: false, error: 'Ungültige Anfrage' }, 400)
  }
  if (!p || typeof p !== 'object') return antwort({ ok: false, error: 'Ungültige Anfrage' }, 400)

  // Bots füllen das versteckte Feld aus → stillschweigend „Erfolg“ melden
  if (p.website) return antwort({ ok: true }, 200)

  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
  const name = str(p.name, 120)
  const telefon = str(p.telefon, 60)
  const email = str(p.email, 160)
  const nachricht = str(p.nachricht, 3000)
  const anliegen = str(p.anliegen, 80)
  const wunschtermin = str(p.wunschtermin, 120)

  if (name.length < 2 || (!telefon && !email.includes('@')) || p.einwilligung !== true) {
    return antwort({ ok: false, error: 'Pflichtangaben fehlen' }, 422)
  }

  if (env.TURNSTILE_SECRET_KEY) {
    if (!(await turnstileOk(env, p.turnstileToken, req.headers.get('CF-Connecting-IP')))) {
      return antwort({ ok: false, error: 'Spam-Schutz nicht bestanden' }, 403)
    }
  }

  if (!env.RESEND_API_KEY) {
    console.error('[termin] RESEND_API_KEY fehlt – Anfrage nicht versendet')
    return antwort({ ok: false, error: 'Mailversand nicht eingerichtet' }, 503)
  }

  // Nur die Live-Adresse darf den Laden anschreiben; jede andere Version geht ans Test-Postfach.
  const istLive = !!env.LIVE_HOST && new URL(req.url).hostname === env.LIVE_HOST
  const empfaenger = istLive ? env.TERMIN_TO_EMAIL || stammdaten.email : env.TERMIN_TO_EMAIL_TEST
  if (!empfaenger) {
    console.error('[termin] TERMIN_TO_EMAIL_TEST fehlt – Testversion sendet keine Mails an den Laden')
    return antwort({ ok: false, error: 'Mailversand nicht eingerichtet' }, 503)
  }
  const from = env.TERMIN_FROM_EMAIL || 'Weitmarer Brillenstudio <onboarding@resend.dev>'

  const tabelle = `<table style="width:100%;border-collapse:collapse;font-size:14px;">${zeile('Anliegen', anliegen)}${zeile('Wunschtermin', wunschtermin)}${zeile('Name', name)}${zeile('Telefon', telefon)}${zeile('E-Mail', email)}</table>`
  const nachrichtHtml = nachricht ? `<hr style="border:none;border-top:1px solid #E3EDF7;margin:20px 0;" /><p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0;">${esc(nachricht)}</p>` : ''

  const notif = await sendeMail(env, {
    from,
    to: empfaenger,
    replyTo: email || undefined,
    subject: `${istLive ? '' : '[TEST] '}Terminanfrage: ${anliegen} – ${name}`,
    html: rahmen('Neue Terminanfrage', `${esc(anliegen)} · ${esc(name)}`, tabelle + nachrichtHtml),
  })
  if (!notif.ok) return antwort({ ok: false, error: 'Versand fehlgeschlagen' }, 502)

  if (email.includes('@')) {
    const bestaetigung = await sendeMail(env, {
      from,
      to: email,
      subject: 'Ihre Terminanfrage beim Weitmarer Brillenstudio',
      html: rahmen(
        stammdaten.name,
        'Danke, Ihre Anfrage ist bei uns angekommen',
        `<p style="font-size:15px;line-height:1.6;">Hallo ${esc(name)},<br/>wir melden uns zeitnah mit einem Terminvorschlag.</p>${tabelle}<p style="font-size:14px;color:#4A5868;margin-top:20px;">Eilt es? Rufen Sie uns an: ${stammdaten.telefon}<br/>${stammdaten.strasse}, ${stammdaten.plz} ${stammdaten.ort}</p>`,
      ),
    })
    if (!bestaetigung.ok) console.error('[termin] Bestätigungsmail an Kunden fehlgeschlagen')
  }

  if (env.N8N_WEBHOOK_URL) {
    ctx.waitUntil(
      sendeEreignis(env, {
        typ: 'termin-anfrage',
        zeitpunkt: new Date().toISOString(),
        quelle: istLive ? 'live' : 'test',
        daten: { name, telefon, email, nachricht, anliegen, wunschtermin },
      }),
    )
  }

  return antwort({ ok: true }, 200)
}
