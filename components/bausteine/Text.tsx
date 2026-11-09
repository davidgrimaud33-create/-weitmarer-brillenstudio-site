import type { Baustein } from '@/lib/bausteine/typen'
import { absaetze, Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'text' }>

/** Baustein „Text“: Überschrift und Absätze (Leerzeile = neuer Absatz) */
export function Text({ titel, text }: Props) {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-24">
      {titel && <Ueberschrift className="a-reveal mb-6">{titel}</Ueberschrift>}
      <div className="a-reveal flex flex-col gap-5">
        {absaetze(text).map((a, i) => (
          <p key={i} className="m-0 whitespace-pre-line text-xl text-text-2">{a}</p>
        ))}
      </div>
    </section>
  )
}
