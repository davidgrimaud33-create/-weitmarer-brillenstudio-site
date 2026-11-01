'use client'

import { useState } from 'react'

/** Beispielrechnung RELAX24 – nur aktiv, wenn content/garantien.json → relax24.rechnerAktiv = true */
export function RatenRechner() {
  const [preis, setPreis] = useState(480)
  const rate = (preis / 24).toFixed(2).replace('.', ',')
  return (
    <div>
      <div className="text-sm font-bold uppercase tracking-[0.08em] text-auf-dunkel">Beispielrechnung</div>
      <label className="mt-3.5 block font-semibold">
        Preis Ihrer Brille: <span className="text-blau-hell">{preis.toLocaleString('de-DE')} €</span>
        <input type="range" min={100} max={1500} step={10} value={preis} onChange={(e) => setPreis(Number(e.target.value))} className="mt-3 h-8 w-full accent-blau" />
      </label>
      <div className="mt-6 flex items-baseline gap-2.5">
        <div className="text-[88px] font-[790] leading-[0.9] [font-stretch:62%]">{rate} €</div>
        <div className="text-auf-dunkel">pro Monat<br />× 24 Monate</div>
      </div>
    </div>
  )
}
