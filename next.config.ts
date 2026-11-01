import type { NextConfig } from 'next'

// Bilder: wie bei MB Barbier – auf Netlify skaliert der Netlify Image CDN,
// in Production liefert zusätzlich eine Bunny-Pull-Zone aus (NEXT_PUBLIC_IMAGE_CDN
// im Netlify-UI der Production-Site setzen, z. B. https://wbs-images.b-cdn.net).
// Staging und lokal: ohne Bunny.
const IMAGE_CDN =
  process.env.CONTEXT === 'production' || process.env.CONTEXT === 'deploy-preview'
    ? process.env.IMAGE_CDN_URL || ''
    : ''

const STATIC_CDN_CACHE = [
  { key: 'Netlify-CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
]

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_IMAGE_CDN: IMAGE_CDN,
    NEXT_PUBLIC_ON_NETLIFY: process.env.NETLIFY === 'true' ? 'true' : 'false',
    // Version der Bild-URLs = deployter Commit → nach jedem Deploy frische Bilder im CDN
    NEXT_PUBLIC_IMAGE_VERSION: (process.env.COMMIT_REF || '').slice(0, 8),
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  async headers() {
    return [
      {
        source: '/:path(|sehhilfen|augengesundheit|service-preise|ueber-uns|holzkern|termin|impressum|datenschutz)',
        headers: STATIC_CDN_CACHE,
      },
    ]
  },
}

export default nextConfig
