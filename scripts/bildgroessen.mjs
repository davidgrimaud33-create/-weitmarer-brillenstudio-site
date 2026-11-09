#!/usr/bin/env node
/**
 * Erzeugt beim Build WebP-Größen (640 / 1080 / 1920 px) aus public/images/**.{jpg,jpeg,png}
 * nach public/_img/ und schreibt lib/bild-manifest.json.
 * Der Dateiname enthält die ersten 8 Zeichen des SHA-256 des Originals:
 * ein neues Foto mit gleichem Namen bekommt so einen neuen Dateinamen.
 */
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export const BREITEN = [640, 1080, 1920]

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const EINGABE = join(WURZEL, 'public', 'images')
const AUSGABE = join(WURZEL, 'public', '_img')
const MANIFEST = join(WURZEL, 'lib', 'bild-manifest.json')

/**
 * Erzeugt die Größen für eine Datei. `basis` ist der Pfad ohne Endung (z. B. "team/a"),
 * Standard: Dateiname ohne Endung. Gibt Breite → Ausgabepfad (/_img/...) zurück.
 *
 * @param {string} eingabeDatei
 * @param {string} ausgabeOrdner
 * @param {string} [basis]
 * @returns {Promise<Record<number, string>>}
 */
export async function erzeugeGroessen(eingabeDatei, ausgabeOrdner, basis = basename(eingabeDatei, extname(eingabeDatei))) {
  const inhalt = readFileSync(eingabeDatei)
  const hash = createHash('sha256').update(inhalt).digest('hex').slice(0, 8)
  const { width: original } = await sharp(inhalt).metadata()
  const breiten = [...new Set(BREITEN.map((b) => Math.min(b, original)))]
  /** @type {Record<number, string>} */
  const ergebnis = {}
  for (const breite of breiten) {
    const name = `${basis}-${breite}.${hash}.webp`
    const ziel = join(ausgabeOrdner, name)
    mkdirSync(dirname(ziel), { recursive: true })
    if (!existsSync(ziel)) {
      await sharp(inhalt).rotate().resize({ width: breite, withoutEnlargement: true }).webp({ quality: 78 }).toFile(ziel)
    }
    ergebnis[breite] = `/_img/${name}`
  }
  return ergebnis
}

function sammle(ordner) {
  if (!existsSync(ordner)) return []
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name)
    if (statSync(pfad).isDirectory()) return sammle(pfad)
    return /\.(jpe?g|png)$/i.test(name) ? [pfad] : []
  })
}

function alleDateien(ordner) {
  if (!existsSync(ordner)) return []
  return readdirSync(ordner).flatMap((name) => {
    const pfad = join(ordner, name)
    return statSync(pfad).isDirectory() ? alleDateien(pfad) : [pfad]
  })
}

async function alle() {
  /** @type {Record<string, Record<number, string>>} */
  const manifest = {}
  for (const datei of sammle(EINGABE).sort()) {
    const rel = relative(join(WURZEL, 'public'), datei).split('\\').join('/')
    const basis = relative(EINGABE, datei).split('\\').join('/').replace(/\.[^.]+$/, '')
    const ziele = await erzeugeGroessen(datei, AUSGABE, basis)
    manifest[`/${rel}`] = ziele
  }
  mkdirSync(dirname(MANIFEST), { recursive: true })
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

  const aktuell = new Set(
    Object.values(manifest).flatMap((z) => Object.values(z)).map((p) => join(WURZEL, 'public', p)),
  )
  let geloescht = 0
  for (const datei of alleDateien(AUSGABE)) {
    if (!aktuell.has(datei)) {
      rmSync(datei)
      geloescht++
    }
  }
  console.log(`Bildgrößen: ${Object.keys(manifest).length} Bilder, ${geloescht} alte Dateien entfernt`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  alle().catch((fehler) => {
    console.error('Bildgrößen konnten nicht erzeugt werden:', fehler.message)
    process.exit(1)
  })
}
