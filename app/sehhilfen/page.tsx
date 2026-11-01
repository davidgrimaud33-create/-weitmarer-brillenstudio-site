import type { Metadata } from 'next'
import Link from 'next/link'
import { marken, garantien } from '@/lib/content'
import { Bild, Brotkruemel, CtaBand, Laufband } from '@/components/Gestaltung'
import { GlasFinder } from '@/components/GlasFinder'
import { Icon, type IconName } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Sehhilfen: Brillen, Gleitsicht, Kontaktlinsen',
  description: 'Große Fassungsauswahl mit 23 Marken, Präzisionsgläser von GALAXA, Gleitsicht mit Verträglichkeitsgarantie und Kontaktlinsen zum Testen – in Bochum-Weitmar.',
  alternates: { canonical: '/sehhilfen' },
}

const pill = 'rounded-full border border-ink/15 bg-white px-[18px] py-[11px] font-semibold text-ink no-underline hover:bg-ink hover:text-white transition-colors'

export default function Sehhilfen() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-6 pb-16 pt-8">
        <Brotkruemel seite="Sehhilfen" />
        <div className="mt-8 flex flex-wrap items-center gap-12">
          <div className="min-w-0 flex-[1_1_520px]">
            <h1 className="display a-rise m-0 text-[clamp(64px,10vw,156px)] !leading-[0.85] [font-stretch:65%]">Seh&shy;hilfen</h1>
            <p className="a-rise a-d1 mt-6 max-w-[540px] text-[22px] text-text-2">Brille, Gleitsicht, Sonnenbrille oder Kontaktlinse – wir finden, was zu Ihren Augen und Ihrem Alltag passt.</p>
            <div className="a-rise a-d2 mt-8 flex flex-wrap gap-2">
              <a href="#brillen" className={pill}>Brillen &amp; Fassungen</a>
              <a href="#glaeser" className={pill}>Gläser &amp; Gleitsicht</a>
              <a href="#sonne" className={pill}>Sonnenbrillen</a>
              <a href="#linsen" className={pill}>Kontaktlinsen</a>
            </div>
          </div>
          <div className="grid h-[560px] min-w-0 flex-[1_1_520px] grid-cols-3 gap-3.5">
            <div className="a-rise relative mt-[70px] overflow-hidden rounded-[200px_200px_24px_24px]"><Bild src="/images/laden/fassungen-hoch.jpg" alt="Brillenfassungen an der Wand" sizes="20vw" priority className="a-focus object-cover" /></div>
            <div className="a-rise a-d1 relative overflow-hidden rounded-3xl"><Bild src="/images/laden/laden-beratung.jpg" alt="Beratung im Verkaufsraum" sizes="20vw" priority className="a-focus object-cover" /></div>
            <div className="a-rise a-d2 relative mb-[70px] overflow-hidden rounded-[24px_24px_200px_200px]"><Bild src="/images/laden/fassungswand.jpg" alt="Bunte Fassungswand" sizes="20vw" priority className="a-focus object-cover" /></div>
          </div>
        </div>
      </section>

      {/* Brillen */}
      <section id="brillen" className="scroll-mt-24 bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-14 px-6 pb-16 pt-28">
          <div className="kachel a-reveal relative h-[520px] min-w-0 flex-[1_1_520px] overflow-hidden rounded-[32px]">
            <Bild src="/images/laden/laden-innen.jpg" alt="Verkaufsraum mit Brillenwänden und Aquarium" />
            <div className="a-float absolute bottom-6 right-6 rounded-[18px] bg-white px-5 py-4 shadow-[0_18px_40px_-18px_rgba(14,27,43,0.35)]">
              <div className="text-[40px] font-[790] leading-[0.9] [font-stretch:65%]">{marken.length}</div>
              <div className="text-sm text-text-3">Marken im Sortiment</div>
            </div>
          </div>
          <div className="a-reveal min-w-0 flex-[1_1_440px]">
            <div className="kicker">Brillen &amp; Fassungen</div>
            <h2 className="display mt-3 text-[clamp(44px,5.2vw,76px)]">Fantastisch große Auswahl</h2>
            <p className="mt-5 text-text-2">Bei uns finden Sie garantiert Ihre neue Wunschbrille: von besonders preiswerten Aktionsmodellen bis zu vielen namhaften Designermarken. Für alle Fassungen und Sonnenbrillen gilt unser Anspruch – top in Qualität und Preis.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {['Sehstärke beim Kauf kostenlos', '3 Jahre Garantie', '6 Wochen Geld zurück'].map((t) => (
                <span key={t} className="rounded-full bg-blau-zart px-3.5 py-2 text-[15px] font-semibold text-[#1E3550]">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <Laufband label="Unsere Marken" className="pb-24 pt-7">
          {marken.map((m) => (
            <span key={m} className={`mr-3 whitespace-nowrap rounded-full px-[26px] py-3.5 text-[22px] font-bold uppercase [font-stretch:75%] ${m === 'Holzkern' ? 'bg-blau text-white' : 'bg-grund'}`}>{m}</span>
          ))}
        </Laufband>
      </section>

      {/* Gläser */}
      <section id="glaeser" className="mx-auto flex max-w-[1320px] scroll-mt-24 flex-wrap items-start gap-14 px-6 py-28">
        <div className="a-reveal min-w-0 flex-[1_1_440px]">
          <div className="kicker">Gläser &amp; Gleitsicht</div>
          <h2 className="display mt-3 text-[clamp(44px,5.2vw,76px)]">Präzision bis zum Rand</h2>
          <p className="mt-5 text-text-2">Unsere Brillengläser kommen von GALAXA, einem unabhängigen deutschen Glaslieferanten. Die Linien QUANT und ASTRON werden in der Schweiz mit höchster Präzision gefertigt.</p>
          <p className="mt-3.5 text-text-2">Das Sortiment reicht vom einfachen Einstärkenglas bis zum hochgradig individualisierten Gleitsichtglas – Lösungen für nahezu jede Situation und jeden Anspruch.</p>
          <div className="mt-7 flex items-center gap-4 rounded-[22px] bg-ink p-6 text-white">
            <Icon name="schild" size={40} strokeWidth={1.8} className="shrink-0 text-blau-hell" />
            <div><div className="font-bold">Verträglichkeitsgarantie</div><div className="text-[15px] text-auf-dunkel">{garantien.garantien[1].text}</div></div>
          </div>
        </div>
        <GlasFinder />
      </section>

      {/* Sonnenbrillen + Kontaktlinsen */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-28">
          <div id="sonne" className="a-reveal relative flex scroll-mt-24 flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[32px] p-[clamp(28px,5vw,56px)] text-ink" style={{ background: 'linear-gradient(120deg, #F6C66B 0%, #EE8E4A 100%)' }}>
            <div className="relative max-w-[640px]">
              <div className="text-sm font-bold uppercase tracking-[0.1em]">Sonnenbrillen</div>
              <h2 className="display mt-3 text-[clamp(44px,5.2vw,76px)]">Gut aussehen. Gut geschützt.</h2>
              <p className="mt-4 text-lg">[Sonnenbrillen mit und ohne Sehstärke? Welche Marken? Mit Alexander klären.]</p>
            </div>
            <Link href="/termin?anliegen=brille" className="relative rounded-full bg-ink px-6 py-4 font-semibold text-white no-underline hover:text-white">Sonnenbrille aussuchen</Link>
          </div>

          <div id="linsen" className="mt-28 flex scroll-mt-24 flex-wrap items-start gap-14">
            <div className="a-reveal min-w-0 flex-[1_1_440px]">
              <div className="kicker">Kontaktlinsen</div>
              <h2 className="display mt-3 text-[clamp(44px,5.2vw,76px)]">Frei sehen – ohne Brille</h2>
              <p className="mt-5 text-text-2">Kontaktlinsen sind die dezente, einfache und bequeme Lösung – im täglichen Dauergebrauch oder ab und zu als Ersatz für die Brille. Dank moderner Materialien sind sie heute für fast jeden geeignet, selbst für empfindliche und trockene Augen.</p>
              <div className="mt-7 rounded-[22px] bg-grund p-6">
                <div className="condensed text-2xl">Unverbindlich testen</div>
                <div className="mt-1 text-base text-text-2">Wir beraten Sie und passen Ihnen Testlinsen an – völlig unverbindlich.</div>
                <Link href="/termin?anliegen=linsen" className="mt-3.5 inline-flex rounded-full bg-blau px-5 py-3 font-semibold text-white no-underline hover:text-white">Testlinsen anfragen</Link>
              </div>
              <Link href="/augengesundheit#trocken" className="mt-5 inline-block font-semibold no-underline">Trockene Augen? So helfen wir →</Link>
            </div>
            <div className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
              {([
                ['auge', 'Dezent, nahezu unsichtbar', false],
                ['kreuz', 'Optimale Sehschärfe in alle Blickrichtungen', true],
                ['puls', 'Freies Blickfeld, volle Bewegungsfreiheit', true],
                ['sonne', 'Kein Beschlagen bei Temperaturwechsel', false],
              ] as [IconName, string, boolean][]).map(([i, t, dunkel]) => (
                <div key={t} className={`a-reveal flex min-h-[170px] flex-col justify-between rounded-[22px] p-6 ${dunkel ? 'bg-ink text-white' : 'bg-blau-zart'}`}>
                  <Icon name={i} size={30} className={dunkel ? 'text-blau-hell' : 'text-blau'} />
                  <div className="text-[22px] font-bold leading-[1.1] [font-stretch:78%]">{t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand titel="Finden wir Ihre neue Sehhilfe." />
    </>
  )
}
