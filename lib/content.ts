/**
 * Zentrale Zugriffe auf die Inhaltsdateien in /content.
 * Alexander ändert per Vibe-Coding nur die JSON-Dateien – hier stehen die Typen,
 * damit ein Tippfehler beim Build auffällt statt auf der Live-Seite.
 */
import stammdatenJson from '@/content/stammdaten.json'
import oeffnungszeitenJson from '@/content/oeffnungszeiten.json'
import aktionenJson from '@/content/aktionen.json'
import teamJson from '@/content/team.json'
import markenJson from '@/content/marken.json'
import startseiteJson from '@/content/startseite.json'
import garantienJson from '@/content/garantien.json'
import augengesundheitJson from '@/content/augengesundheit.json'
import besondersJson from '@/content/besonderes.json'

export type Zeitfenster = [string, string]
export type Oeffnungszeiten = {
  regulaer: Record<string, Zeitfenster[]>
  ausnahmen: { datum: string; zeiten: Zeitfenster[]; grund: string }[]
}
export type Aktion = { titel: string; text: string; start: string; ende: string; aufStartseite: boolean }
export type TeamMitglied = { name: string; rolle: string; schwerpunkt: string; foto: string; bildausschnitt: string }
export type Anliegen = { id: string; label: string; titel: string; text: string; cta: string; bild: string }

export const stammdaten = stammdatenJson
export const oeffnungszeiten = oeffnungszeitenJson as unknown as Oeffnungszeiten
export const aktionen = aktionenJson.aktionen as Aktion[]
export const team = teamJson.team as TeamMitglied[]
export const marken = markenJson.marken as string[]
export const startseite = startseiteJson as typeof startseiteJson & { anliegen: Anliegen[] }
export const garantien = garantienJson
export const augengesundheit = augengesundheitJson
export const besonderes = besondersJson

export const adresseEinzeilig = `${stammdaten.strasse}, ${stammdaten.plz} ${stammdaten.ort}`
