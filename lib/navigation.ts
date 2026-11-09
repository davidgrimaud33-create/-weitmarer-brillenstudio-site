import type { Seite } from './bausteine/typen'

// Hauptmenü (5 Bereiche, nach Anliegen sortiert). Reihenfolge = Anzeige.
export const HAUPTMENUE = [
  { href: '/sehhilfen', label: 'Sehhilfen' },
  { href: '/augengesundheit', label: 'Augengesundheit' },
  { href: '/service-preise', label: 'Service & Preise' },
  { href: '/ueber-uns', label: 'Über uns' },
] as const

type Link = { href: string; label: string }

// Suchindex für die Seitensuche (Knopf „Suchen“ in der Kopfzeile)
export const SUCHINDEX: { titel: string; href: string; stichworte: string }[] = [
  { titel: 'Brillen & Fassungen', href: '/sehhilfen#brillen', stichworte: 'brille fassung marken designer sonnenbrille auswahl' },
  { titel: 'Gläser & Gleitsicht', href: '/sehhilfen#glaeser', stichworte: 'gläser gleitsicht galaxa quant astron lesebrille bildschirm einstärken' },
  { titel: 'Sonnenbrillen', href: '/sehhilfen#sonne', stichworte: 'sonnenbrille sonne uv' },
  { titel: 'Kontaktlinsen', href: '/sehhilfen#linsen', stichworte: 'kontaktlinsen linsen testlinsen anpassung' },
  { titel: 'Augenscreening', href: '/augengesundheit#screening', stichworte: 'screening vorsorge netzhaut augendruck grauer star makula laser scan' },
  { titel: 'Trockene Augen & TearStim', href: '/augengesundheit#trocken', stichworte: 'trockene augen tränen tearstim lichtstimulation brennen' },
  { titel: 'Visualtraining', href: '/augengesundheit#visual', stichworte: 'visualtraining funktionaloptometrie wahrnehmung' },
  { titel: 'Garantien', href: '/service-preise#garantien', stichworte: 'garantie geld zurück verträglichkeit 3 jahre' },
  { titel: 'Ratenkauf RELAX24', href: '/service-preise#relax24', stichworte: 'relax24 raten finanzierung monatlich' },
  { titel: 'Aktuelle Aktionen', href: '/service-preise#aktionen', stichworte: 'aktion angebot rabatt preis' },
  { titel: 'Reparatur & Brillenservice', href: '/service-preise#reparatur', stichworte: 'reparatur service reinigung nasenpad passform' },
  { titel: 'Holzkern-Uhren', href: '/holzkern', stichworte: 'holzkern uhr uhren holz stein armbanduhr geschenk' },
  { titel: 'Irisfotografie (externe Seite, Herne)', href: 'https://eyemazy-herne.de/', stichworte: 'iris foto irisfotografie eyemazy auge bild geschenk leinwand' },
  { titel: 'Team', href: '/ueber-uns#team', stichworte: 'team mitarbeiter alexander claudia jäh meister' },
  { titel: 'Termin vereinbaren', href: '/termin', stichworte: 'termin buchen anfrage kontakt' },
  { titel: 'Öffnungszeiten & Anfahrt', href: '/termin#anfahrt', stichworte: 'öffnungszeiten adresse anfahrt parken route telefon' },
]

const sichtbar = (seiten: Seite[]) => seiten.filter((s) => s.menue !== 'versteckt')
const alsLink = (s: Seite): Link => ({ href: `/${s.adresse}`, label: s.titel })

/** Die festen Menüpunkte, danach die Seiten mit menue: "haupt". */
export function hauptmenue(seiten: Seite[]): Link[] {
  return [...HAUPTMENUE, ...seiten.filter((s) => s.menue === 'haupt').map(alsLink)]
}

/** Zusätzliche Links in der Fußzeile (Seiten mit menue: "fusszeile"). */
export function fusszeilenLinks(seiten: Seite[]): Link[] {
  return seiten.filter((s) => s.menue === 'fusszeile').map(alsLink)
}

/** Suchindex: feste Einträge plus alle nicht versteckten Seiten. */
export function suchindex(seiten: Seite[]) {
  return [...SUCHINDEX, ...sichtbar(seiten).map((s) => ({ titel: s.titel, href: `/${s.adresse}`, stichworte: s.stichworte }))]
}

/** Adressen (z. B. "/sportbrillen") aller nicht versteckten Seiten für die Sitemap. */
export function sitemapEintraege(seiten: Seite[]): string[] {
  return sichtbar(seiten).map((s) => `/${s.adresse}`)
}
