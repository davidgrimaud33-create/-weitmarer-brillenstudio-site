import type { Baustein } from '@/lib/bausteine/typen'
import { Bild } from '@/components/Gestaltung'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'galerie' }>

/** Baustein „Galerie“: Fotoraster wie „Eine kleine Vorauswahl“ (Holzkern) */
export function Galerie({ titel, bilder }: Props) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1320px] px-6 py-28">
        {titel && <Ueberschrift className="a-reveal mb-10">{titel}</Ueberschrift>}
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3">
          {bilder.map((b, i) => (
            <li key={i} className="kachel a-reveal relative aspect-square overflow-hidden rounded-[24px] bg-grund">
              <Bild src={b.src} alt={b.alt} sizes="(max-width: 768px) 50vw, 33vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
