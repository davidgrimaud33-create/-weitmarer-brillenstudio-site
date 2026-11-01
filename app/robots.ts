import type { MetadataRoute } from 'next'
import { isStaging, SITE_URL } from '@/lib/feature-flags'

export default function robots(): MetadataRoute.Robots {
  // Staging darf nie bei Google landen
  if (isStaging) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
