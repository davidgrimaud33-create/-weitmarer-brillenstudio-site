import type { Env } from './index'

export type Mail = { from: string; to: string; replyTo?: string; subject: string; html: string }

/** Verschickt eine Mail über die Resend-REST-API (ohne SDK). */
export async function sendeMail(env: Env, mail: Mail): Promise<{ ok: boolean }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: mail.from,
        to: mail.to,
        reply_to: mail.replyTo,
        subject: mail.subject,
        html: mail.html,
      }),
    })
    if (!res.ok) console.error('[mail] Resend-Fehler', res.status)
    return { ok: res.ok }
  } catch (err) {
    console.error('[mail] Resend nicht erreichbar', err)
    return { ok: false }
  }
}
