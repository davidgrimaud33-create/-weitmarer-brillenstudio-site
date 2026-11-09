import type { NextConfig } from 'next'

// Staging-Erkennung: Cloudflare Workers Builds setzt WORKERS_CI_BRANCH (Name des gebauten Branches).
// Jeder Branch außer `main` gilt als Testversion (keine Google-Indexierung).
// Lokal / ohne Cloudflare-Variable gilt der Wert von NEXT_PUBLIC_IS_STAGING.
const branch = process.env.WORKERS_CI_BRANCH
const IS_STAGING = branch ? String(branch !== 'main') : process.env.NEXT_PUBLIC_IS_STAGING || ''

const nextConfig: NextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_IS_STAGING: IS_STAGING,
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
}

export default nextConfig
