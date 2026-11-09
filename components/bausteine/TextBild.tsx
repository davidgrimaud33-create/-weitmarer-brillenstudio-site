import type { Baustein } from '@/lib/bausteine/typen'
import { Bild } from '@/components/Gestaltung'
import { absaetze, Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'text-bild' }>

/** Baustein „Text mit Bild“: wie der Abschnitt Reparatur auf Service & Preise, Bild links oder rechts */
export function TextBild({ titel, text, bild, bildAlt, bildSeite }: Props) {
  const links = bildSeite === 'links'
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-14 px-6 py-28">
        <div className={`a-reveal relative h-[360px] min-w-0 flex-[1_1_480px] overflow-hidden shadow-[0_60px_100px_-60px_rgba(10,98,168,0.55)] sm:h-[520px] ${links ? 'rounded-[32px_280px_32px_32px]' : 'order-last rounded-[280px_32px_32px_32px]'}`}>
          <Bild src={bild} alt={bildAlt} />
        </div>
        <div className="a-reveal min-w-0 flex-[1_1_480px]">
          {titel && <Ueberschrift className="mb-5">{titel}</Ueberschrift>}
          <div className="flex flex-col gap-4">
            {absaetze(text).map((a, i) => (
              <p key={i} className="m-0 whitespace-pre-line text-text-2">{a}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
