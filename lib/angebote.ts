/**
 * Prüft content/angebote.json beim Bauen. Jeder Fehler ist ein deutscher Satz mit
 * Dateiname, Angebots-Nummer und Feldname – wie bei den Seiten aus Bausteinen.
 */
import { existsSync, statSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import { bild, istObjekt, kontext, text, type Melde, type Objekt } from './bausteine/pruefen'
import { KATEGORIEN, type Angebot, type Angebote } from './angebote-status'

export * from './angebote-status'

const WERT_ARTEN = ['rabatt', 'preis', 'aktion']
const DATUM = /^\d{4}-\d{2}-\d{2}$/
const FELDER_DATEI = ['_hinweis', 'entwurf', 'monat', 'ueberschrift', 'gueltigAb', 'gueltigBis', 'hinweis', 'pdf', 'angebote']
const FELDER_ANGEBOT = ['kategorie', 'titel', 'text', 'wert', 'wertArt', 'wertVorsatz', 'bild', 'bildAlt']

function nurFelder(o: Objekt, erlaubt: string[], melde: Melde) {
  for (const k of Object.keys(o)) {
    if (!erlaubt.includes(k)) melde(`Das Feld "${k}" ist unbekannt (Tippfehler?). Erlaubt: ${erlaubt.join(', ')}.`)
  }
}

function datum(o: Objekt, feld: string, melde: Melde): string {
  const w = text(o, feld, melde, true) as string
  if (!DATUM.test(w) || Number.isNaN(new Date(`${w}T12:00:00`).getTime())) {
    melde(`Das Feld "${feld}" muss ein Datum im Format JJJJ-MM-TT sein (gefunden: "${w}").`)
  }
  return w
}

function pdf(o: Objekt, melde: Melde) {
  const w = text(o, 'pdf', melde, false)
  if (w === undefined) return
  if (!w.startsWith('/angebote/') || !w.toLowerCase().endsWith('.pdf')) {
    melde(`Das Feld "pdf" muss mit /angebote/ beginnen und auf .pdf enden (zum Beispiel /angebote/2026-11.pdf).`)
  }
  const wurzel = resolve(process.cwd(), 'public')
  const datei = resolve(join(wurzel, w))
  if (!datei.startsWith(wurzel + sep) || !existsSync(datei) || !statSync(datei).isFile()) {
    melde(`Das PDF "${w}" gibt es nicht. Bitte zuerst nach public${w} legen.`)
  }
}

function pruefeAngebot(roh: unknown, nr: number, datei: string): Angebot {
  const melde = kontext(datei, `Angebot ${nr}`)
  if (!istObjekt(roh)) return melde('Jedes Angebot muss ein Objekt in geschweiften Klammern { } sein.')
  nurFelder(roh, FELDER_ANGEBOT, melde)
  const kategorie = text(roh, 'kategorie', melde, true) as string
  if (!(kategorie in KATEGORIEN)) melde(`Das Feld "kategorie" muss ${Object.keys(KATEGORIEN).join(', ').replace(/, (?=[^,]*$)/, ' oder ')} sein.`)
  text(roh, 'titel', melde, true)
  text(roh, 'text', melde, true)
  text(roh, 'wert', melde, true)
  text(roh, 'wertVorsatz', melde, false)
  const art = text(roh, 'wertArt', melde, true) as string
  if (!WERT_ARTEN.includes(art)) melde(`Das Feld "wertArt" muss rabatt, preis oder aktion sein.`)
  bild(roh, 'bild', melde, false)
  if (roh.bild !== undefined) text(roh, 'bildAlt', melde, true)
  else if (roh.bildAlt !== undefined) melde('Das Feld "bildAlt" gibt es nur zusammen mit "bild".')
  return roh as unknown as Angebot
}

export function pruefeAngebote(daten: unknown, datei: string, optionen: { live?: boolean } = {}): Angebote {
  const melde = kontext(datei)
  if (!istObjekt(daten)) return melde('Die Datei muss ein Objekt in geschweiften Klammern { } sein.')
  nurFelder(daten, FELDER_DATEI, melde)
  if (typeof daten.entwurf !== 'boolean') melde('Das Feld "entwurf" muss true oder false sein.')
  text(daten, 'monat', melde, true)
  text(daten, 'ueberschrift', melde, true)
  text(daten, 'hinweis', melde, false)
  const ab = datum(daten, 'gueltigAb', melde)
  const bis = datum(daten, 'gueltigBis', melde)
  if (bis < ab) melde('Das Feld "gueltigBis" liegt vor "gueltigAb".')
  pdf(daten, melde)
  const liste = daten.angebote
  if (!Array.isArray(liste) || liste.length < 1 || liste.length > 9) {
    melde('Das Feld "angebote" muss eine Liste mit 1 bis 9 Angeboten sein.')
  }
  ;(liste as unknown[]).forEach((a, i) => pruefeAngebot(a, i + 1, datei))
  if (daten.entwurf === true && optionen.live) {
    melde('Das sind noch Beispiel-Angebote ("entwurf": true) – so dürfen sie nicht live gehen. Echte Angebote eintragen und "entwurf" auf false setzen.')
  }
  return daten as unknown as Angebote
}
