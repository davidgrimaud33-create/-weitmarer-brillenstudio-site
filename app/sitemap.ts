import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/feature-flags'

export const dynamic = 'force-static'

const SEITEN: { pfad: string; prio: number }[] = [
  { pfad: '', prio: 1 },
  { pfad: '/sehhilfen', prio: 0.9 },
  { pfad: '/augengesundheit', prio: 0.9 },
  { pfad: '/service-preise', prio: 0.8 },
  { pfad: '/termin', prio: 0.8 },
  { pfad: '/ueber-uns', prio: 0.7 },
  { pfad: '/holzkern', prio: 0.6 },
  { pfad: '/impressum', prio: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const jetzt = new Date()
  return SEITEN.map((s) => ({ url: `${SITE_URL}${s.pfad}`, lastModified: jetzt, priority: s.prio }))
}
