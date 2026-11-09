/**
 * Datumslogik der Monatsangebote – ohne Dateizugriff, damit sie auch im Browser läuft.
 * Die Seite ist statisch gebaut; ob die Angebote HEUTE gelten, entscheidet der Browser.
 */
import { berlinJetzt, isoDatum } from './oeffnungszeiten'

export type Kategorie = 'fassungen' | 'glaeser' | 'kontaktlinsen'
export type WertArt = 'rabatt' | 'preis' | 'aktion'

export type Angebot = {
  kategorie: Kategorie
  titel: string
  text: string
  wert: string
  wertArt: WertArt
  wertVorsatz?: string
  bild?: string
  bildAlt?: string
}

export type Angebote = {
  entwurf: boolean
  monat: string
  ueberschrift: string
  gueltigAb: string
  gueltigBis: string
  hinweis?: string
  pdf?: string
  angebote: Angebot[]
}

export const KATEGORIEN: Record<Kategorie, string> = {
  fassungen: 'Fassungen',
  glaeser: 'Gläser',
  kontaktlinsen: 'Kontaktlinsen',
}

const TAG_MS = 86_400_000

/** Gelten die Angebote am Tag `jetzt` (Zeitzone Berlin), und wie viele Tage noch (heute mitgezählt)? */
export function angebotsStatus(
  a: Pick<Angebote, 'gueltigAb' | 'gueltigBis'>,
  jetzt: Date = berlinJetzt(),
): { aktiv: boolean; restTage: number } {
  const heute = isoDatum(jetzt)
  const aktiv = a.gueltigAb <= heute && heute <= a.gueltigBis
  const ende = new Date(`${a.gueltigBis}T23:59:59`)
  const restTage = aktiv ? Math.max(1, Math.ceil((ende.getTime() - jetzt.getTime()) / TAG_MS)) : 0
  return { aktiv, restTage }
}

export const datumLang = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })
