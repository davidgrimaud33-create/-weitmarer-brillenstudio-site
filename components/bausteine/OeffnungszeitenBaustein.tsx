import type { Baustein } from '@/lib/bausteine/typen'
import { stammdaten } from '@/lib/content'
import { OeffnungszeitenKarte } from '@/components/Oeffnungszeiten'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'oeffnungszeiten' }>

/** Baustein „Öffnungszeiten / Anfahrt“: vorhandene Öffnungszeiten-Karte plus Adresse */
export function OeffnungszeitenBaustein({ titel }: Props) {
  return (
    <section className="mx-auto flex max-w-[1320px] flex-wrap items-start gap-14 px-6 py-28">
      <div className="a-reveal min-w-0 flex-[1_1_420px]">
        <Ueberschrift>{titel ?? 'So finden Sie uns'}</Ueberschrift>
        <p className="mt-6 text-xl text-text-2">{stammdaten.strasse}, {stammdaten.plz} {stammdaten.ort}</p>
        <p className="mt-1 text-text-3">{stammdaten.parkhinweis}</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <a href={stammdaten.routeLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-6 py-4 font-semibold text-white no-underline hover:text-white">Route planen</a>
          <a href={`tel:${stammdaten.telefonLink}`} className="rounded-full border border-ink/20 bg-white px-6 py-4 font-semibold text-ink no-underline hover:text-ink">{stammdaten.telefon}</a>
        </div>
      </div>
      <OeffnungszeitenKarte className="min-w-0 flex-[1_1_420px]" />
    </section>
  )
}
