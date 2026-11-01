'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SUCHINDEX } from '@/lib/navigation'
import { Icon } from './Icon'

/** Schnelle Seitensuche über alle Bereiche (statischer Index in lib/navigation.ts) */
export function Suche({ offen, schliessen }: { offen: boolean; schliessen: () => void }) {
  const [q, setQ] = useState('')
  const eingabe = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!offen) return
    setQ('')
    setTimeout(() => eingabe.current?.focus(), 30)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && schliessen()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [offen, schliessen])

  const treffer = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return SUCHINDEX.slice(0, 6)
    return SUCHINDEX.filter((e) => (e.titel + ' ' + e.stichworte).toLowerCase().includes(s))
  }, [q])

  if (!offen) return null
  return (
    <div role="dialog" aria-modal="true" aria-label="Seitensuche" className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 px-4 pt-[12vh] backdrop-blur-sm" onClick={schliessen}>
      <div className="w-full max-w-[640px] rounded-3xl bg-white p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center gap-3 rounded-2xl bg-grund px-4">
          <Icon name="suche" size={20} />
          <span className="sr-only">Suchbegriff</span>
          <input
            ref={eingabe}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Wonach suchen Sie? z. B. Gleitsicht, Screening, Öffnungszeiten"
            className="min-h-[56px] flex-1 bg-transparent text-lg outline-none"
          />
        </label>
        <ul className="mt-2 max-h-[50vh] overflow-auto p-1">
          {treffer.length === 0 && <li className="p-4 text-text-3">Nichts gefunden. Rufen Sie uns gern an: 0234 43 21 41</li>}
          {treffer.map((t) => (
            <li key={t.href}>
              {t.href.startsWith('http') ? (
                <a href={t.href} target="_blank" rel="noopener" onClick={schliessen} className="flex items-center justify-between rounded-xl px-4 py-3 text-ink no-underline hover:bg-blau-zart">
                  <span className="font-semibold">{t.titel}</span>
                  <span aria-hidden className="text-blau">↗</span>
                </a>
              ) : (
                <Link href={t.href} onClick={schliessen} className="flex items-center justify-between rounded-xl px-4 py-3 text-ink no-underline hover:bg-blau-zart">
                  <span className="font-semibold">{t.titel}</span>
                  <Icon name="pfeil" size={18} className="text-blau" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
