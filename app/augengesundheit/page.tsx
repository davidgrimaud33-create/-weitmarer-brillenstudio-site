import type { Metadata } from 'next'
import Link from 'next/link'
import { augengesundheit as ag } from '@/lib/content'
import { Bild, Brotkruemel, CtaBand } from '@/components/Gestaltung'
import { Faq } from '@/components/Faq'
import { Icon, type IconName } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Augengesundheit: Augenscreening, trockene Augen, Visualtraining',
  description: 'Augenscreening mit Netzhaut-Laser-Scan und Augeninnendruck ohne Tropfen, TearStim-Lichtstimulation bei trockenen Augen und Visualtraining – beim Funktionaloptometristen in Bochum-Weitmar.',
  alternates: { canonical: '/augengesundheit' },
}

const ICONS: Record<string, IconName> = { auge: 'auge', druck: 'druck', sonne: 'sonne', wuerfel: 'wuerfel', monitor: 'monitor', dokument: 'dokument' }

const ringe = (
  <svg aria-hidden viewBox="0 0 200 200" fill="none" className="a-spin pointer-events-none absolute -left-80 -top-64 h-[900px] w-[900px] opacity-[0.08]">
    <circle cx="100" cy="100" r="98" stroke="#fff" strokeWidth="0.6" strokeDasharray="2 3" /><circle cx="100" cy="100" r="76" stroke="#fff" strokeWidth="0.6" /><circle cx="100" cy="100" r="54" stroke="#fff" strokeWidth="0.6" strokeDasharray="1 2" /><circle cx="100" cy="100" r="30" stroke="#fff" strokeWidth="0.6" />
  </svg>
)

export default function Augengesundheit() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        {ringe}
        <div className="relative mx-auto max-w-[1320px] px-6 pb-24 pt-8">
          <nav aria-label="Brotkrümel" className="flex gap-2 text-sm text-[#8FA0B2]"><Link href="/" className="text-[#8FA0B2]">Start</Link><span aria-hidden>/</span><span className="text-white">Augengesundheit</span></nav>
          <div className="mt-10 flex flex-wrap items-center gap-14">
            <div className="min-w-0 flex-[1_1_560px]">
              <div className="kicker a-rise !text-blau-hell">Sehzentrum für Augenscreening</div>
              <h1 className="display a-rise a-d1 mt-4 text-[clamp(56px,8vw,120px)] !leading-[0.88]">Wir schauen<br /><span className="text-blau-hell">genauer hin.</span></h1>
              <p className="a-rise a-d2 mt-6 max-w-[560px] text-[21px] text-[#C9D4DE]">Gutes Sehen ist mehr als die richtige Brille. Als Funktionaloptometrist prüft Alexander Jäh auch, wie gesund und entspannt Ihre Augen arbeiten.</p>
              <div className="a-rise a-d3 mt-9 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5">
                {[['#screening', 'Augenscreening'], ['#trocken', 'Trockene Augen'], ['#visual', 'Visualtraining']].map(([h, t], i) => (
                  <a key={h} href={h} className="rounded-[18px] border border-ink-line bg-ink-2 p-[18px] text-white no-underline transition hover:-translate-y-1 hover:bg-[#1C2C40] hover:text-white">
                    <div className="text-[13px] font-bold text-blau-hell">0{i + 1}</div>
                    <div className="condensed mt-1.5 text-[22px]">{t}</div>
                  </a>
                ))}
              </div>
            </div>
            <div className="relative h-[580px] min-w-0 flex-[1_1_420px]">
              <div className="linsen-rahmen absolute inset-0 rounded-[300px_300px_32px_32px]">
                <div className="relative h-full w-full overflow-hidden rounded-[297px_297px_29px_29px]">
                  <Bild src="/images/leistungen/screening-beratung.jpg" alt="Alexander Jäh wertet eine Netzhautaufnahme aus" priority className="a-focus object-cover" style={{ objectPosition: '62% 50%' }} />
                </div>
              </div>
              <div className="a-float absolute -left-4 bottom-10 rounded-[18px] bg-white px-[18px] py-3.5 text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]">
                <div className="font-bold">Ohne Tropfen, berührungslos</div>
                <div className="text-sm text-text-3">Augeninnendruck und Hornhautdicke</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 01 Screening */}
      <section id="screening" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 pb-24 pt-28">
        <div className="a-reveal flex flex-wrap items-end justify-between gap-x-14 gap-y-6">
          <div className="max-w-[720px]">
            <div className="kicker">01 · Exklusiv im Weitmarer Brillenstudio</div>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,80px)]">Das Sehkomfort-Screening</h2>
          </div>
          <p className="m-0 max-w-[460px] text-text-2">Wichtige Prüfungen zur Früherkennung von Grauem Star und Makuladegeneration – zum Abschluss mit einer schriftlichen Auswertung mit Bildern, die bei Bedarf einen gezielten Verweis an den Facharzt erlaubt.</p>
        </div>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {ag.screening.messungen.map((m) => (
            <div key={m.titel} className="hebt a-reveal rounded-[22px] bg-white p-6">
              <Icon name={ICONS[m.icon] ?? 'auge'} size={34} strokeWidth={1.8} className="text-blau" />
              <div className="condensed mt-4 text-2xl">{m.titel}</div>
              <div className="mt-1 text-[15px] text-text-3">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="a-reveal mt-5 flex flex-wrap gap-4">
          <div className="flex-[1_1_520px] rounded-[22px] bg-blau-zart px-7 py-6 text-[15px] text-[#1E3550]"><strong>Wichtig zu wissen:</strong> {ag.screening.hinweis}</div>
          <div className="flex flex-[1_1_360px] flex-wrap items-center justify-between gap-x-8 gap-y-3.5 rounded-[22px] bg-ink px-7 py-6 text-white">
            <div><div className="text-[13px] text-[#8FA0B2]">Dauer</div><div className="font-bold">{ag.screening.dauer}</div></div>
            <div><div className="text-[13px] text-[#8FA0B2]">Preis</div><div className="font-bold">{ag.screening.preis}</div></div>
            <Link href="/termin?anliegen=screening" className="rounded-full bg-white px-5 py-3 font-semibold text-ink no-underline hover:text-ink">Screening anfragen</Link>
          </div>
        </div>
      </section>

      {/* 02 Trockene Augen */}
      <section id="trocken" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-28">
          <div className="flex flex-wrap items-center gap-14">
            <div className="a-reveal min-w-0 flex-[1_1_520px]">
              <div className="kicker">02 · Hilfe bei trockenen Augen</div>
              <h2 className="display mt-3 text-[clamp(44px,5.4vw,80px)]">Wenn das Auge brennt – oder tränt.</h2>
              <p className="mt-5 text-text-2">Beim trockenen Auge ist oft die oberste Schicht des Tränenfilms instabil, eine dünne Ölschicht. Häufig sind zusätzlich die Lidränder entzündet, an denen die Fette für den Tränenfilm gebildet werden. Auch ein herabhängendes Unterlid kann die Benetzung stören.</p>
              <div className="mt-7 rounded-[20px] bg-grund px-6 py-6">
                <div className="text-[30px] font-bold leading-[1.05] [font-stretch:80%]">„Das trockene Auge tränt – so widersprüchlich es klingt.“</div>
                <div className="mt-2 text-[15px] text-text-3">Ist das Auge sehr trocken, reagiert es mit vermehrter Tränenbildung.</div>
              </div>
            </div>
            <div className="a-reveal relative h-[520px] min-w-0 flex-[1_1_440px] overflow-hidden rounded-full border-[10px] border-blau-zart">
              <Bild src="/images/leistungen/tearstim.jpg" alt="TearStim-Lichtstimulation am unteren Augenlid" />
            </div>
          </div>

          <div className="a-reveal mt-24 flex flex-wrap gap-12 rounded-[32px] bg-ink p-[clamp(28px,5vw,56px)] text-white">
            <div className="min-w-0 flex-[1_1_420px]">
              <div className="kicker !text-blau-hell">Unsere Methode</div>
              <h3 className="display mt-3 text-[clamp(38px,4.4vw,64px)]">TearStim-Lichtstimulation</h3>
              <p className="mt-5 text-[#C9D4DE]">Die Lichtstimulation regt das parasympathische Nervensystem an und ermöglicht so eine Stabilisierung des Tränenfilms. Die Meibomschen Drüsen am Lidrand werden wieder angeregt zu arbeiten.</p>
              <p className="mt-3.5 text-[#C9D4DE]">Ob die Anwendung für Sie infrage kommt, besprechen wir nach einer exakten Tränenfilmanalyse und einem individuellen Check-up.</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {['10–15 Minuten pro Anwendung', 'In der Regel 3 Anwendungen'].map((t) => <span key={t} className="rounded-full border border-ink-line bg-ink-2 px-3.5 py-2 text-[15px]">{t}</span>)}
              </div>
            </div>
            <ol className="m-0 flex min-w-0 flex-[1_1_420px] list-none flex-col gap-[18px] p-0">
              {[
                ['Bequem zurücklehnen', 'Sie ruhen auf einem Stuhl, Ihre Augen werden mit lichtundurchlässigen Augenschalen abgedeckt.'],
                ['Gel auftragen', 'Unter dem Auge kommt ein spezielles Hydrogel auf die Haut – ähnlich wie beim Ultraschall.'],
                ['8 bis 10 Lichtpulse', 'Vom inneren zum äußeren Augenwinkel. Sie spüren kurz Wärme, die direkt danach verfliegt.'],
                ['Spürbar nach wenigen Stunden', 'Die Anwendung regt die normale Tätigkeit der Meibomschen Drüsen unmittelbar wieder an.'],
              ].map(([t, x], i) => (
                <li key={t} className="flex gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${i === 3 ? 'bg-blau-hell text-ink' : 'bg-blau'}`}>{i + 1}</span>
                  <div><div className="font-bold">{t}</div><div className="text-[15px] text-auf-dunkel">{x}</div></div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-24">
            <h3 className="display a-reveal text-[clamp(34px,3.8vw,54px)]">Die Wirkung wächst mit jeder Anwendung</h3>
            <div className="relative mt-10 pl-12">
              <div className="a-linie-y absolute bottom-2 left-[15px] top-2 w-[3px] rounded bg-gradient-to-b from-blau to-blau-hell" />
              <ol className="m-0 flex list-none flex-col gap-[22px] p-0">
                {[
                  ['Tag 1', 'Erste Anwendung.', 'Der Effekt hält etwa 5 bis 7 Tage an.', 'normal'],
                  ['Tag 15', 'Zweite Anwendung.', 'Der Effekt ist 2 bis 3 Wochen spürbar.', 'normal'],
                  ['um Tag 45', 'Dritte Anwendung.', 'Ihr Effekt kann bis zu 3 Jahre anhalten. In schweren Fällen sind 4 bis 5 Anwendungen nötig.', 'stark'],
                  ['Jährlich', 'Optionale Auffrischung', 'für nachhaltigen Komfort.', 'optional'],
                ].map(([tag, fett, rest, art]) => (
                  <li key={tag} className={`a-reveal relative flex flex-wrap items-baseline gap-x-8 gap-y-2 rounded-[20px] px-6 py-5 ${art === 'stark' ? 'bg-blau text-white' : art === 'optional' ? 'border border-dashed border-[#9DB3C9] bg-white' : 'bg-grund'}`}>
                    <span aria-hidden className={`absolute -left-[42px] top-6 h-[22px] w-[22px] rounded-full border-4 ${art === 'optional' ? 'border-dashed border-[#9DB3C9] bg-white' : art === 'stark' ? 'border-white bg-blau shadow-[0_0_0_2px_#0A62A8]' : 'border-blau bg-white'}`} />
                    <div className="condensed w-40 text-[26px]">{tag}</div>
                    <div className="flex-[1_1_260px]"><strong>{fett}</strong> {rest}</div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="a-reveal mt-7 flex flex-wrap gap-4 text-[15px] text-[#1E3550]">
              <div className="flex-[1_1_420px] rounded-[20px] bg-blau-zart px-6 py-5"><strong>Vor der Anwendung:</strong> Gesicht mit Wasser und Seife reinigen. Keine Reste von Make-up – auch Augen und Wimpern ungeschminkt.</div>
              <div className="flex-[1_1_420px] rounded-[20px] bg-blau-zart px-6 py-5"><strong>Langfristig:</strong> Bei erfolgreicher Anwendung kann die Lichtstimulation den Bedarf an Augentropfen und Salben reduzieren.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 Visualtraining */}
      <section id="visual" className="mx-auto max-w-[1320px] scroll-mt-24 px-6 py-28">
        <div className="a-reveal relative flex flex-wrap items-center gap-10 overflow-hidden rounded-[32px] bg-blau p-[clamp(28px,5vw,56px)] text-white">
          <svg aria-hidden viewBox="0 0 200 200" fill="none" className="a-spin absolute -right-28 -top-28 h-[460px] w-[460px] opacity-20"><circle cx="100" cy="100" r="96" stroke="#fff" strokeDasharray="3 4" /><circle cx="100" cy="100" r="66" stroke="#fff" /><circle cx="100" cy="100" r="36" stroke="#fff" strokeDasharray="2 3" /><circle cx="100" cy="100" r="10" fill="#fff" /></svg>
          <div className="relative min-w-0 flex-[1_1_520px]">
            <div className="kicker !text-[#BFDDF5]">03 · Praxis für visuelle Wahrnehmung</div>
            <h2 className="display mt-3 text-[clamp(44px,5.4vw,80px)]">Visualtraining &amp; Funktionaloptometrie</h2>
            <p className="mt-5 max-w-[620px] text-[#DCEBF8]">{ag.visualtraining.text}</p>
          </div>
          <ul className="relative m-0 flex flex-[0_1_360px] list-none flex-col gap-2.5 p-0">
            {ag.visualtraining.bereiche.map((b) => <li key={b} className="rounded-2xl bg-white/12 px-[18px] py-4">{b}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[980px] px-6 py-24">
          <h2 className="display a-reveal mb-8 text-[clamp(40px,4.6vw,64px)]">Häufige Fragen</h2>
          <Faq eintraege={ag.faq} />
        </div>
      </section>

      <CtaBand titel="Lassen Sie Ihre Augen checken." text="Alexander Jäh nimmt sich Zeit für Ihre Fragen." />
    </>
  )
}
