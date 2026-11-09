import type { Baustein } from './typen'

/**
 * Feste Reihenfolge und Namen im Musterbuch (/musterbuch).
 * Die Nummer (Position + 1) nennt Alexander, z. B. „Neue Seite wie Baustein 1, 3 und 9“.
 * Neue Bausteine nur hinten anhängen, damit sich bestehende Nummern nicht verschieben.
 */
export const MUSTERBUCH: { typ: Baustein['typ']; name: string }[] = [
  { typ: 'buehne', name: 'Bühne' },
  { typ: 'text', name: 'Text' },
  { typ: 'text-bild', name: 'Text mit Bild' },
  { typ: 'karten', name: 'Karten' },
  { typ: 'galerie', name: 'Galerie' },
  { typ: 'zitat', name: 'Zitat' },
  { typ: 'faq', name: 'Häufige Fragen' },
  { typ: 'hinweis', name: 'Hinweis' },
  { typ: 'aufforderung', name: 'Aufforderung mit Knopf' },
  { typ: 'marken', name: 'Marken' },
  { typ: 'oeffnungszeiten', name: 'Öffnungszeiten und Anfahrt' },
  { typ: 'aktionen', name: 'Aktionen' },
]
