import type { MetadataRoute } from 'next'

import { isStaging, SITE_URL } from '@/lib/feature-flags'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  // Staging darf nie bei Google landen
  if (isStaging) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/musterbuch'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
