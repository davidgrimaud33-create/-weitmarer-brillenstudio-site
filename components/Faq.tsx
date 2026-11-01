'use client'

import { useState } from 'react'

export function Faq({ eintraege }: { eintraege: { frage: string; antwort: string }[] }) {
  const [offen, setOffen] = useState(0)
  return (
    <div className="flex flex-col gap-2.5">
      {eintraege.map((f, i) => {
        const an = offen === i
        return (
          <div key={f.frage} className="overflow-hidden rounded-[18px] bg-grund">
            <h3 className="m-0">
              <button type="button" aria-expanded={an} aria-controls={`faq-${i}`} onClick={() => setOffen(an ? -1 : i)}
                className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[19px] font-semibold text-ink">
                <span>{f.frage}</span>
                <span aria-hidden className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl font-normal transition-transform duration-300 ${an ? 'rotate-45 bg-blau text-white' : 'bg-white text-ink'}`}>+</span>
              </button>
            </h3>
            <div id={`faq-${i}`} hidden={!an} className="px-5 pb-5 text-text-2">{f.antwort}</div>
          </div>
        )
      })}
    </div>
  )
}
