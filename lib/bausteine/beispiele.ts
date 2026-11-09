import type { Baustein } from './typen'

/** Je ein gültiges Beispiel pro Baustein (Musterbuch und Tests). Neutrale Texte, keine Preise. */
export const BEISPIELE: Record<Baustein['typ'], Baustein> = {
  buehne: {
    typ: 'buehne',
    titel: 'Überschrift der Seite',
    unterzeile: 'Eine kurze Zeile darunter.',
    bild: '/images/beispiel.jpg',
    knopf: { text: 'Termin vereinbaren', link: '/termin' },
  },
  text: { typ: 'text', titel: 'Überschrift', text: 'Erster Absatz.\n\nZweiter Absatz.' },
  'text-bild': {
    typ: 'text-bild',
    titel: 'Überschrift',
    text: 'Ein Text neben einem Bild.',
    bild: '/images/beispiel.jpg',
    bildAlt: 'Beschreibung des Bildes',
    bildSeite: 'rechts',
  },
  karten: {
    typ: 'karten',
    titel: 'Überschrift',
    karten: [
      { titel: 'Erste Karte', text: 'Kurzer Text.', bild: '/images/beispiel.jpg', link: '/termin' },
      { titel: 'Zweite Karte', text: 'Kurzer Text.' },
    ],
  },
  galerie: {
    typ: 'galerie',
    titel: 'Überschrift',
    bilder: [
      { src: '/images/beispiel.jpg', alt: 'Erstes Bild' },
      { src: '/images/beispiel.jpg', alt: 'Zweites Bild' },
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
