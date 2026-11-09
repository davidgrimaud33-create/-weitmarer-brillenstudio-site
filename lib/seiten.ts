/**
 * Lädt die Seiten, die als JSON-Dateien in content/seiten/ liegen.
 * Fehler brechen den Build mit einer deutschen Meldung ab (kein stilles Überspringen).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pruefeSeite } from './bausteine/pruefen'
import type { Seite } from './bausteine/typen'

export type { Baustein, Knopf, Seite } from './bausteine/typen'

function unterordner(dir: string, fehler: string, filter: (name: string) => boolean = () => true): string[] {
  if (!existsSync(dir)) throw new Error(fehler)
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && filter(e.name))
    .map((e) => e.name)
}

/**
 * Alle Adressen, die schon belegt sind: Ordner unter app/, Weiterleitungen der alten Website
 * (public/_redirects), Ordner unter public/ plus technische Pfade. Wirft, wenn app/ oder
 * public/_redirects fehlen (falsches Arbeitsverzeichnis) – sonst wäre der Schutz stillschweigend aus.
 */
export function berechneReservierteAdressen(wurzel: string): string[] {
  const app = unterordner(
    join(wurzel, 'app'),
    `Der Ordner "app" wurde unter ${wurzel} nicht gefunden. Bitte den Build im Projektordner starten.`,
    (n) => !/^[[(_.]/.test(n),
  )
  const redirects = join(wurzel, 'public', '_redirects')
  if (!existsSync(redirects)) {
    throw new Error(`Die Datei "public/_redirects" wurde unter ${wurzel} nicht gefunden. Bitte den Build im Projektordner starten.`)
  }
  const umgeleitet = readFileSync(redirects, 'utf8')
    .split('\n')
    .map((z) => z.trim())
    .filter((z) => z !== '' && !z.startsWith('#'))
    .map((z) => z.split(/\s+/)[0].split('/')[1])
    .filter((seg): seg is string => !!seg && !seg.startsWith(':') && !seg.includes('*'))
  const oeffentlich = unterordner(join(wurzel, 'public'), `Der Ordner "public" wurde unter ${wurzel} nicht gefunden.`)
  return [...new Set([...app, ...umgeleitet, ...oeffentlich, 'musterbuch', 'api', '_img', 'images'])]
}

export const RESERVIERTE_ADRESSEN: string[] = berechneReservierteAdressen(process.cwd())

export function ladeSeiten(ordner = 'content/seiten'): Seite[] {
  const verzeichnis = resolve(process.cwd(), ordner)
  if (!existsSync(verzeichnis)) return []

  const seiten = readdirSync(verzeichnis)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const datei = `${ordner}/${name}`
      const adresse = name.slice(0, -'.json'.length)
      if (!/^[a-z0-9-]+$/.test(adresse)) {
        throw new Error(
          `${datei}: Der Dateiname "${name}" ist nicht erlaubt. Erlaubt sind nur Kleinbuchstaben, Ziffern und Bindestriche, z. B. "sportbrillen.json".`,
        )
      }
      if (RESERVIERTE_ADRESSEN.includes(adresse)) {
        throw new Error(
          `${datei}: Die Adresse "/${adresse}" gibt es bereits (als Seite, Ordner oder Weiterleitung der alten Website). Bitte die Datei umbenennen, damit nichts überschrieben wird.`,
        )
      }
      let daten: unknown
      try {
        daten = JSON.parse(readFileSync(join(verzeichnis, name), 'utf8'))
      } catch (e) {
        throw new Error(`${datei}: Die Datei ist kein gültiges JSON (${(e as Error).message}).`)
      }
      return pruefeSeite(daten, datei)
    })
  return seiten.sort((a, b) => a.adresse.localeCompare(b.adresse))
}
