import type { Baustein } from '@/lib/bausteine/typen'
import { AktionenListe } from '@/components/Aktionen'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'aktionen' }>

/** Baustein „Aktionen“: vorhandene Aktionsliste wie auf Service & Preise (nur gültige Aktionen) */
export function AktionenBaustein({ titel }: Props) {
  return (
    <section className="mx-auto max-w-[1320px] px-6 py-28">
      <div className="a-reveal mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <Ueberschrift>{titel ?? 'Aktuelle Aktionen'}</Ueberschrift>
        <p className="m-0 max-w-[420px] text-text-3">Hier sehen Sie nur, was gerade gilt. Abgelaufene Angebote verschwinden automatisch.</p>
      </div>
      <AktionenListe />
    </section>
  )
}
