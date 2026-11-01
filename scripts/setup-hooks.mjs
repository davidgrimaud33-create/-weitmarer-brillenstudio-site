#!/usr/bin/env node
/**
 * Configure git pour utiliser .githooks/ comme hooks dir.
 * Lancé via npm `prepare` après chaque install — idempotent et silencieux
 * dans les contextes sans git (CI Netlify avec checkout shallow, etc.).
 */

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

function silent() {
  // Sortie discrète pour éviter de polluer les logs CI.
}

if (!existsSync('.git') && !existsSync('.githooks')) {
  silent()
  process.exit(0)
}

try {
  const current = execSync('git config --get core.hooksPath', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim()
  if (current === '.githooks') {
    silent()
    process.exit(0)
  }
} catch {
  // Pas de hooksPath configuré, on continue.
}

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' })
  console.log('✓ git hooks → .githooks (garde-fou anti-fichiers-lourds actif)')
} catch (e) {
  // Pas en repo git ou git indispo → on n'échoue pas l'install.
  silent()
}
