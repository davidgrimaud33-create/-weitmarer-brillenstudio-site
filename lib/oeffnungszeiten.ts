import type { Oeffnungszeiten, Zeitfenster } from './content'

export const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
export const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
export const MONATE_KURZ = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const fmt = (t: string) => t.replace(/^0/, '')

/** Aktuelle Zeit in Berlin – unabhängig von der Zeitzone des Besuchers */
export function berlinJetzt(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
}

export function isoDatum(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** Öffnungszeiten eines bestimmten Tages – Ausnahmen (Feiertage, Urlaub) haben Vorrang */
export function zeitenAm(oz: Oeffnungszeiten, d: Date): { zeiten: Zeitfenster[]; grund?: string } {
  const ausnahme = oz.ausnahmen.find((a) => a.datum === isoDatum(d))
  if (ausnahme) return { zeiten: ausnahme.zeiten, grund: ausnahme.grund }
  return { zeiten: oz.regulaer[String(d.getDay())] ?? [] }
}

export type Status = { offen: boolean; text: string; kurz: string; tag: number }

export function oeffnungsStatus(oz: Oeffnungszeiten, jetzt = berlinJetzt()): Status {
  const min = jetzt.getHours() * 60 + jetzt.getMinutes()
  const heute = zeitenAm(oz, jetzt).zeiten
  for (const [von, bis] of heute) {
    if (min >= toMin(von) && min < toMin(bis)) {
      return { offen: true, text: `Jetzt geöffnet · bis ${fmt(bis)} Uhr`, kurz: 'Geöffnet', tag: jetzt.getDay() }
    }
  }
  for (let i = 0; i < 14; i++) {
    const d = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + i)
    for (const [von] of zeitenAm(oz, d).zeiten) {
      if (i > 0 || toMin(von) > min) {
        const wann = i === 0 ? 'heute' : i === 1 ? 'morgen' : WOCHENTAGE[d.getDay()]
        return { offen: false, text: `Gerade geschlossen · öffnet ${wann} um ${fmt(von)} Uhr`, kurz: 'Geschlossen', tag: jetzt.getDay() }
      }
    }
  }
  return { offen: false, text: 'Gerade geschlossen', kurz: 'Geschlossen', tag: jetzt.getDay() }
}

/** Wochentabelle Mo–So, z. B. „9–13 · 14–18 Uhr“ */
export function wochenTabelle(oz: Oeffnungszeiten) {
  return [1, 2, 3, 4, 5, 6, 0].map((t) => {
    const z = oz.regulaer[String(t)] ?? []
    const zeit = z.length
      ? z.map(([v, b]) => `${fmt(v).replace(':00', '')}–${fmt(b).replace(':00', '')}`).join(' · ') + ' Uhr'
      : 'geschlossen'
    return { tag: t, name: WOCHENTAGE[t], zeit }
  })
}

/** Kommende Ausnahmen (Feiertage, Urlaub) in den nächsten 30 Tagen */
export function kommendeAusnahmen(oz: Oeffnungszeiten, jetzt = berlinJetzt()) {
  const heute = isoDatum(jetzt)
  const grenze = isoDatum(new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + 30))
  return oz.ausnahmen.filter((a) => a.datum >= heute && a.datum <= grenze)
}

/** Nächste n Öffnungstage ab morgen – für die Terminanfrage */
export function naechsteOeffnungstage(oz: Oeffnungszeiten, n = 6, jetzt = berlinJetzt()) {
  const tage: { datum: Date; zeiten: Zeitfenster[] }[] = []
  for (let i = 1; tage.length < n && i < 30; i++) {
    const d = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate() + i)
    const { zeiten } = zeitenAm(oz, d)
    if (zeiten.length) tage.push({ datum: d, zeiten })
  }
  return tage
}

/** Aktionen, die heute gültig sind (Start und Ende einschließlich) */
export function aktiveAktionen<T extends { start: string; ende: string }>(liste: T[], jetzt = berlinJetzt()): T[] {
  const heute = isoDatum(jetzt)
  return liste.filter((a) => a.start <= heute && heute <= a.ende)
}
