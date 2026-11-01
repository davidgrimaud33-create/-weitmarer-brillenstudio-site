'use client'

import { oeffnungszeiten } from '@/lib/content'
import { kommendeAusnahmen, wochenTabelle } from '@/lib/oeffnungszeiten'
import { useOeffnungsStatus } from './LiveStatus'

const tabelle = wochenTabelle(oeffnungszeiten)

/** Wochentabelle mit „heute“-Hervorhebung, Live-Status und kommenden Feiertagen/Urlaub */
export function OeffnungszeitenKarte({ className }: { className?: string }) {
  const status = useOeffnungsStatus()
  const ausnahmen = status ? kommendeAusnahmen(oeffnungszeiten) : []
  return (
    <div className={`rounded-[28px] border border-ink/10 bg-white p-8 ${className ?? ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="display m-0 text-[32px]">Öffnungszeiten</h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-grund px-3 py-1.5 text-sm font-semibold">
          <span style={{ width: 8, height: 8, borderRadius: 999, background: status ? (status.offen ? '#34C778' : '#E2231A') : '#8FA0B2' }} />
          {status?.kurz ?? '…'}
        </span>
      </div>
      <dl className="mt-4 flex flex-col">
        {tabelle.map((z) => {
          const heute = status?.tag === z.tag
          return (
            <div key={z.tag} className={`flex justify-between gap-3 rounded-[10px] px-3 py-2.5 text-base ${heute ? 'bg-blau-zart font-bold' : 'text-text-2'}`}>
              <dt>{z.name}{heute ? ' (heute)' : ''}</dt>
              <dd className="m-0">{z.zeit}</dd>
            </div>
          )
        })}
      </dl>
      {ausnahmen.length > 0 && (
        <div className="mt-4 rounded-2xl bg-[#FFF1EF] p-4 text-[15px] text-[#7A1E18]">
          <strong>Abweichende Zeiten:</strong>
          <ul className="mt-1 space-y-0.5">
            {ausnahmen.map((a) => (
              <li key={a.datum}>
                {new Date(a.datum + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long' })}:{' '}
                {a.zeiten.length ? a.zeiten.map(([v, b]) => `${v}–${b}`).join(', ') + ' Uhr' : 'geschlossen'} · {a.grund}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
