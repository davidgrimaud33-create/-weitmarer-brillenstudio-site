import type { Metadata } from 'next'
import { team, marken, stammdaten } from '@/lib/content'
import { Bild, Brotkruemel, CtaBand, HeroGrund, LinsenBild } from '@/components/Gestaltung'

export const metadata: Metadata = {
  title: 'Über uns: Team und Laden',
  description: 'Inhabergeführter Meisterbetrieb in Bochum-Weitmar: Claudia und Alexander Jäh mit einem Team aus sieben Augenoptikerinnen und Augenoptikern.',
  alternates: { canonical: '/ueber-uns' },
}

const meister = team.filter((m) => /meister/i.test(m.rolle)).length
const initialen = (n: string) => { const t = n.split(' '); return t[0][0] + t[t.length - 1][0] }

const GALERIE = [
  ['/images/laden/laden-aussen.jpg', 'Ladenfront an der Hattinger Straße', 'Hattinger Straße 252', 'breit'],
  ['/images/laden/laden-innen.jpg', 'Verkaufsraum mit Aquarium', 'Verkaufsraum', 'breit'],
  ['/images/laden/fassungen-hoch.jpg', 'Fassungen an der Wand', 'Fassungsauswahl', 'schmal'],
  ['/images/laden/lounge.jpg', 'Wartebereich mit Sesseln', 'Wartebereich', 'breit'],
  ['/images/leistungen/screening-geraet.jpg', 'Messraum mit Netzhautkamera', 'Messraum', 'schmal'],
  ['/images/laden/laden-beratung.jpg', 'Beratung im Verkaufsraum', 'Beratung', 'schmal'],
]

export default function UeberUns() {
  return (
    <>
      <HeroGrund>
        <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-8">
          <Brotkruemel seite="Über uns" />
          <div className="mt-8 flex flex-wrap items-center gap-14">
            <div className="min-w-0 flex-[1_1_520px]">
              <div className="kicker a-rise">Inhabergeführter Meisterbetrieb</div>
              <h1 className="display a-rise a-d1 mt-4 text-[clamp(56px,8.4vw,128px)] !leading-[0.86] [font-stretch:65%]">Persönlich.<br />Präzise.<br /><span className="verlauf-text">Aus Weitmar.</span></h1>
              <p className="a-rise a-d2 mt-6 max-w-[560px] text-[21px] text-text-2">Claudia und Alexander Jäh führen das {stammdaten.name} mit einem Team aus {team.length} Augenoptikerinnen und Augenoptikern – {meister} davon Meister.</p>
            </div>
            <div className="relative h-[600px] min-w-0 flex-[1_1_460px]">
              <LinsenBild src="/images/team/claudia-und-alexander-jaeh.jpg" alt="Claudia und Alexander Jäh im Weitmarer Brillenstudio" ausschnitt="50% 25%" priority />
              <div className="glas a-float absolute -left-[18px] bottom-10 rounded-[20px] px-[18px] py-4 shadow-[0_30px_60px_-28px_rgba(14,27,43,0.45)]">
                <div className="font-bold">Claudia &amp; Alexander Jäh</div>
                <div className="text-sm text-text-3">Inhaber seit {stammdaten.gruendungsjahr}</div>
              </div>
            </div>
          </div>
        </section>
      </HeroGrund>

      <section className="mx-auto flex max-w-[1320px] flex-wrap gap-14 px-6 py-28">
        <div className="a-reveal min-w-0 flex-[1_1_460px]">
          <h2 className="display text-[clamp(40px,4.6vw,68px)]">Unsere Geschichte</h2>
          <p className="mt-6 text-xl text-text-2">[Wie das Weitmarer Brillenstudio entstanden ist, seit wann es Claudia und Alexander führen und was sie antreibt. Gemeinsam mit Alexander in seinen Worten formulieren.]</p>
        </div>
        <ol className="m-0 flex min-w-0 flex-[1_1_520px] list-none flex-col gap-3.5 p-0">
          {[
            ['Meisterbetrieb', 'Kompetente Fachberatung eines inhabergeführten Meisterbetriebs.', 'bg-ink text-white'],
            ['Ihre Sehansprüche zuerst', 'Wir legen viel Wert auf individuelle Bedürfnisse – damit Sie bei Ihrer neuen Sehhilfe die richtige Entscheidung treffen.', 'bg-blau text-white'],
            ['Qualität zum fairen Preis', 'Hochwertige Produkte zum günstigen Preis – top in Qualität und Preis.', 'bg-blau-zart text-blau'],
          ].map(([t, x, farbe], i) => (
            <li key={t} className="a-reveal flex items-start gap-5 rounded-3xl bg-white p-6">
              <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[22px] condensed ${farbe}`}>0{i + 1}</span>
              <div><div className="condensed text-[26px]">{t}</div><div className="text-base text-text-3">{x}</div></div>
            </li>
          ))}
        </ol>
      </section>

      <section id="team" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-28">
          <div className="a-reveal mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">Das Team</h2>
            <p className="m-0 max-w-[420px] text-text-3">{team.length} Augenoptikerinnen und Augenoptiker, die Sie kennen – und sich Zeit für Sie nehmen.</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[22px] p-0">
            {team.map((m) => (
              <li key={m.name} className="group a-reveal">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[160px_160px_22px_22px] bg-blau-zart">
                  {m.foto ? (
                    <Bild src={m.foto} alt={m.name} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: m.bildausschnitt }} />
                  ) : (
                    <div role="img" aria-label={`Foto von ${m.name} folgt`} className="flex h-full w-full items-center justify-center text-[64px] text-blau display">{initialen(m.name)}</div>
                  )}
                  <div className="absolute inset-x-3 bottom-3 translate-y-2 rounded-[14px] bg-ink/80 px-3 py-2.5 text-sm text-white opacity-0 backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">{m.schwerpunkt}</div>
                </div>
                <div className="condensed mt-3.5 text-[26px] leading-[1.05]">{m.name}</div>
                <div className="text-[15px] text-text-3">{m.rolle}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-20 pt-28">
        <div className="a-reveal mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-x-10 gap-y-4 px-6">
          <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">Unser Laden</h2>
          <p className="m-0 max-w-[420px] text-text-3">Hell, ruhig, mit eigenem Messraum für das Augenscreening. Zum Durchwischen.</p>
        </div>
        <div className="scrollbar-schmal mt-9 flex gap-[18px] overflow-x-auto px-6 pb-4">
          {GALERIE.map(([src, alt, unter, art]) => (
            <figure key={src} className={`m-0 shrink-0 ${art === 'breit' ? 'w-[min(560px,82vw)]' : 'w-[min(320px,70vw)]'}`}>
              <div className="relative h-[420px] overflow-hidden rounded-3xl"><Bild src={src} alt={alt} sizes="560px" /></div>
              <figcaption className="mt-2.5 text-[15px] text-text-3">{unter}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-[1320px] px-6 py-24">
          <div className="a-reveal mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">{marken.length} Marken</h2>
            <p className="m-0 max-w-[420px] text-auf-dunkel">Von preiswerten Aktionsmodellen bis zu namhaften Designermarken.</p>
          </div>
          <ul className="a-reveal m-0 flex list-none flex-wrap gap-2.5 p-0">
            {marken.map((m, i) => (
              <li key={m} className={`rounded-full px-[22px] py-3 text-xl font-bold uppercase [font-stretch:75%] ${i % 5 === 0 ? 'bg-blau' : 'border border-ink-line bg-ink-2 text-[#DCE4EC]'}`}>{m}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand titel="Lernen Sie uns persönlich kennen." dunkel={false} />
    </>
  )
}
