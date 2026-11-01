'use client'

import Link from 'next/link'
import { useState } from 'react'

// Erste Orientierung – die echte Empfehlung kommt nach der Messung im Laden
const OPTIONEN = [
  { id: 'ferne', label: 'Für die Ferne', hint: 'Autofahren, Fernsehen', titel: 'Einstärkenglas mit HD-Schärfe', text: 'Ein Glas für eine Entfernung – auf Wunsch optimiert für Schärfe bis zum Rand.', oben: 36, unten: 0 },
  { id: 'naehe', label: 'Zum Lesen', hint: 'Buch, Handy, Handarbeit', titel: 'Einstärkenglas für die Nähe', text: 'Klar und entspannt auf Lesedistanz.', oben: 36, unten: 0 },
  { id: 'bildschirm', label: 'Am Bildschirm', hint: 'Büro, Laptop', titel: 'Komfort-Nah-Glas', text: 'Spezielle Gläser für Nähe und mittlere Distanz – entspannt am Arbeitsplatz.', oben: 16, unten: 18 },
  { id: 'alles', label: 'Für alles', hint: 'Eine Brille für den ganzen Tag', titel: 'Individuelles Gleitsichtglas', text: 'Fern, Mitte und Nah in einem Glas – individuell berechnet, mit 6 Monaten Verträglichkeitsgarantie.', oben: 18, unten: 20 },
]

export function GlasFinder() {
  const [id, setId] = useState('alles')
  const o = OPTIONEN.find((x) => x.id === id)!
  return (
    <div className="a-reveal min-w-0 flex-[1_1_560px] rounded-[32px] bg-white p-8 shadow-[0_30px_60px_-36px_rgba(14,27,43,0.35)]">
      <div className="text-sm font-bold uppercase tracking-[0.08em] text-text-3">Glas-Finder</div>
      <div className="condensed mt-1.5 text-[30px] leading-none">Wofür brauchen Sie Ihre Brille?</div>
      <div className="mt-5 grid grid-cols-2 gap-2.5" role="group" aria-label="Einsatzzweck wählen">
        {OPTIONEN.map((x) => {
          const an = x.id === id
          return (
            <button key={x.id} type="button" aria-pressed={an} onClick={() => setId(x.id)}
              className={`min-h-[76px] rounded-[18px] border px-4 py-3.5 text-left transition-colors ${an ? 'border-ink bg-ink text-white' : 'border-transparent bg-grund text-ink'}`}>
              <span className="block text-lg font-bold">{x.label}</span>
              <span className="block text-sm opacity-80">{x.hint}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5 rounded-[22px] bg-blau-zart p-6" aria-live="polite">
        <svg width="120" height="64" viewBox="0 0 120 64" fill="none" aria-hidden className="shrink-0">
          <rect x="4" y="10" width="48" height="44" rx="18" stroke="#0E1B2B" strokeWidth="3" />
          <rect x="68" y="10" width="48" height="44" rx="18" stroke="#0E1B2B" strokeWidth="3" />
          <path d="M52 26c4-5 12-5 16 0" stroke="#0E1B2B" strokeWidth="3" />
          {[8, 72].map((x) => (
            <g key={x}>
              <rect x={x} y="14" width="40" height={o.oben} rx="14" fill="#0A62A8" opacity="0.35" style={{ transition: 'height .4s' }} />
              {o.unten > 0 && <rect x={x} y={14 + o.oben} width="40" height={o.unten} rx="14" fill="#E2231A" opacity="0.4" />}
            </g>
          ))}
        </svg>
        <div className="min-w-[220px] flex-1">
          <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-blau">Unsere Empfehlung</div>
          <div className="mt-1 text-[26px] font-bold leading-[1.05] [font-stretch:78%]">{o.titel}</div>
          <div className="mt-1.5 text-[15px] text-[#33465A]">{o.text}</div>
        </div>
      </div>
      <p className="mt-3.5 text-[13px] text-text-3">Eine erste Orientierung – welches Glas wirklich passt, klären wir nach der Messung im persönlichen Gespräch.</p>
      <Link href={`/termin?anliegen=${id === 'alles' ? 'gleitsicht' : 'brille'}`} className="mt-4 inline-flex rounded-full bg-blau px-[22px] py-3 font-semibold text-white no-underline hover:text-white">Glasberatung anfragen</Link>
    </div>
  )
}
