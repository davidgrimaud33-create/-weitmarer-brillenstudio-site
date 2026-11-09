import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Alte WordPress-URLs → neue Seiten (aus der früheren netlify.toml übernommen)
const ERWARTET: [string, string][] = [
  ['/angebote/*', '/service-preise#aktionen'],
  ['/relax24/', '/service-preise#relax24'],
  ['/augenvorsorge/', '/augengesundheit#screening'],
  ['/leistungen/was-hilft-bei-trockenen-augen/', '/augengesundheit#trocken'],
  ['/leistungen/', '/service-preise'],
  ['/produkte/kontaktlinsen/', '/sehhilfen#linsen'],
  ['/produkte/glaeser/', '/sehhilfen#glaeser'],
  ['/produkte/holzkern/', '/holzkern'],
  ['/produkte/*', '/sehhilfen'],
  ['/kontakt/', '/termin'],
  ['/datenschutzerklaerung/', '/datenschutz'],
]

const zeilen = readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8')
  .split('\n')
  .map((z) => z.trim())
  .filter((z) => z && !z.startsWith('#'))

describe('public/_redirects', () => {
  it.each(ERWARTET)('leitet %s nach %s weiter (301)', (von, nach) => {
    expect(zeilen).toContain(`${von} ${nach} 301`)
  })

  it('leitet Unterseiten von /ueber-uns auf /ueber-uns, aber nicht /ueber-uns selbst', () => {
    expect(zeilen).toContain('/ueber-uns/:sub /ueber-uns 301')
    expect(zeilen).toContain('/ueber-uns/:sub/* /ueber-uns 301')
    // Keine Regel darf /ueber-uns oder /ueber-uns/ treffen (Schleife)
    expect(zeilen.some((z) => /^\/ueber-uns\/?\*?\s/.test(z))).toBe(false)
    expect(zeilen.some((z) => z.startsWith('/ueber-uns/* '))).toBe(false)
  })

  it('stellt spezifische /produkte/-Regeln vor die Wildcard', () => {
    const wildcard = zeilen.findIndex((z) => z.startsWith('/produkte/* '))
    expect(wildcard).toBeGreaterThan(-1)
    for (const z of zeilen.filter((z) => z.startsWith('/produkte/') && !z.startsWith('/produkte/* '))) {
      expect(zeilen.indexOf(z)).toBeLessThan(wildcard)
    }
  })
})
