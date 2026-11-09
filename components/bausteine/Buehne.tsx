import type { Baustein } from '@/lib/bausteine/typen'
import { HeroGrund, LinsenBild, Verweis } from '@/components/Gestaltung'
import { UMBRUCH } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'buehne' }>

/** Baustein „Bühne“: großer Seitenkopf wie auf Über uns / Holzkern */
export function Buehne({ titel, unterzeile, bild, knopf }: Props) {
  return (
    <HeroGrund>
      <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-14">
        <div className="flex flex-wrap items-center gap-14">
          <div className="min-w-0 flex-[1_1_520px]">
            <h1 className={`display a-rise m-0 text-[clamp(48px,8.4vw,128px)] !leading-[0.86] [font-stretch:65%] ${UMBRUCH}`}>{titel}</h1>
            {unterzeile && <p className="a-rise a-d1 mt-6 max-w-[560px] text-[21px] text-text-2">{unterzeile}</p>}
            {knopf && (
              <div className="a-rise a-d2 mt-8 flex flex-wrap gap-3">
                <Verweis href={knopf.link} className="rounded-full bg-ink px-6 py-4 font-semibold text-white no-underline hover:text-white">{knopf.text}</Verweis>
              </div>
            )}
          </div>
          {bild && (
            <div className="relative h-[420px] min-w-0 flex-[1_1_460px] sm:h-[600px]">
              <LinsenBild src={bild} alt="" priority />
            </div>
          )}
        </div>
      </section>
    </HeroGrund>
  )
}
