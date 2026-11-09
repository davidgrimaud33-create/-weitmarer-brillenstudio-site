import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { BEISPIELE } from '@/lib/bausteine/beispiele'
import { pruefeSeite } from '@/lib/bausteine/pruefen'
import { berechneReservierteAdressen, ladeSeiten, RESERVIERTE_ADRESSEN } from '@/lib/seiten'
import type { Baustein } from '@/lib/bausteine/typen'

const DATEI = 'content/seiten/sportbrillen.json'
const seite = (bausteine: unknown[], extra: Record<string, unknown> = {}) => ({
  titel: 'Sportbrillen',
  beschreibung: 'Brillen für den Sport.',
  menue: 'haupt',
  stichworte: 'sport brille',
  bausteine,
  ...extra,
})
const mitAdresse = (b: unknown[]) => ({ ...seite(b), adresse: 'sportbrillen' })

const ordner: string[] = []
function tempOrdner(dateien: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'seiten-'))
  ordner.push(dir)
  for (const [name, inhalt] of Object.entries(dateien)) writeFileSync(join(dir, name), inhalt)
  return dir
}
afterEach(() => {
  while (ordner.length) rmSync(ordner.pop()!, { recursive: true, force: true })
})

describe('pruefeSeite', () => {
  for (const [typ, beispiel] of Object.entries(BEISPIELE)) {
    it(`akzeptiert das Beispiel "${typ}" unverändert`, () => {
      expect(pruefeSeite(seite([beispiel], { adresse: 'sportbrillen' }), DATEI)).toEqual(mitAdresse([beispiel]))
    })
  }

  it('lässt höchstens einen Baustein "buehne" pro Seite zu', () => {
    expect(() => pruefeSeite(seite([BEISPIELE.buehne, BEISPIELE.text, BEISPIELE.buehne]), DATEI)).toThrow(
      /sportbrillen\.json: Eine Seite darf nur einen Baustein "buehne" haben\./,
    )
  })

  it('meldet einen unbekannten Baustein-Typ', () => {
    expect(() => pruefeSeite(seite([{ typ: 'slider' }]), DATEI)).toThrow(/slider[\s\S]*Baustein 1|Baustein 1[\s\S]*slider/)
  })

  it('nennt Datei, Baustein und Feld bei fehlendem bildAlt', () => {
    const { bildAlt: _weg, ...ohne } = BEISPIELE['text-bild'] as Extract<Baustein, { typ: 'text-bild' }>
    expect(() => pruefeSeite(seite([BEISPIELE.text, ohne]), DATEI)).toThrow(
      `${DATEI}: Baustein 2 (text-bild): Das Feld "bildAlt" fehlt.`,
    )
  })

  it('lehnt 5 Karten ab', () => {
    const karten = Array.from({ length: 5 }, (_, i) => ({ titel: `K${i}`, text: 'x' }))
    expect(() => pruefeSeite(seite([{ typ: 'karten', karten }]), DATEI)).toThrow(/karten/)
  })

  it('lehnt eine Galerie mit nur einem Bild ab', () => {
    expect(() => pruefeSeite(seite([{ typ: 'galerie', bilder: [{ src: '/images/a.jpg', alt: 'a' }] }]), DATEI)).toThrow(/bilder/)
  })

  it('lehnt menue "oben" ab', () => {
    expect(() => pruefeSeite(seite([BEISPIELE.text], { menue: 'oben' }), DATEI)).toThrow(/menue/)
  })

  it('lehnt unbekannte Zusatzfelder ab (Tippfehler)', () => {
    expect(() => pruefeSeite(seite([{ typ: 'text', titl: 'x', text: 'y' }]), DATEI)).toThrow(/Baustein 1 \(text\).*"titl"/)
  })

  it('lehnt ungültige Links und Bildpfade ab', () => {
    const knopf = (link: string) => ({ typ: 'aufforderung', titel: 't', knopf: { text: 'x', link } })
    expect(() => pruefeSeite(seite([knopf('termin')]), DATEI)).toThrow(/knopf\.link/)
    expect(() => pruefeSeite(seite([knopf('http://a.de')]), DATEI)).toThrow(/knopf\.link/)
    for (const ok of ['/termin', '#oben', 'https://a.de', 'tel:+4912', 'mailto:a@b.de']) {
      expect(() => pruefeSeite(seite([knopf(ok)]), DATEI)).not.toThrow()
    }
    expect(() => pruefeSeite(seite([{ typ: 'buehne', titel: 't', bild: 'foto.jpg' }]), DATEI)).toThrow(/bild.*\/images\//)
  })

  it('lehnt ein Foto ab, das es unter public/ nicht gibt', () => {
    const b = { ...BEISPIELE['text-bild'], bild: '/images/sport/fehlt.jpg' }
    expect(() => pruefeSeite(seite([BEISPIELE.text, b]), DATEI)).toThrow(
      `${DATEI}: Baustein 2 (text-bild): Das Foto "/images/sport/fehlt.jpg" (Feld "bild") gibt es nicht. Bitte zuerst nach public/images/... legen.`,
    )
  })

  it('lehnt eine Bild-Endung ab, die der Build nicht kann (z. B. HEIC)', () => {
    const b = { ...BEISPIELE['text-bild'], bild: '/images/laden/foto.heic' }
    expect(() => pruefeSeite(seite([b]), DATEI)).toThrow(/Baustein 1 \(text-bild\).*"bild".*\.jpg, \.jpeg, \.png oder \.webp/)
  })

  it('nennt bei Galerie-Bildern den Feldpfad', () => {
    const bilder = [{ src: '/images/laden/laden-innen.jpg', alt: 'a' }, { src: '/images/x/weg.jpg', alt: 'b' }]
    expect(() => pruefeSeite(seite([{ typ: 'galerie', bilder }]), DATEI)).toThrow(/Feld "bilder\[2\]\.src"/)
  })

  it('nennt die Datei bei fehlendem Seitenfeld und bei Nicht-Objekt', () => {
    expect(() => pruefeSeite(seite([BEISPIELE.text], { titel: undefined }), DATEI)).toThrow(`${DATEI}: Das Feld "titel" fehlt.`)
    expect(() => pruefeSeite([], DATEI)).toThrow(DATEI)
  })
})

describe('ladeSeiten', () => {
  const gueltig = JSON.stringify(seite([BEISPIELE.text]))

  it('lädt Seiten sortiert, setzt die Adresse aus dem Dateinamen und ignoriert andere Dateien', () => {
    const dir = tempOrdner({
      'zebra.json': JSON.stringify({ ...seite([BEISPIELE.text]), adresse: 'egal' }),
      'alpha.json': gueltig,
      '.gitkeep': '',
    })
    expect(ladeSeiten(dir).map((s) => s.adresse)).toEqual(['alpha', 'zebra'])
  })

  it('gibt für einen fehlenden Ordner eine leere Liste zurück', () => {
    expect(ladeSeiten(join(tmpdir(), 'gibt-es-nicht-xyz'))).toEqual([])
  })

  it('bricht ab, wenn die Adresse schon vergeben ist', () => {
    const dir = tempOrdner({ 'termin.json': gueltig })
    expect(() => ladeSeiten(dir)).toThrow(/termin[\s\S]*bereits/)
  })

  it('kennt die vorhandenen app-Ordner als reserviert', () => {
    for (const a of ['termin', 'impressum', 'musterbuch', 'api', '_img', 'images']) {
      expect(RESERVIERTE_ADRESSEN).toContain(a)
    }
  })

  it('bricht bei ungültigem Dateinamen ab', () => {
    const dir = tempOrdner({ 'Neue Seite.json': gueltig })
    expect(() => ladeSeiten(dir)).toThrow(/Neue Seite\.json/)
  })

  it('nennt bei ungültigem JSON den Dateinamen', () => {
    const dir = tempOrdner({ 'kaputt.json': '{ "titel": ' })
    expect(() => ladeSeiten(dir)).toThrow(/kaputt\.json[\s\S]*JSON/)
  })

  it('nennt bei fehlendem Pflichtfeld Datei und Feld', () => {
    const dir = tempOrdner({ 'neu.json': JSON.stringify({ ...seite([BEISPIELE.text]), beschreibung: undefined }) })
    expect(() => ladeSeiten(dir)).toThrow(/neu\.json[\s\S]*beschreibung/)
  })
})

describe('reservierte Adressen', () => {
  const gueltig = JSON.stringify(seite([BEISPIELE.text]))

  it('enthält Weiterleitungsquellen und public-Ordner, aber keine Platzhalter', () => {
    for (const a of ['kontakt', 'angebote', 'relax24', 'augenvorsorge', 'leistungen', 'produkte', 'datenschutzerklaerung', 'logo']) {
      expect(RESERVIERTE_ADRESSEN).toContain(a)
    }
    expect(RESERVIERTE_ADRESSEN.some((a) => a.startsWith(':') || a.includes('*'))).toBe(false)
  })

  it('lehnt kontakt.json und logo.json ab', () => {
    for (const name of ['kontakt', 'logo']) {
      const dir = tempOrdner({ [`${name}.json`]: gueltig })
      expect(() => ladeSeiten(dir)).toThrow(/bereits/)
    }
  })

  it('wirft verständlich, wenn app/ oder public/_redirects fehlen', () => {
    const leer = mkdtempSync(join(tmpdir(), 'wurzel-'))
    ordner.push(leer)
    expect(() => berechneReservierteAdressen(leer)).toThrow(/"app".*nicht gefunden/)
    mkdirSync(join(leer, 'app'))
    expect(() => berechneReservierteAdressen(leer)).toThrow(/_redirects/)
    mkdirSync(join(leer, 'public'))
    writeFileSync(join(leer, 'public', '_redirects'), '# x\n/alt/* /neu 301\n')
    expect(berechneReservierteAdressen(leer)).toEqual(['alt', 'musterbuch', 'api', '_img', 'images'])
  })
})
