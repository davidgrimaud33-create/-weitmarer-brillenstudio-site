import type { Env } from './index'

export type Ereignis = {
  typ: 'termin-anfrage' | 'kontakt'
  zeitpunkt: string
  quelle: 'live' | 'test'
  daten: Record<string, string>
}

/**
 * Meldet ein Ereignis an den n8n-Webhook (optional). Wartet höchstens 3 Sekunden
 * und schluckt jeden Fehler – darf nie etwas anderes beeinträchtigen.
 */
export async function sendeEreignis(env: Env, e: Ereignis): Promise<void> {
  if (!env.N8N_WEBHOOK_URL) return
  const abbruch = new AbortController()
  const timer = setTimeout(() => abbruch.abort(), 3000)
  try {
    await fetch(env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e),
      signal: abbruch.signal,
    })
  } catch {
    // bewusst ignoriert
  } finally {
    clearTimeout(timer)
  }
}
