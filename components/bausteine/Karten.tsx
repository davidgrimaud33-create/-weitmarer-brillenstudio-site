import type { Baustein } from '@/lib/bausteine/typen'
import { Bild, Verweis } from '@/components/Gestaltung'
import { Ueberschrift } from './Ueberschrift'

type Props = Extract<Baustein, { typ: 'karten' }>
type Karte = Props['karten'][number]

function Inhalt({ k }: { k: Karte }) {
  return (
    <>
      {k.bild && (
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-grund">
          <Bild src={k.bild} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-end">
        <div className="condensed text-[30px] leading-[1.05] text-ink">{k.titel}</div>
        <div className="mt-1.5 text-[15px] text-text-3">{k.text}</div>
        {k.link && <div className="mt-4 font-semibold text-blau">Mehr erfahren <span aria-hidden className="pfeil inline-block">→</span></div>}
      </div>
    </>
  )
}

/** Baustein „Karten“: Raster wie „Was die Uhren besonders macht“ (Holzkern) */
export function Karten({ titel, karten }: Props) {
  return (
    <section className="mx-auto max-w-[1320px] px-6 py-28">
      {titel && <Ueberschrift className="a-reveal mb-10">{titel}</Ueberschrift>}
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4 p-0">
        {karten.map((k, i) => {
          const klasse = 'flex h-full min-h-[240px] flex-col gap-6 rounded-[28px] bg-white p-8'
          return (
            <li key={i} className="a-reveal">
              {k.link ? (
                <Verweis href={k.link} className={`kachel hebt no-underline ${klasse}`}><Inhalt k={k} /></Verweis>
              ) : (
                <div className={klasse}><Inhalt k={k} /></div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
