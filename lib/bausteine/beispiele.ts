import type { Baustein } from './typen'

/** Platzhalter-Foto der Beispiele: ein vorhandenes Ladenfoto (die Prüfung verlangt, dass die Datei existiert). */
export const BEISPIEL_BILD = '/images/laden/laden-innen.jpg'

/** Je ein gültiges Beispiel pro Baustein (Musterbuch und Tests). Neutrale Texte, keine Preise. */
export const BEISPIELE: Record<Baustein['typ'], Baustein> = {
  buehne: {
    typ: 'buehne',
    titel: 'Überschrift der Seite',
    unterzeile: 'Eine kurze Zeile darunter.',
    bild: BEISPIEL_BILD,
    knopf: { text: 'Termin vereinbaren', link: '/termin' },
  },
  text: { typ: 'text', titel: 'Überschrift', text: 'Erster Absatz.\n\nZweiter Absatz.' },
  'text-bild': {
    typ: 'text-bild',
    titel: 'Überschrift',
    text: 'Ein Text neben einem Bild.',
    bild: BEISPIEL_BILD,
    bildAlt: 'Beschreibung des Bildes',
    bildSeite: 'rechts',
  },
  karten: {
    typ: 'karten',
    titel: 'Überschrift',
    karten: [
      { titel: 'Erste Karte', text: 'Kurzer Text.', bild: BEISPIEL_BILD, link: '/termin' },
      { titel: 'Zweite Karte', text: 'Kurzer Text.' },
    ],
  },
  galerie: {
    typ: 'galerie',
    titel: 'Überschrift',
    bilder: [
      { src: BEISPIEL_BILD, alt: 'Erstes Bild' },
      { src: BEISPIEL_BILD, alt: 'Zweites Bild' },
    ],
  },
  zitat: { typ: 'zitat', text: 'Ein Satz, der hängen bleibt.', name: 'Name' },
  faq: {
    typ: 'faq',
    titel: 'Häufige Fragen',
    eintraege: [{ frage: 'Eine Frage?', antwort: 'Eine Antwort.' }],
  },
  hinweis: { typ: 'hinweis', text: 'Ein wichtiger Hinweis.' },
  aufforderung: {
    typ: 'aufforderung',
    titel: 'Überschrift',
    text: 'Ein kurzer Satz dazu.',
    knopf: { text: 'Jetzt anfragen', link: '/termin' },
  },
  marken: { typ: 'marken', titel: 'Unsere Marken' },
  oeffnungszeiten: { typ: 'oeffnungszeiten', titel: 'Öffnungszeiten' },
  aktionen: { typ: 'aktionen', titel: 'Aktionen' },
}
