import type { Baustein } from '@/lib/bausteine/typen'
import { Faq } from '@/components/Faq'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'faq' }>

/** Baustein „Häufige Fragen“: vorhandene Faq-Komponente wie auf Augengesundheit */
export function FaqBaustein({ titel, eintraege }: Props) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[980px] px-6 py-24">
        {titel && <Ueberschrift className="a-reveal mb-8">{titel}</Ueberschrift>}
        <Faq eintraege={eintraege} />
      </div>
    </section>
  )
}
