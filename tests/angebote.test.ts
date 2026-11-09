import { describe, expect, it } from 'vitest'
import { angebotsStatus, pruefeAngebote } from '@/lib/angebote'

const DATEI = 'content/angebote.json'

const gueltig = () => ({
  entwurf: false,
  monat: 'November 2026',
  ueberschrift: 'November-Preise',
  gueltigAb: '2026-11-01',
  gueltigBis: '2026-11-30',
  hinweis: 'Alle Preise inkl. MwSt.',
  angebote: [
    { kategorie: 'fassungen', titel: 'Markenfassungen', text: 'Herbstkollektion', wert: '−30 %', wertArt: 'rabatt', bild: '/images/laden/fassungswand.jpg', bildAlt: 'Fassungswand' },
    { kategorie: 'glaeser', titel: 'Gleitsicht komplett', text: 'Fassung + 2 Gläser', wert: '299 €', wertVorsatz: 'ab', wertArt: 'preis' },
    { kategorie: 'kontaktlinsen', titel: 'Monatslinsen', text: '4 Boxen, 3 bezahlen', wert: '3+1', wertArt: 'aktion' },
  ],
})

describe('pruefeAngebote', () => {
  it('nimmt eine gültige Datei unverändert an', () => {
    const d = gueltig()
    expect(pruefeAngebote(d, DATEI)).toEqual(d)
  })

  it('meldet eine unbekannte Kategorie mit Dateiname, Nummer und Feld', () => {
    const d = gueltig()
    ;(d.angebote[1] as Record<string, unknown>).kategorie = 'brillen'
    expect(() => pruefeAngebote(d, DATEI)).toThrow('content/angebote.json: Angebot 2: Das Feld "kategorie" muss fassungen, glaeser oder kontaktlinsen sein.')
  })

  it('verlangt eine Bildbeschreibung, wenn ein Foto angegeben ist', () => {
    const d = gueltig()
    delete (d.angebote[0] as Record<string, unknown>).bildAlt
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/Angebot 1: Das Feld "bildAlt" fehlt/)
  })

  it('lehnt ein Foto ab, das es nicht gibt', () => {
    const d = gueltig()
    d.angebote[0].bild = '/images/laden/gibt-es-nicht.jpg'
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/gibt-es-nicht\.jpg.*gibt es nicht/)
  })

  it('lehnt ein falsches Datumsformat ab', () => {
    const d = gueltig()
    d.gueltigBis = '30.11.2026'
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/"gueltigBis".*JJJJ-MM-TT/)
  })

  it('lehnt ein Enddatum vor dem Startdatum ab', () => {
    const d = gueltig()
    d.gueltigBis = '2026-10-31'
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/"gueltigBis" liegt vor "gueltigAb"/)
  })

  it('lehnt eine unbekannte Preisart ab', () => {
    const d = gueltig()
    ;(d.angebote[2] as Record<string, unknown>).wertArt = 'gratis'
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/Angebot 3: Das Feld "wertArt" muss rabatt, preis oder aktion sein/)
  })

  it('erkennt Tippfehler in Feldnamen', () => {
    const d = gueltig()
    ;(d.angebote[0] as Record<string, unknown>).titl = 'x'
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/Angebot 1: Das Feld "titl" ist unbekannt/)
  })

  it('verlangt mindestens ein und höchstens neun Angebote', () => {
    const leer = { ...gueltig(), angebote: [] }
    expect(() => pruefeAngebote(leer, DATEI)).toThrow(/1 bis 9 Angebote/)
    const viele = { ...gueltig(), angebote: Array.from({ length: 10 }, () => gueltig().angebote[2]) }
    expect(() => pruefeAngebote(viele, DATEI)).toThrow(/1 bis 9 Angebote/)
  })

  it('lehnt ein PDF ab, das es nicht gibt', () => {
    const d = { ...gueltig(), pdf: '/angebote/fehlt.pdf' }
    expect(() => pruefeAngebote(d, DATEI)).toThrow(/fehlt\.pdf.*gibt es nicht/)
  })

  it('blockiert Beispiel-Daten beim Bauen der Live-Seite', () => {
    const d = { ...gueltig(), entwurf: true }
    expect(pruefeAngebote(d, DATEI, { live: false })).toEqual(d)
    expect(() => pruefeAngebote(d, DATEI, { live: true })).toThrow(/Beispiel-Angebote.*nicht live/)
  })
})

describe('angebotsStatus', () => {
  const a = { gueltigAb: '2026-11-01', gueltigBis: '2026-11-30' }
  const um = (iso: string) => new Date(iso)

  it('ist vor dem Start nicht aktiv', () => {
    expect(angebotsStatus(a, um('2026-10-31T12:00:00')).aktiv).toBe(false)
  })
  it('ist am ersten und letzten Tag aktiv', () => {
    expect(angebotsStatus(a, um('2026-11-01T08:00:00')).aktiv).toBe(true)
    const letzter = angebotsStatus(a, um('2026-11-30T18:00:00'))
    expect(letzter).toEqual({ aktiv: true, restTage: 1 })
  })
  it('zählt die Resttage einschließlich heute', () => {
    expect(angebotsStatus(a, um('2026-11-18T10:00:00')).restTage).toBe(13)
  })
  it('ist nach dem Enddatum nicht mehr aktiv', () => {
    expect(angebotsStatus(a, um('2026-12-01T00:30:00')).aktiv).toBe(false)
  })
})
