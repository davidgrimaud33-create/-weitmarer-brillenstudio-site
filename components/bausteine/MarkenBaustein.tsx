import type { Baustein } from '@/lib/bausteine/typen'
import { marken } from '@/lib/content'
import { MarkenListe } from '@/components/Marken'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'marken' }>

/** Baustein „Marken“: Markenschilder aus content/marken.json wie auf Über uns */
export function MarkenBaustein({ titel }: Props) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-[1320px] px-6 py-24">
        <div className="a-reveal mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Ueberschrift>{titel ?? `${marken.length} Marken`}</Ueberschrift>
          <p className="m-0 max-w-[420px] text-auf-dunkel">Von preiswerten Aktionsmodellen bis zu namhaften Designermarken.</p>
        </div>
        <MarkenListe />
      </div>
    </section>
  )
}
