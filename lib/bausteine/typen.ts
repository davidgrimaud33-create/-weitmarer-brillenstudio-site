/**
 * Typen für Seiten, die Alexander als JSON-Datei in content/seiten/ anlegt.
 * Eine Seite besteht aus Bausteinen; jeder Baustein hat ein Feld "typ".
 */
export type Knopf = { text: string; link: string }

export type Baustein =
  | { typ: 'buehne'; titel: string; unterzeile?: string; bild?: string; knopf?: Knopf }
  | { typ: 'text'; titel?: string; text: string }
  | { typ: 'text-bild'; titel?: string; text: string; bild: string; bildAlt: string; bildSeite: 'links' | 'rechts' }
  | { typ: 'karten'; titel?: string; karten: { titel: string; text: string; bild?: string; link?: string }[] }
  | { typ: 'galerie'; titel?: string; bilder: { src: string; alt: string }[] }
  | { typ: 'zitat'; text: string; name?: string }
  | { typ: 'faq'; titel?: string; eintraege: { frage: string; antwort: string }[] }
  | { typ: 'hinweis'; text: string }
  | { typ: 'aufforderung'; titel: string; text?: string; knopf: Knopf }
  | { typ: 'marken'; titel?: string }
  | { typ: 'oeffnungszeiten'; titel?: string }
  | { typ: 'aktionen'; titel?: string }

export type Seite = {
  adresse: string
  titel: string
  beschreibung: string
  menue: 'haupt' | 'fusszeile' | 'versteckt'
  stichworte: string
  bausteine: Baustein[]
}
