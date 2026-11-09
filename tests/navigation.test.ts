import { describe, expect, it } from 'vitest'
import { fusszeilenLinks, hauptmenue, sitemapEintraege, suchindex, HAUPTMENUE, SUCHINDEX } from '@/lib/navigation'
import type { Seite } from '@/lib/seiten'

const seite = (adresse: string, menue: Seite['menue'], extra: Partial<Seite> = {}): Seite => ({
  adresse,
  titel: `Titel ${adresse}`,
  beschreibung: 'Beschreibung.',
  menue,
  stichworte: `stich-${adresse}`,
  bausteine: [{ typ: 'hinweis', text: 'Hinweis' }],
  ...extra,
})

const seiten = [seite('a-haupt', 'haupt'), seite('b-fuss', 'fusszeile'), seite('c-weg', 'versteckt')]

describe('hauptmenue', () => {
  it('hängt Hauptmenü-Seiten nach den festen Einträgen an', () => {
    const m = hauptmenue(seiten)
    expect(m.slice(0, HAUPTMENUE.length)).toEqual([...HAUPTMENUE])
    expect(m.slice(HAUPTMENUE.length)).toEqual([{ href: '/a-haupt', label: 'Titel a-haupt' }])
  })
  it('ohne Seiten nur die festen Einträge', () => {
    expect(hauptmenue([])).toEqual([...HAUPTMENUE])
  })
})

describe('fusszeilenLinks', () => {
  it('enthält nur Fußzeilen-Seiten', () => {
    expect(fusszeilenLinks(seiten)).toEqual([{ href: '/b-fuss', label: 'Titel b-fuss' }])
  })
})

describe('suchindex', () => {
  it('enthält alle nicht versteckten Seiten mit Stichworten, nicht die versteckte', () => {
    const s = suchindex(seiten)
    expect(s.slice(0, SUCHINDEX.length)).toEqual(SUCHINDEX)
    expect(s.slice(SUCHINDEX.length)).toEqual([
      { titel: 'Titel a-haupt', href: '/a-haupt', stichworte: 'stich-a-haupt' },
      { titel: 'Titel b-fuss', href: '/b-fuss', stichworte: 'stich-b-fuss' },
    ])
    expect(JSON.stringify(s)).not.toContain('c-weg')
  })
})

describe('sitemapEintraege', () => {
  it('liefert Adressen der nicht versteckten Seiten', () => {
    expect(sitemapEintraege(seiten)).toEqual(['/a-haupt', '/b-fuss'])
  })
})

describe('versteckt', () => {
  it('taucht in keinem Menü, Index oder in der Sitemap auf', () => {
    const nur = [seite('c-weg', 'versteckt')]
    expect(hauptmenue(nur)).toEqual([...HAUPTMENUE])
    expect(fusszeilenLinks(nur)).toEqual([])
    expect(suchindex(nur)).toEqual(SUCHINDEX)
    expect(sitemapEintraege(nur)).toEqual([])
  })
})
