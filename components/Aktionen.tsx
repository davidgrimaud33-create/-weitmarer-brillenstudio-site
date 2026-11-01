'use client'

import { useEffect, useState } from 'react'
import { aktionen, type Aktion } from '@/lib/content'
import { aktiveAktionen, berlinJetzt } from '@/lib/oeffnungszeiten'

/**
 * Zeigt nur Aktionen, die HEUTE gelten. Die Prüfung läuft im Browser,
 * damit abgelaufene Angebote sofort verschwinden – auch ohne neuen Build.
 */
export function useAktiveAktionen(nurStartseite = false) {
  const [liste, setListe] = useState<(Aktion & { restTage: number })[] | null>(null)
  useEffect(() => {
    const jetzt = berlinJetzt()
    const quelle = nurStartseite ? aktionen.filter((a) => a.aufStartseite) : aktionen
    setListe(
      aktiveAktionen(quelle, jetzt).map((a) => ({
        ...a,
        restTage: Math.ceil((new Date(a.ende + 'T23:59:59').getTime() - jetzt.getTime()) / 86400000),
      })),
    )
  }, [nurStartseite])
  return liste
}

const datum = (iso: string) => new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })

export function AktionsKarte({ a, gross }: { a: Aktion & { restTage: number }; gross?: boolean }) {
  return (
    <div className="a-reveal relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[28px] bg-pupille p-9 text-white">
      <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0) 65%)' }} />
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold uppercase tracking-[0.08em]">Aktuelle Aktion</span>
        <span className="rounded-full bg-white/20 px-3 py-1.5 text-[13px] font-semibold">{a.restTage <= 1 ? 'Nur noch heute' : `Noch ${a.restTage} Tage`}</span>
      </div>
      <div className="relative">
        <div className={`display ${gross ? 'text-[52px]' : 'text-[46px]'}`}>{a.titel}</div>
        <div className="mt-3 text-[17px] text-[#FFE3E1]">{a.text}</div>
        <div className="mt-4 text-sm text-[#FFD0CC]">Gültig bis {datum(a.ende)}</div>
      </div>
    </div>
  )
}

export function AktionStartseite() {
  const liste = useAktiveAktionen(true)
  if (!liste) return <div className="min-h-[420px] rounded-[28px] bg-pupille/10" aria-hidden />
  if (!liste.length)
    return (
      <div className="flex min-h-[420px] flex-col justify-end rounded-[28px] bg-blau p-9 text-white">
        <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#BFDDF5]">Immer inklusive</div>
        <div className="display mt-3 text-[46px]">3 Jahre Garantie auf jede Brille</div>
      </div>
    )
  return <AktionsKarte a={liste[0]} gross />
}

export function AktionenListe() {
  const liste = useAktiveAktionen(false)
  if (!liste) return <div className="min-h-[320px]" aria-hidden />
  if (!liste.length)
    return (
      <div className="rounded-[28px] bg-white p-10 text-center">
        <div className="condensed text-[32px]">Gerade läuft keine Aktion.</div>
        <div className="mt-1.5 text-text-3">Unsere Garantien gelten trotzdem immer – schauen Sie bald wieder vorbei.</div>
      </div>
    )
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-[18px]">
      {liste.map((a) => <AktionsKarte key={a.titel + a.start} a={a} />)}
    </div>
  )
}
