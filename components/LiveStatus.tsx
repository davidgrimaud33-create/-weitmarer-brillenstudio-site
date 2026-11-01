'use client'

import { useEffect, useState } from 'react'
import { oeffnungszeiten } from '@/lib/content'
import { oeffnungsStatus, type Status } from '@/lib/oeffnungszeiten'

/** Live-Öffnungsstatus. Wird erst im Browser berechnet (Seiten sind statisch gebaut). */
export function useOeffnungsStatus(): Status | null {
  const [status, setStatus] = useState<Status | null>(null)
  useEffect(() => {
    const update = () => setStatus(oeffnungsStatus(oeffnungszeiten))
    update()
    const t = setInterval(update, 60_000)
    return () => clearInterval(t)
  }, [])
  return status
}

export function LiveStatus({ variante = 'lang' }: { variante?: 'lang' | 'kurz' }) {
  const status = useOeffnungsStatus()
  const farbe = status ? (status.offen ? '#34C778' : '#E2231A') : '#8FA0B2'
  return (
    <span className="inline-flex items-center gap-2.5" aria-live="polite">
      <span className={status?.offen ? 'a-pulse' : ''} style={{ width: 9, height: 9, borderRadius: 999, background: farbe }} />
      <span className="font-semibold">{status ? (variante === 'lang' ? status.text : status.kurz) : 'Öffnungszeiten'}</span>
    </span>
  )
}
