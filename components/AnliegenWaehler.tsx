'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { Anliegen } from '@/lib/content'

/** „Was führt Sie zu uns?“ – Auswahl wechselt Empfehlung und führt mit Anliegen zur Terminanfrage */
export function AnliegenWaehler({ anliegen }: { anliegen: Anliegen[] }) {
  const [id, setId] = useState(anliegen[0]?.id)
  const aktiv = anliegen.find((a) => a.id === id) ?? anliegen[0]
  return (
    <div className="glas a-rise a-d3 mt-9 rounded-[26px] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_40px_80px_-40px_rgba(10,98,168,.45),0_18px_40px_-28px_rgba(14,27,43,.35)]">
      <div className="mb-3 text-[15px] font-semibold text-text-3">Was führt Sie zu uns?</div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Anliegen wählen">
        {anliegen.map((a) => {
          const an = a.id === aktiv.id
          return (
            <button
              key={a.id}
              type="button"
              aria-pressed={an}
              onClick={() => setId(a.id)}
              className={`min-h-11 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition-colors ${an ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white text-ink hover:border-ink/40'}`}
            >
              {a.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl bg-grund p-3.5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full">
          <Image src={aktiv.bild} alt="" fill sizes="96px" className="object-cover" />
        </div>
        <div className="min-w-[180px] flex-1">
          <div className="text-[19px] font-bold">{aktiv.titel}</div>
          <div className="text-[15px] text-text-2">{aktiv.text}</div>
        </div>
        <Link href={`/termin?anliegen=${aktiv.id}`} className="rounded-full bg-blau px-[18px] py-3 text-[15px] font-semibold text-white no-underline hover:bg-blau-dunkel hover:text-white">
          {aktiv.cta}
        </Link>
      </div>
    </div>
  )
}
