import Link from 'next/link'
import { stammdaten } from '@/lib/content'
import { Icon } from './Icon'

/** Feste Schnellzugriffsleiste unten – nur auf dem Handy */
export function MobilLeiste() {
  return (
    <nav aria-label="Schnellzugriff" className="fixed inset-x-3 bottom-3.5 z-40 grid grid-cols-3 gap-1.5 rounded-[22px] bg-ink p-2 shadow-[0_18px_40px_-12px_rgba(14,27,43,0.5)] lg:hidden">
      <a href={`tel:${stammdaten.telefonLink}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[13px] font-semibold text-white no-underline hover:text-white">
        <Icon name="telefon" size={20} />Anrufen
      </a>
      <Link href="/termin" className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-blau text-[13px] font-semibold text-white no-underline hover:text-white">
        <Icon name="kalender" size={20} />Termin
      </Link>
      <a href={stammdaten.routeLink} target="_blank" rel="noopener" className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl text-[13px] font-semibold text-white no-underline hover:text-white">
        <Icon name="ort" size={20} />Route
      </a>
    </nav>
  )
}
