/**
 * Lädt die Seiten, die als JSON-Dateien in content/seiten/ liegen.
 * Fehler brechen den Build mit einer deutschen Meldung ab (kein stilles Überspringen).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pruefeSeite } from './bausteine/pruefen'
import type { Seite } from './bausteine/typen'

export type { Baustein, Knopf, Seite } from './bausteine/typen'

function appOrdner(): string[] {
  const dir = join(process.cwd(), 'app')
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !/^[[(_.]/.test(e.name))
    .map((e) => e.name)
}

/** Adressen, die schon vergeben sind: alle Ordner unter app/ plus technische Pfade. */
export const RESERVIERTE_ADRESSEN: string[] = [...appOrdner(), 'musterbuch', 'api', '_img', 'images']

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
          `${datei}: Die Adresse "/${adresse}" gibt es bereits. Bitte die Datei umbenennen, damit keine bestehende Seite überschrieben wird.`,
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
