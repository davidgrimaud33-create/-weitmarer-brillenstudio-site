'use client'

/**
 * Loader für next/image (Muster aus dem MB-Barbier-Projekt):
 * - auf Netlify: Skalierung über den Netlify Image CDN (/.netlify/images),
 *   in Production optional vor einer Bunny-Pull-Zone (NEXT_PUBLIC_IMAGE_CDN)
 * - lokal (next dev): Originaldatei
 */
const CDN = process.env.NEXT_PUBLIC_IMAGE_CDN || ''
const ON_NETLIFY = process.env.NEXT_PUBLIC_ON_NETLIFY === 'true'
const VERSION = process.env.NEXT_PUBLIC_IMAGE_VERSION || ''

type LoaderParams = { src: string; width: number; quality?: number }

export default function imageLoader({ src, width, quality }: LoaderParams): string {
  const q = quality || 75
  if (!ON_NETLIFY) return `${src}?w=${width}`
  return `${CDN}/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${q}${VERSION ? `&v=${VERSION}` : ''}`
}
