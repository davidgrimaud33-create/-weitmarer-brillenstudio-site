import type { Metadata } from 'next'
import Link from 'next/link'
import { garantien } from '@/lib/content'
import { Bild, Brotkruemel, CtaBand, HeroGrund } from '@/components/Gestaltung'
import { AktionenListe } from '@/components/Aktionen'
import { RatenRechner } from '@/components/RatenRechner'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Service & Preise: Garantien, Ratenkauf, Aktionen',
  description: '6 Wochen Geld-zurück-Garantie, 6 Monate Verträglichkeitsgarantie für Gleitsicht, 3 Jahre Garantie, Ratenkauf RELAX24 und Brillenservice im Weitmarer Brillenstudio.',
  alternates: { canonical: '/service-preise' },
}

const KARTEN_STIL = [
  'bg-ink text-white', 'bg-white', 'bg-blau text-white', 'bg-white', 'bg-blau-zart',
]
const AKZENT = ['text-blau-hell', 'text-blau', 'text-[#BFDDF5]', 'text-blau', 'text-blau']
const TEXT = ['text-auf-dunkel', 'text-text-3', 'text-[#DCEBF8]', 'text-text-3', 'text-[#33465A]']

export default function ServicePreise() {
  const r = garantien.relax24
  return (
    <>
      <HeroGrund ringe>
        <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-8">
          <Brotkruemel seite="Service & Preise" />
          <h1 className="display a-rise mt-9 max-w-[1000px] text-[clamp(56px,9vw,136px)] !leading-[0.86] [font-stretch:65%]">Faire Preise.<br /><span className="verlauf-text">Klare Garantien.</span></h1>
          <p className="a-rise a-d1 mt-6 max-w-[620px] text-[21px] text-text-2">Bei uns gibt es hochwertige Produkte zum günstigen Preis – und Leistungen, die im Kleingedruckten nicht verschwinden.</p>
          <div className="a-rise a-d2 mt-8 flex flex-wrap gap-2">
            {[['#garantien', 'Garantien'], ['#relax24', 'Ratenkauf RELAX24'], ['#aktionen', 'Aktionen'], ['#reparatur', 'Reparatur & Service']].map(([h, t]) => (
              <a key={h} href={h} className="glas rounded-full px-[18px] py-[11px] font-semibold text-ink no-underline hover:text-blau">{t}</a>
            ))}
          </div>
        </section>
      </HeroGrund>

      <section id="garantien" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 py-24">
        <h2 className="display a-reveal mb-10 text-[clamp(40px,4.6vw,68px)]">Darauf können Sie sich verlassen</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
          {garantien.garantien.map((g, i) => (
            <div key={g.titel} className={`hebt a-reveal flex min-h-[280px] flex-col justify-between rounded-[28px] p-8 ${KARTEN_STIL[i]}`}>
              <div className="text-[96px] font-[790] leading-[0.85] [font-stretch:62%]">{g.zahl} <span className={`text-[40px] ${AKZENT[i]}`}>{g.einheit}</span></div>
              <div><div className="condensed text-[26px]">{g.titel}</div><div className={`mt-1 text-[15px] ${TEXT[i]}`}>{g.text}</div></div>
            </div>
          ))}
          <div className="hebt a-reveal flex min-h-[280px] flex-col justify-between rounded-[28px] bg-white p-8">
            <Icon name="schild" size={72} strokeWidth={1.4} className="text-blau" />
            <div><div className="condensed text-[26px]">Meister-Qualität</div><div className="mt-1 text-[15px] text-text-3">Kompetente Fachberatung eines inhabergeführten Meisterbetriebs und hochwertige Produkte zum günstigen Preis.</div></div>
          </div>
        </div>
      </section>

      <section id="relax24" className="relative scroll-mt-24 overflow-hidden bg-ink text-white">
        <div aria-hidden className="absolute -right-52 -top-52 h-[700px] w-[700px] rounded-full blur-[20px]" style={{ background: 'radial-gradient(circle, rgba(10,98,168,0.55) 0%, rgba(10,98,168,0) 65%)' }} />
        <div className="relative mx-auto flex max-w-[1320px] flex-wrap items-center gap-14 px-6 py-28">
          <div className="a-reveal min-w-0 flex-[1_1_520px]">
            <div className="kicker !text-blau-hell">RELAX24 · Entspannt sehen, entspannt bezahlen</div>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,80px)]">Ihre Brille in 24 Monatsbeträgen</h2>
            <p className="mt-5 text-[#C9D4DE]">Ohne Zusatzkosten – und mit Vorteilen, die über die Bezahlung hinausgehen:</p>
            <ul className="mt-5 flex list-none flex-col gap-3 p-0">
              {r.vorteile.map((v) => <li key={v} className="flex items-start gap-3"><Icon name="haken" size={22} strokeWidth={2.4} className="mt-0.5 shrink-0 text-blau-hell" />{v}</li>)}
            </ul>
            <p className="mt-6 text-[13px] text-[#8FA0B2]">Finanzpartner: {r.finanzpartner}</p>
          </div>
          <div className="a-reveal min-w-0 flex-[1_1_440px] rounded-[32px] border border-white/15 bg-white/[0.06] p-8 backdrop-blur-md">
            {r.rechnerAktiv ? <RatenRechner /> : (
              <div>
                <div className="condensed text-[30px]">Ihre Monatsrate</div>
                <p className="mt-2 text-[#C9D4DE]">Wir rechnen Ihnen die Rate für Ihre Wunschbrille gern im Laden aus.</p>
              </div>
            )}
            <Link href="/termin?anliegen=brille" className="mt-5 inline-flex rounded-full bg-white px-[22px] py-3 font-semibold text-ink no-underline hover:text-ink">Im Laden beraten lassen</Link>
          </div>
        </div>
      </section>

      <section id="aktionen" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 py-28">
        <div className="a-reveal mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">Aktuelle Aktionen</h2>
          <p className="m-0 max-w-[420px] text-text-3">Hier sehen Sie nur, was gerade gilt. Abgelaufene Angebote verschwinden automatisch.</p>
        </div>
        <AktionenListe />
      </section>

      <section id="reparatur" className="scroll-mt-24 bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-14 px-6 py-28">
          <div className="a-reveal relative h-[520px] min-w-0 flex-[1_1_480px] overflow-hidden rounded-[32px_280px_32px_32px] shadow-[0_60px_100px_-60px_rgba(10,98,168,0.55)]">
            <Bild src="/images/laden/laden-beratung.jpg" alt="Beratung im hellen Verkaufsraum" />
          </div>
          <div className="a-reveal min-w-0 flex-[1_1_480px]">
            <div className="kicker">Auch nach dem Kauf</div>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,80px)]">Reparatur &amp; Brillenservice</h2>
            <p className="mt-5 text-text-2">Für ungetrübten Sehkomfort sind wir jederzeit für Sie da.</p>
            <ul className="mt-6 grid list-none grid-cols-2 gap-2.5 p-0">
              {['Reinigung', 'Funktionskontrolle', 'Passform optimieren', 'Nasenpads tauschen', 'Ultraschallreinigung', 'Reparatur bei Defekt'].map((t) => <li key={t} className="rounded-2xl bg-grund px-[18px] py-4 font-semibold">{t}</li>)}
            </ul>
            <p className="mt-4 text-sm text-text-3">[Klären: Geht Service auch ohne Termin? Was kostet eine Reparatur bei Brillen, die nicht bei uns gekauft wurden?]</p>
            <Link href="/termin?anliegen=service" className="mt-5 inline-flex rounded-full bg-blau px-6 py-3.5 font-semibold text-white no-underline hover:text-white">Service-Termin anfragen</Link>
          </div>
        </div>
      </section>

      <CtaBand titel="Fragen zu Preis oder Garantie?" />
    </>
  )
}
