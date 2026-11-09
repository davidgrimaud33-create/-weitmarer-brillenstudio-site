import { mkdtempSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { afterAll, describe, expect, it } from 'vitest'
import { bildPfad, type BildManifest } from '@/lib/bild-pfad'
import { erzeugeGroessen } from '../scripts/bildgroessen.mjs'

const m: BildManifest = {
  '/images/team/a.jpg': {
    640: '/_img/team/a-640.aaaaaaaa.webp',
    1080: '/_img/team/a-1080.aaaaaaaa.webp',
    1920: '/_img/team/a-1920.aaaaaaaa.webp',
  },
}

describe('bildPfad', () => {
  it('wählt die nächstgrößere Breite', () => {
    expect(bildPfad('/images/team/a.jpg', 700, m)).toBe('/_img/team/a-1080.aaaaaaaa.webp')
    expect(bildPfad('/images/team/a.jpg', 300, m)).toBe('/_img/team/a-640.aaaaaaaa.webp')
  })
  it('nimmt die größte Breite, wenn mehr verlangt wird', () => {
    expect(bildPfad('/images/team/a.jpg', 2400, m)).toBe('/_img/team/a-1920.aaaaaaaa.webp')
  })
  it('lässt unbekannte Pfade unverändert', () => {
    expect(bildPfad('/logo/logo.svg', 640, m)).toBe('/logo/logo.svg')
  })
})

describe('erzeugeGroessen', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'bild-'))
  afterAll(() => rmSync(tmp, { recursive: true, force: true }))

  it('Dateiname enthält Inhalts-Hash: gleicher Name, anderer Inhalt → anderer Name', async () => {
    const rot = { create: { width: 800, height: 600, channels: 3 as const, background: '#f00' } }
    const blau = { create: { width: 800, height: 600, channels: 3 as const, background: '#00f' } }
    const eingabe = join(tmp, 'foto.jpg')
    const aus = join(tmp, 'aus')
    mkdirSync(aus)

    await sharp(rot).jpeg().toFile(eingabe)
    const a = await erzeugeGroessen(eingabe, aus)
    await sharp(blau).jpeg().toFile(eingabe)
    const b = await erzeugeGroessen(eingabe, aus)

    const hashA = a[640].match(/\.([0-9a-f]{8})\.webp$/)?.[1]
    const hashB = b[640].match(/\.([0-9a-f]{8})\.webp$/)?.[1]
    expect(hashA).toBeDefined()
    expect(hashB).toBeDefined()
    expect(hashA).not.toBe(hashB)
    expect(readdirSync(aus).length).toBeGreaterThanOrEqual(2)
  })

  it('skaliert nicht hoch', async () => {
    const eingabe = join(tmp, 'klein.png')
    const aus = join(tmp, 'aus2')
    mkdirSync(aus)
    await sharp({ create: { width: 500, height: 300, channels: 3, background: '#0f0' } }).png().toFile(eingabe)
    const r = await erzeugeGroessen(eingabe, aus)
    expect(Object.keys(r).map(Number)).toEqual([500])
  })
})
