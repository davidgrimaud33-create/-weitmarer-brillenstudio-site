import { handleTermin } from './termin'

export type Env = {
  ASSETS: Fetcher
  RESEND_API_KEY?: string
  TERMIN_TO_EMAIL?: string
  TERMIN_TO_EMAIL_TEST?: string
  TERMIN_FROM_EMAIL?: string
  LIVE_HOST?: string
  TURNSTILE_SECRET_KEY?: string
  N8N_WEBHOOK_URL?: string
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(req.url)
    if (pathname === '/api/termin') {
      if (req.method !== 'POST') return Response.json({ ok: false, error: 'Methode nicht erlaubt' }, { status: 405, headers: { Allow: 'POST' } })
      return handleTermin(req, env, ctx)
    }
    if (pathname.startsWith('/api/')) return Response.json({ ok: false, error: 'Nicht gefunden' }, { status: 404 })
    return env.ASSETS.fetch(req)
  },
}
