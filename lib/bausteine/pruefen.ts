/**
 * Prüft den Inhalt einer Seiten-Datei. Jeder Fehler ist ein deutscher Satz mit Dateiname,
 * Baustein-Nummer und Feldname, damit Alexander (oder Claude) ihn sofort findet.
 */
import type { Baustein, Knopf, Seite } from './typen'

type Objekt = Record<string, unknown>
type Melde = (text: string) => never

const MENUES = ['haupt', 'fusszeile', 'versteckt']
const LINK_ANFAENGE = ['/', '#', 'https://', 'tel:', 'mailto:']

const istObjekt = (w: unknown): w is Objekt => typeof w === 'object' && w !== null && !Array.isArray(w)
const nichtLeer = (w: unknown): w is string => typeof w === 'string' && w.trim() !== ''

/** Ein Prüfkontext: kennt Datei und (optional) Baustein und baut die Meldungen. */
function kontext(datei: string, baustein?: string): Melde {
  return (text) => {
    throw new Error(`${datei}: ${baustein ? `${baustein}: ` : ''}${text}`)
  }
}

function text(o: Objekt, feld: string, melde: Melde, pflicht: boolean, pfad = feld): string | undefined {
  const w = o[feld]
  if (w === undefined) return pflicht ? melde(`Das Feld "${pfad}" fehlt.`) : undefined
  if (!nichtLeer(w)) return melde(`Das Feld "${pfad}" muss ein Text sein und darf nicht leer sein.`)
  return w
}

function bild(o: Objekt, feld: string, melde: Melde, pflicht: boolean, pfad = feld) {
  const w = text(o, feld, melde, pflicht, pfad)
  if (w !== undefined && !w.startsWith('/images/')) {
    melde(`Das Feld "${pfad}" muss mit /images/ beginnen (zum Beispiel /images/sportbrille.jpg).`)
  }
}

function link(o: Objekt, feld: string, melde: Melde, pflicht: boolean, pfad = feld) {
  const w = text(o, feld, melde, pflicht, pfad)
  if (w !== undefined && !LINK_ANFAENGE.some((a) => w.startsWith(a))) {
    melde(`Das Feld "${pfad}" muss mit /, #, https://, tel: oder mailto: beginnen.`)
  }
}

function nurFelder(o: Objekt, erlaubt: string[], melde: Melde, pfad = '') {
  for (const k of Object.keys(o)) {
    if (!erlaubt.includes(k)) {
      melde(`Das Feld "${pfad}${k}" kennt dieser Baustein nicht (Tippfehler?). Erlaubt: ${erlaubt.join(', ')}.`)
    }
  }
}

function objekt(w: unknown, feld: string, melde: Melde): Objekt {
  if (!istObjekt(w)) return melde(`Das Feld "${feld}" fehlt oder ist kein Eintrag mit Feldern.`)
  return w
}

function liste(o: Objekt, feld: string, min: number, max: number, melde: Melde): unknown[] {
  const w = o[feld]
  if (w === undefined) return melde(`Das Feld "${feld}" fehlt.`)
  if (!Array.isArray(w)) return melde(`Das Feld "${feld}" muss eine Liste sein.`)
  if (w.length < min || w.length > max) {
    return melde(
      max === Infinity
        ? `Das Feld "${feld}" braucht mindestens ${min} Einträge (gefunden: ${w.length}).`
        : `Das Feld "${feld}" braucht ${min} bis ${max} Einträge (gefunden: ${w.length}).`,
    )
  }
  return w
}

function knopf(w: unknown, feld: string, melde: Melde): Knopf {
  const k = objekt(w, feld, melde)
  nurFelder(k, ['text', 'link'], melde, `${feld}.`)
  text(k, 'text', melde, true, `${feld}.text`)
  link(k, 'link', melde, true, `${feld}.link`)
  return k as Knopf
}

const BAUSTEIN_TYPEN = [
  'buehne', 'text', 'text-bild', 'karten', 'galerie', 'zitat',
  'faq', 'hinweis', 'aufforderung', 'marken', 'oeffnungszeiten', 'aktionen',
] as const

function pruefeBaustein(roh: unknown, nr: number, datei: string): Baustein {
  if (!istObjekt(roh)) return kontext(datei, `Baustein ${nr}`)('Der Baustein muss ein Eintrag mit Feldern sein.')
  const typ = roh.typ
  if (typeof typ !== 'string' || !(BAUSTEIN_TYPEN as readonly string[]).includes(typ)) {
    return kontext(datei, `Baustein ${nr}`)(
      `Den Baustein-Typ ${JSON.stringify(typ)} gibt es nicht. Erlaubt: ${BAUSTEIN_TYPEN.join(', ')}.`,
    )
  }
  const melde = kontext(datei, `Baustein ${nr} (${typ})`)
  const erlaubt = (...felder: string[]) => nurFelder(roh, ['typ', ...felder], melde)

  switch (typ) {
    case 'buehne':
      erlaubt('titel', 'unterzeile', 'bild', 'knopf')
      text(roh, 'titel', melde, true)
      text(roh, 'unterzeile', melde, false)
      bild(roh, 'bild', melde, false)
      if (roh.knopf !== undefined) knopf(roh.knopf, 'knopf', melde)
      break
    case 'text':
      erlaubt('titel', 'text')
      text(roh, 'titel', melde, false)
      text(roh, 'text', melde, true)
      break
    case 'text-bild':
      erlaubt('titel', 'text', 'bild', 'bildAlt', 'bildSeite')
      text(roh, 'titel', melde, false)
      text(roh, 'text', melde, true)
      bild(roh, 'bild', melde, true)
      text(roh, 'bildAlt', melde, true)
      if (roh.bildSeite === undefined) melde('Das Feld "bildSeite" fehlt.')
      if (roh.bildSeite !== 'links' && roh.bildSeite !== 'rechts') {
        melde('Das Feld "bildSeite" muss "links" oder "rechts" sein.')
      }
      break
    case 'karten':
      erlaubt('titel', 'karten')
      text(roh, 'titel', melde, false)
      liste(roh, 'karten', 2, 4, melde).forEach((k, i) => {
        const pfad = `karten[${i + 1}]`
        const o = objekt(k, pfad, melde)
        nurFelder(o, ['titel', 'text', 'bild', 'link'], melde, `${pfad}.`)
        text(o, 'titel', melde, true, `${pfad}.titel`)
        text(o, 'text', melde, true, `${pfad}.text`)
        bild(o, 'bild', melde, false, `${pfad}.bild`)
        link(o, 'link', melde, false, `${pfad}.link`)
      })
      break
    case 'galerie':
      erlaubt('titel', 'bilder')
      text(roh, 'titel', melde, false)
      liste(roh, 'bilder', 2, Infinity, melde).forEach((b, i) => {
        const pfad = `bilder[${i + 1}]`
        const o = objekt(b, pfad, melde)
        nurFelder(o, ['src', 'alt'], melde, `${pfad}.`)
        bild(o, 'src', melde, true, `${pfad}.src`)
        text(o, 'alt', melde, true, `${pfad}.alt`)
      })
      break
    case 'zitat':
      erlaubt('text', 'name')
      text(roh, 'text', melde, true)
      text(roh, 'name', melde, false)
      break
    case 'faq':
      erlaubt('titel', 'eintraege')
      text(roh, 'titel', melde, false)
      liste(roh, 'eintraege', 1, Infinity, melde).forEach((e, i) => {
        const pfad = `eintraege[${i + 1}]`
        const o = objekt(e, pfad, melde)
        nurFelder(o, ['frage', 'antwort'], melde, `${pfad}.`)
        text(o, 'frage', melde, true, `${pfad}.frage`)
        text(o, 'antwort', melde, true, `${pfad}.antwort`)
      })
      break
    case 'hinweis':
      erlaubt('text')
      text(roh, 'text', melde, true)
      break
    case 'aufforderung':
      erlaubt('titel', 'text', 'knopf')
      text(roh, 'titel', melde, true)
      text(roh, 'text', melde, false)
      knopf(roh.knopf, 'knopf', melde)
      break
    default: // marken, oeffnungszeiten, aktionen
      erlaubt('titel')
      text(roh, 'titel', melde, false)
  }
  return roh as unknown as Baustein
}

/** `datei` ist der Pfad der Datei (z. B. content/seiten/sportbrillen.json); daraus wird die Adresse. */
export function pruefeSeite(daten: unknown, datei: string): Seite {
  const melde = kontext(datei)
  if (!istObjekt(daten)) return melde('Die Datei muss ein JSON-Objekt mit { } sein.')
  nurFelder(daten, ['adresse', 'titel', 'beschreibung', 'menue', 'stichworte', 'bausteine'], melde)

  text(daten, 'titel', melde, true)
  text(daten, 'beschreibung', melde, true)
  if (daten.menue === undefined) melde('Das Feld "menue" fehlt.')
  if (typeof daten.menue !== 'string' || !MENUES.includes(daten.menue)) {
    melde(`Das Feld "menue" muss "haupt", "fusszeile" oder "versteckt" sein (gefunden: ${JSON.stringify(daten.menue)}).`)
  }
  if (daten.stichworte === undefined) melde('Das Feld "stichworte" fehlt (darf leer sein: "").')
  if (typeof daten.stichworte !== 'string') melde('Das Feld "stichworte" muss ein Text sein.')
  const bausteine = liste(daten, 'bausteine', 1, Infinity, melde).map((b, i) => pruefeBaustein(b, i + 1, datei))

  // Die Adresse kommt immer aus dem Dateinamen; ein Eintrag "adresse" in der Datei wird ignoriert.
  const adresse = (datei.split(/[\\/]/).pop() ?? '').replace(/\.json$/, '')
  return {
    adresse,
    titel: daten.titel as string,
    beschreibung: daten.beschreibung as string,
    menue: daten.menue as Seite['menue'],
    stichworte: daten.stichworte as string,
    bausteine,
  }
}
