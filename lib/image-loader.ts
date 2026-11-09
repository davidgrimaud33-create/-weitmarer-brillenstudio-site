'use client'

import manifest from './bild-manifest.json'
import { bildPfad, type BildManifest } from './bild-pfad'

/**
 * Loader für next/image: nimmt die beim Build erzeugten WebP-Größen
 * (scripts/bildgroessen.mjs). Bilder ohne Eintrag (Logo, SVG) bleiben unverändert.
 */
type LoaderParams = { src: string; width: number; quality?: number }

export default function imageLoader({ src, width }: LoaderParams): string {
  return bildPfad(src, width, manifest as BildManifest)
}
