#!/usr/bin/env node
/**
 * Auto-optimize images uploaded by the barber:
 *   - input:  public/images/**\/*.{jpg,jpeg,png}
 *   - output: <same path>.webp (alongside the original; original untouched)
 *   - target: < 250 KB by quality stepping (82→60 by 5), then -20% width if needed
 *   - max source width capped at 1920px
 *
 * Modes (auto-detected from env / args):
 *   - push event (CI): file list = `git diff --diff-filter=AM <before>..<after>`
 *   - workflow_dispatch / --all: all tracked images, skip when .webp twin already exists
 *   - --force: regenerate even when .webp twin exists
 *   - --dry-run: don't write .webp, just log
 *   - --limit=N: only process the first N candidates (testing)
 *   - --only=path1,path2: explicit file list (testing)
 */

import sharp from 'sharp'
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'

const TARGET_BYTES = 250 * 1024
const MAX_WIDTH = 1920
const QUALITIES = [82, 77, 72, 67, 62, 60]
const FALLBACK_WIDTH_FACTOR = 0.8

const args = process.argv.slice(2)
const flagAll = args.includes('--all')
const flagForce = args.includes('--force')
const flagDryRun = args.includes('--dry-run')
const flagLimit = parseInt(args.find(a => a.startsWith('--limit='))?.slice(8) ?? '0', 10) || null
const flagOnly = args.find(a => a.startsWith('--only='))?.slice(7) ?? null

const GH_BEFORE = process.env.GH_BEFORE
const GH_AFTER = process.env.GH_AFTER
const GH_EVENT = process.env.GITHUB_EVENT_NAME
const ZERO_SHA = '0000000000000000000000000000000000000000'

function listAllTracked() {
  return execSync('git ls-files public/images', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
}

function listChanged() {
  // --no-renames : un rename git (ex: NFD→NFC) ne génère plus une seule ligne `R`
  // (que --diff-filter=AM laisserait passer à la trappe) mais une paire D+A ; le A
  // correspond au nouveau chemin, ce qu'on veut optimiser.
  if (GH_BEFORE && GH_AFTER && GH_BEFORE !== ZERO_SHA && /^[0-9a-f]{40}$/i.test(GH_BEFORE)) {
    try {
      return execSync(`git diff --name-only --no-renames --diff-filter=AM ${GH_BEFORE} ${GH_AFTER}`, { encoding: 'utf8' })
        .split('\n').filter(Boolean)
    } catch (e) {
      console.warn(`git diff ${GH_BEFORE}..${GH_AFTER} failed: ${e.message}`)
    }
  }
  try {
    return execSync('git diff --name-only --no-renames --diff-filter=AM HEAD^..HEAD', { encoding: 'utf8' })
      .split('\n').filter(Boolean)
  } catch {
    return listAllTracked()
  }
}

function pickCandidates() {
  if (flagOnly) return flagOnly.split(',').map(s => s.trim()).filter(Boolean)
  const isBackfill = flagAll || GH_EVENT === 'workflow_dispatch'
  return isBackfill ? listAllTracked() : listChanged()
}

const isBackfill = flagAll || GH_EVENT === 'workflow_dispatch'
const allCandidates = pickCandidates()
let targets = allCandidates.filter(f =>
  f.startsWith('public/images/') &&
  /\.(jpe?g|png)$/i.test(f)
)
if (flagLimit) targets = targets.slice(0, flagLimit)

if (!targets.length) {
  console.log('No images to optimize.')
  process.exit(0)
}

console.log(`Mode: ${isBackfill ? 'backfill' : 'diff'}${flagDryRun ? ' (dry-run)' : ''}${flagForce ? ' [force]' : ''}`)
console.log(`Candidates: ${targets.length}`)

let totalBefore = 0, totalAfter = 0, processed = 0, skipped = 0, missing = 0

for (const file of targets) {
  if (!existsSync(file)) {
    console.log(`skip (deleted): ${file}`)
    missing++
    continue
  }

  const out = file.replace(/\.(jpe?g|png)$/i, '.webp')

  if (existsSync(out) && !flagForce && (isBackfill || statSync(out).mtimeMs >= statSync(file).mtimeMs)) {
    console.log(`skip (twin exists): ${file}`)
    skipped++
    continue
  }

  const sourceBytes = statSync(file).size
  const meta = await sharp(file).metadata()
  let width = meta.width ?? MAX_WIDTH

  let pipeline = sharp(file).rotate()
  if (width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    width = MAX_WIDTH
  }

  let buffer = null
  let usedQuality = QUALITIES[QUALITIES.length - 1]
  for (const q of QUALITIES) {
    buffer = await pipeline.clone().webp({ quality: q, effort: 5 }).toBuffer()
    usedQuality = q
    if (buffer.byteLength <= TARGET_BYTES) break
  }

  if (buffer.byteLength > TARGET_BYTES) {
    const newWidth = Math.max(320, Math.floor((width * FALLBACK_WIDTH_FACTOR) / 2) * 2)
    buffer = await sharp(file)
      .rotate()
      .resize({ width: newWidth, withoutEnlargement: true })
      .webp({ quality: QUALITIES[QUALITIES.length - 1], effort: 5 })
      .toBuffer()
    width = newWidth
    usedQuality = QUALITIES[QUALITIES.length - 1]
    console.log(`   fallback resize → ${newWidth}px @ q=${usedQuality}`)
  }

  if (buffer.byteLength >= sourceBytes) {
    console.log(`skip (no gain): ${file}  ${(sourceBytes / 1024).toFixed(0)} KB -> ${(buffer.byteLength / 1024).toFixed(0)} KB`)
    skipped++
    continue
  }

  if (!flagDryRun) writeFileSync(out, buffer)

  totalBefore += sourceBytes
  totalAfter += buffer.byteLength
  processed++
  const ratio = ((1 - buffer.byteLength / sourceBytes) * 100).toFixed(1)
  console.log(
    `OK ${file}\n   -> ${out}  ${(sourceBytes / 1024).toFixed(0)} KB -> ${(buffer.byteLength / 1024).toFixed(0)} KB  (-${ratio}%, q=${usedQuality}, w=${width}px${flagDryRun ? ', dry' : ''})`
  )
}

console.log('\n========== Summary ==========')
console.log(`Processed:        ${processed}`)
console.log(`Skipped (twin):   ${skipped}`)
console.log(`Missing/deleted:  ${missing}`)
if (processed) {
  const avgRatio = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(`Total before:     ${(totalBefore / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Total after:      ${(totalAfter / 1024 / 1024).toFixed(2)} MB`)
  console.log(`Avg compression:  ${avgRatio}%`)
}
console.log('=============================')

// Rebuild full webp manifest from disk so components can swap .jpg → .webp.
// Normalize NFC : macOS APFS peut stocker des noms en NFD ; sans normalisation,
// `webpSet.has(...)` échoue pour les fichiers avec accents (é, è, ï...) car le
// JPG et son jumeau WebP peuvent avoir été créés à des moments différents avec
// des encodages différents.
function walk(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${e.name}`.normalize('NFC')
    if (e.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const allFiles = walk('public/images')
const webpSet = new Set(allFiles.filter(f => f.endsWith('.webp')))
const manifest = {}

// Préserve les entries existantes dont le WebP est toujours sur disque.
// Sans ça, le manifest perd les mappings dès que l'original JPG/PNG est
// supprimé par un cleanup séparé (ex: commit 10787a8 qui retire les
// originaux pour alléger le bundle Netlify). Les composants utilisant
// resolveImage() continueraient sinon à servir le chemin source → 404.
const manifestPath = 'lib/webp-manifest.json'
if (existsSync(manifestPath)) {
  try {
    const existing = JSON.parse(readFileSync(manifestPath, 'utf8'))
    for (const [src, webp] of Object.entries(existing)) {
      const webpDisk = `public${webp}`
      if (webpSet.has(webpDisk.normalize('NFC'))) manifest[src] = webp
    }
  } catch (e) {
    console.warn(`Could not parse existing manifest: ${e.message}`)
  }
}

// Puis ajoute / met à jour à partir des paires JPG+WebP actuellement sur disque
for (const f of allFiles) {
  if (!/\.(jpe?g|png)$/i.test(f)) continue
  const webpDisk = f.replace(/\.(jpe?g|png)$/i, '.webp')
  if (!webpSet.has(webpDisk)) continue
  const sourceWeb = f.replace(/^public/, '')
  const webpWeb = webpDisk.replace(/^public/, '')
  manifest[sourceWeb] = webpWeb
}
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)))
if (!flagDryRun) {
  writeFileSync('lib/webp-manifest.json', JSON.stringify(sorted, null, 2) + '\n')
}
console.log(`Manifest entries: ${Object.keys(sorted).length}${flagDryRun ? ' (dry)' : ''}`)
