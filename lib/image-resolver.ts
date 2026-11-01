import manifest from './webp-manifest.json' with { type: 'json' }

const auto = manifest as Record<string, string>

/**
 * Tauscht ein JPG/PNG gegen seinen WebP-Zwilling, wenn scripts/optimize-images.mjs
 * einen erzeugt hat (läuft automatisch per GitHub Action bei jedem Push auf main/staging).
 */
export function resolveImage(src: string): string {
  return auto[src] ?? src
}
