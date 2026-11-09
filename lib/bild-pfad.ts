export const BREITEN = [640, 1080, 1920] as const

/** Originalpfad → Breite → Ausgabepfad (erzeugt von scripts/bildgroessen.mjs) */
export type BildManifest = Record<string, Record<number, string>>

/**
 * Liefert die erzeugte Bildgröße mit der nächstgrößeren Breite
 * (oder die größte vorhandene). Unbekannte Pfade (Logo, SVG, …) bleiben unverändert.
 */
export function bildPfad(src: string, breite: number, manifest: BildManifest): string {
  const eintrag = manifest[src]
  if (!eintrag) return src
  const breiten = Object.keys(eintrag).map(Number).sort((a, b) => a - b)
  if (breiten.length === 0) return src
  const passend = breiten.find((b) => b >= breite) ?? breiten[breiten.length - 1]
  return eintrag[passend]
}
