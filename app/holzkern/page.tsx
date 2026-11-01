import type { Metadata } from 'next'
import Link from 'next/link'
import { besonderes, stammdaten } from '@/lib/content'
import { Bild, Brotkruemel, HeroGrund, LinsenBild } from '@/components/Gestaltung'

export const metadata: Metadata = {
  title: 'Holzkern-Uhren in Bochum',
  description:
    'Holzkern-Uhren aus Holz und Stein im Weitmarer Brillenstudio in Bochum-Weitmar – jedes Stück ein Unikat. Im Laden anschauen und anprobieren.',
  alternates: { canonical: '/holzkern' },
}

const hk = besonderes.holzkern

// Eigene Formulierung auf Basis der Herstellerangaben (keine Kopie des Herstellertextes → kein Duplicate Content)
const MATERIAL = [
  { titel: 'Holz', text: 'Gehäuse und Armbänder aus edlen Harthölzern aus verschiedenen Regionen der Welt. Naturholz macht die Uhren leicht und angenehm zu tragen.' },
  { titel: 'Stein', text: 'Viele Zifferblätter sind aus Gestein gefertigt. Zusammen mit der Maserung des Holzes entsteht bei jeder Uhr ein eigenes Muster.' },
  { titel: 'Unikat', text: 'Weil Holz und Stein natürlich gewachsen sind, gleicht keine Uhr der anderen – trotz schlanker, klassischer Form.' },
]

export default function Holzkern() {
  return (
    <>
      <HeroGrund>
        <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-8">
          <Brotkruemel seite="Holzkern-Uhren" />
          <div className="mt-8 flex flex-wrap items-center gap-14">
            <div className="min-w-0 flex-[1_1_520px]">
              <div className="kicker a-rise">Im Laden entdecken</div>
              <h1 className="display a-rise a-d1 mt-4 text-[clamp(56px,8.4vw,128px)] !leading-[0.86] [font-stretch:65%]">
                Zeit aus<br />Holz und<br /><span className="verlauf-text">Stein.</span>
              </h1>
              <p className="a-rise a-d2 mt-6 max-w-[560px] text-[21px] text-text-2">
                Neben Brillen führen wir die Uhren von Holzkern. Gehäuse aus edlem Holz, Zifferblätter aus Stein – jedes Stück ein Unikat.
              </p>
              <div className="a-rise a-d3 mt-8 flex flex-wrap gap-3">
                <a href={stammdaten.routeLink} target="_blank" rel="noopener" className="rounded-full bg-ink px-6 py-4 font-semibold text-white no-underline hover:text-white">Im Laden anschauen</a>
                <a href={`tel:${stammdaten.telefonLink}`} className="rounded-full border border-ink/20 bg-white px-6 py-4 font-semibold text-ink no-underline hover:text-ink">Nach einem Modell fragen</a>
              </div>
            </div>
            <div className="relative h-[600px] min-w-0 flex-[1_1_460px]">
              <LinsenBild src={hk.heroBild} alt={hk.heroAlt} priority />
            </div>
          </div>
        </section>
      </HeroGrund>

      <section className="mx-auto max-w-[1320px] px-6 py-28">
        <h2 className="display a-reveal mb-10 text-[clamp(40px,4.6vw,68px)]">Was die Uhren besonders macht</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {MATERIAL.map((m, i) => (
            <div key={m.titel} className={`hebt a-reveal flex min-h-[240px] flex-col justify-between rounded-[28px] p-8 ${i === 1 ? 'bg-ink text-white' : 'bg-white'}`}>
              <div className={`text-[72px] font-[790] leading-[0.85] [font-stretch:62%] ${i === 1 ? 'text-blau-hell' : 'text-blau'}`}>0{i + 1}</div>
              <div>
                <div className="condensed text-[30px]">{m.titel}</div>
                <div className={`mt-1 text-[15px] ${i === 1 ? 'text-auf-dunkel' : 'text-text-3'}`}>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-28">
          <div className="a-reveal mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">Eine kleine Vorauswahl</h2>
            <p className="m-0 max-w-[420px] text-text-3">Viele weitere Modelle finden Sie bei uns im Geschäft.</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 [&>li:nth-child(1)]:md:col-span-2 [&>li:nth-child(1)]:md:row-span-2">
            {hk.galerie.map((g) => (
              <li key={g.bild} className="kachel a-reveal relative aspect-square overflow-hidden rounded-[24px] bg-grund">
                <Bild src={g.bild} alt={g.alt} sizes="(max-width: 768px) 50vw, 33vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 py-24">
        <div className="a-reveal relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[36px] bg-ink p-[clamp(36px,6vw,72px)] text-white">
          <div className="relative max-w-[680px]">
            <h2 className="display m-0 text-[clamp(40px,5vw,76px)]">Am Handgelenk wirkt Holz am besten.</h2>
            <p className="mt-4 text-[19px] text-white/75">Kommen Sie vorbei und probieren Sie die Uhren an – {stammdaten.strasse}, {stammdaten.stadtteil}.</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <a href={stammdaten.routeLink} target="_blank" rel="noopener" className="rounded-full bg-white px-7 py-4 text-lg font-semibold text-ink no-underline hover:text-ink">Route planen</a>
            <Link href="/sehhilfen#brillen" className="rounded-full border border-white/50 px-7 py-4 text-lg font-semibold text-white no-underline hover:text-white">Unsere Brillenmarken</Link>
          </div>
        </div>
      </section>
    </>
  )
}
