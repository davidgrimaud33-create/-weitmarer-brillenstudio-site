import { Resend } from 'resend'
import stammdaten from '@/content/stammdaten.json'

export const dynamic = 'force-dynamic'

/**
 * Terminanfrage → zwei Mails über Resend (Muster wie bei MB Barbier):
 *   1. Benachrichtigung an den Laden (TERMIN_TO_EMAIL)
 *   2. Bestätigung an den Kunden (nur wenn E-Mail angegeben)
 * Variablen im Netlify-UI pro Site setzen: RESEND_API_KEY, TERMIN_TO_EMAIL, TERMIN_FROM_EMAIL
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
}

const TO = process.env.TERMIN_TO_EMAIL || stammdaten.email
const FROM = process.env.TERMIN_FROM_EMAIL || 'Weitmarer Brillenstudio <onboarding@resend.dev>'

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

export async function POST(req: Request) {
  let p: Payload
  try {
    p = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'Ungültige Anfrage' }, { status: 400 })
  }

  // Bots füllen das versteckte Feld aus → stillschweigend „Erfolg“ melden
  if (p.website) return Response.json({ ok: true })

  const name = (p.name || '').trim().slice(0, 120)
  const telefon = (p.telefon || '').trim().slice(0, 60)
  const email = (p.email || '').trim().slice(0, 160)
  const nachricht = (p.nachricht || '').trim().slice(0, 3000)
  const anliegen = (p.anliegen || '').trim().slice(0, 80)
  const wunschtermin = (p.wunschtermin || '').trim().slice(0, 120)

  if (name.length < 2 || (!telefon && !email.includes('@')) || !p.einwilligung) {
    return Response.json({ ok: false, error: 'Pflichtangaben fehlen' }, { status: 422 })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[termin] RESEND_API_KEY fehlt – Anfrage nicht versendet')
    return Response.json({ ok: false, error: 'Mailversand nicht eingerichtet' }, { status: 503 })
  }
  const resend = new Resend(key)

  const tabelle = `<table style="width:100%;border-collapse:collapse;font-size:14px;">${zeile('Anliegen', anliegen)}${zeile('Wunschtermin', wunschtermin)}${zeile('Name', name)}${zeile('Telefon', telefon)}${zeile('E-Mail', email)}</table>`
  const nachrichtHtml = nachricht ? `<hr style="border:none;border-top:1px solid #E3EDF7;margin:20px 0;" /><p style="font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0;">${esc(nachricht)}</p>` : ''

  const notif = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email || undefined,
    subject: `Terminanfrage: ${anliegen} – ${name}`,
    html: rahmen('Neue Terminanfrage', `${esc(anliegen)} · ${esc(name)}`, tabelle + nachrichtHtml),
  })
  if (notif.error) {
    console.error('[termin] Resend-Fehler', notif.error)
    return Response.json({ ok: false, error: 'Versand fehlgeschlagen' }, { status: 502 })
  }

  if (email.includes('@')) {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Ihre Terminanfrage beim Weitmarer Brillenstudio',
      html: rahmen(
        stammdaten.name,
        'Danke, Ihre Anfrage ist bei uns angekommen',
        `<p style="font-size:15px;line-height:1.6;">Hallo ${esc(name)},<br/>wir melden uns zeitnah mit einem Terminvorschlag.</p>${tabelle}<p style="font-size:14px;color:#4A5868;margin-top:20px;">Eilt es? Rufen Sie uns an: ${stammdaten.telefon}<br/>${stammdaten.strasse}, ${stammdaten.plz} ${stammdaten.ort}</p>`,
      ),
    })
  }

  return Response.json({ ok: true })
}
