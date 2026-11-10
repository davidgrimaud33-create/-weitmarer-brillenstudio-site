import Link from 'next/link'
import { startseite, garantien, marken, team, stammdaten } from '@/lib/content'
import { Bild, HeroGrund, LinsenBild, Laufband, CtaBand } from '@/components/Gestaltung'
import { AnliegenWaehler } from '@/components/AnliegenWaehler'
import { OeffnungszeitenKarte } from '@/components/Oeffnungszeiten'
import { AktionStartseite } from '@/components/Aktionen'
import { Icon, LogoAuge } from '@/components/Icon'
import { MehrAlsBrillen } from '@/components/MehrAlsBrillen'
import { AngeboteHinweis } from '@/components/angebote/Angebote'
import { monatsangebote } from '@/lib/angebote-daten'

const h = startseite.hero
const meister = team.filter((m) => /meister/i.test(m.rolle)).length

export default function Startseite() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroGrund>
        <section className="mx-auto flex max-w-[1320px] flex-wrap items-stretch gap-12 px-6 pb-20 pt-14">
          <div className="flex min-w-0 flex-[1_1_560px] flex-col justify-center">
            <div className="flex flex-wrap gap-2 self-start">
              <div className="glas a-rise inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold">
                <LogoAuge className="text-ink" />
                {h.eyebrow}
              </div>
              <AngeboteHinweis daten={monatsangebote} />
            </div>
            <h1 className="display a-rise a-d1 mt-6 text-[clamp(56px,8.2vw,124px)] !leading-[0.9]">
              {h.titelZeile1}<br />{h.titelZeile2} <span className="verlauf-text a-scharf">{h.titelAkzent}</span>
            </h1>
            <p className="a-rise a-d2 mt-6 max-w-[560px] text-[21px] text-text-2">{h.text}</p>
            <AnliegenWaehler anliegen={startseite.anliegen} />
          </div>

          <div className="relative min-h-[640px] min-w-0 flex-[1_1_460px]">
            <LinsenBild src={h.bild} alt={h.bildAlt} ausschnitt={h.bildAusschnitt} priority />
            <div className="glas a-float absolute -left-[18px] bottom-11 flex items-center gap-3.5 rounded-[20px] px-[18px] py-4 shadow-[0_30px_60px_-28px_rgba(14,27,43,0.45)]">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-blau-zart text-blau"><Icon name="stern" /></div>
              <div><div className="font-bold">Inhabergeführt</div><div className="text-sm text-text-3">{team.length} Augenoptiker, davon {meister} Meister</div></div>
            </div>
            <div className="a-float2 absolute right-[18px] top-[34px] rounded-full border border-white/20 bg-gradient-to-br from-ink-2 to-ink px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_36px_-16px_rgba(14,27,43,0.6)]">
              3 Jahre Garantie
            </div>
          </div>
        </section>
      </HeroGrund>

      {/* ── Garantien-Laufband ───────────────────────────────── */}
      <Laufband label="Unsere Garantien" className="bg-blau py-[18px] text-white">
        {garantien.garantien.map((g) => (
          <span key={g.titel} className="flex items-center whitespace-nowrap text-[22px] font-semibold uppercase [font-stretch:80%]">
            <span className="px-7">{g.titel} {g.zahl !== '0' && `${g.zahl} ${g.einheit}`}</span>
            <span aria-hidden className="text-blau-blass">●</span>
          </span>
        ))}
      </Laufband>

      {/* ── Bereiche als Kachelraster ───────────────────────── */}
      <section className="mx-auto max-w-[1320px] px-6 pb-24 pt-28">
        <div className="a-reveal mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="display m-0 max-w-[760px] text-[clamp(44px,5.4vw,80px)] !leading-[0.92]">
            Ein Sehzentrum.<br /><span className="text-blau">Alles unter einem Dach.</span>
          </h2>
          <p className="m-0 max-w-[400px] text-text-2">Von der Fassung bis zur Netzhautaufnahme: Wir beraten, messen und fertigen im eigenen Meisterbetrieb.</p>
        </div>
        <div className="bento">
          <Link href="/augengesundheit#screening" className="kachel a-reveal relative col-span-2 row-span-2 overflow-hidden rounded-[28px] bg-ink text-white no-underline hover:text-white">
            <Bild src="/images/leistungen/screening-beratung.jpg" alt="Alexander Jäh beim Augenscreening" className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-30% to-ink/90" />
            <div className="absolute inset-x-8 bottom-8">
              <span className="inline-block rounded-full bg-pupille px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em]">Exklusiv bei uns</span>
              <div className="display mt-3.5 text-[52px]">Augenscreening</div>
              <div className="mt-2.5 max-w-[460px] text-lg text-[#D5DEE7]">Augeninnendruck, Netzhaut per Laser-Scan und eine schriftliche Auswertung mit Bildern.</div>
              <div className="pfeil mt-4 font-semibold">Mehr erfahren →</div>
            </div>
          </Link>
          <Link href="/sehhilfen#brillen" className="kachel a-reveal relative col-span-2 overflow-hidden rounded-[28px] text-white no-underline hover:text-white">
            <Bild src="/images/laden/fassungswand.jpg" alt="Fassungswand" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-ink/0 to-70%" />
            <div className="absolute bottom-7 left-8 max-w-[320px]">
              <div className="display text-[38px]">Brillen &amp; Gleitsicht</div>
              <div className="mt-2 text-[#E3E9EF]">Designermarken und Präzisionsgläser von GALAXA</div>
            </div>
          </Link>
          <Link href="/sehhilfen#linsen" className="kachel a-reveal flex flex-col justify-between rounded-[28px] bg-blau-zart p-6 text-ink no-underline hover:text-ink">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#0A62A8" strokeWidth="2.4" aria-hidden><path d="M6 30c4-14 32-14 36 0" /><path d="M10 30c3-8 25-8 28 0" /><circle cx="24" cy="36" r="3" fill="#0A62A8" stroke="none" /></svg>
            <div>
              <div className="display text-[32px]">Kontakt&shy;linsen</div>
              <div className="mt-2 text-[15px] text-[#33465A]">Auch für empfindliche und trockene Augen</div>
              <div className="pfeil mt-2.5 font-semibold text-blau">→</div>
            </div>
          </Link>
          <Link href="/augengesundheit#trocken" className="kachel a-reveal relative overflow-hidden rounded-[28px] text-white no-underline hover:text-white">
            <Bild src="/images/leistungen/tearstim.jpg" alt="TearStim-Anwendung" sizes="25vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-35% to-ink/85" />
            <div className="absolute inset-x-5 bottom-5">
              <div className="display text-[28px]">Trockene Augen</div>
              <div className="mt-1.5 text-sm text-[#E3E9EF]">TearStim-Lichtstimulation</div>
            </div>
          </Link>
          <Link href="/augengesundheit#visual" className="kachel a-reveal relative col-span-2 flex items-end justify-between gap-6 overflow-hidden rounded-[28px] bg-blau p-8 text-white no-underline hover:text-white">
            <svg aria-hidden width="260" height="260" viewBox="0 0 200 200" fill="none" className="absolute -right-10 -top-16 opacity-25"><circle cx="100" cy="100" r="96" stroke="#fff" strokeWidth="2" /><circle cx="100" cy="100" r="66" stroke="#fff" strokeWidth="2" /><circle cx="100" cy="100" r="36" stroke="#fff" strokeWidth="2" /><circle cx="100" cy="100" r="10" fill="#fff" /></svg>
            <div className="relative max-w-[440px]">
              <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#BFDDF5]">Neu auf der Seite</div>
              <div className="display mt-2 text-[38px]">Visualtraining &amp; Funktionaloptometrie</div>
            </div>
            <div className="pfeil relative text-[28px] font-semibold">→</div>
          </Link>
          <Link href="/service-preise#relax24" className="kachel a-reveal col-span-2 flex flex-col justify-between rounded-[28px] border border-ink/10 bg-white p-8 text-ink no-underline hover:text-ink">
            <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-blau">RELAX24</div>
            <div>
              <div className="display text-[38px]">Ihre Brille in 24 Raten</div>
              <div className="mt-2 text-text-2">Ohne Zusatzkosten – inklusive Brillenservice und 50 % Ersatz bei Bruch, Diebstahl, Verlust oder neuer Sehstärke.</div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Ablauf ───────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-24">
          <h2 className="display a-reveal mb-14 text-[clamp(40px,4.6vw,68px)]">So läuft Ihr Besuch ab</h2>
          <div className="relative">
            <div className="a-linie absolute inset-x-0 top-[30px] h-0.5 bg-blau" />
            <ol className="relative grid list-none grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-8 p-0">
              {[
                ['Termin wählen', 'Online mit Ihrem Anliegen oder telefonisch. Wir nehmen uns die Zeit, die Sie brauchen.'],
                ['Genau messen', 'Exakte Sehstärkenbestimmung – auf Wunsch mit Augenscreening und Netzhaut-Scan.'],
                ['In Ruhe auswählen', 'Fassung, Gläser oder Linsen – ehrlich beraten, von Aktionsmodell bis Designermarke.'],
                ['Perfekt angepasst', 'Wir passen Ihre Brille an – und bleiben danach für Reinigung und Passform für Sie da.'],
              ].map(([t, x], i) => (
                <li key={t} className="a-reveal">
                  <div className={`flex h-[62px] w-[62px] items-center justify-center rounded-full text-[26px] text-white condensed shadow-[0_0_0_8px_#fff] ${i === 3 ? 'bg-blau' : 'bg-ink'}`}>0{i + 1}</div>
                  <div className="condensed mt-5 text-[26px]">{t}</div>
                  <div className="mt-1.5 text-base text-text-3">{x}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Garantien mit Hinweislinien ─────────────────────── */}
      <section className="mx-auto max-w-[1320px] px-6 py-28">
        <div className="a-reveal mx-auto mb-12 max-w-[760px] text-center">
          <h2 className="display m-0 text-[clamp(40px,4.6vw,68px)]">Bei jeder Brille <span className="text-blau">mit drin</span></h2>
          <p className="mt-4 text-text-2">Keine Kleingedruckten-Überraschungen: Diese Leistungen gibt es bei uns immer.</p>
        </div>
        <div className="a-reveal grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-center gap-7">
          <div className="flex flex-col gap-11">
            {garantien.garantien.slice(0, 2).map((g) => (
              <div key={g.titel} className="flex items-start justify-end gap-3.5 text-right">
                <div><div className="condensed text-2xl">{g.kurz}</div><div className="text-[15px] text-text-3">{g.text}</div></div>
                <span className="relative mt-4 h-0.5 w-14 shrink-0 bg-blau"><span className="absolute -right-[5px] -top-1 h-2.5 w-2.5 rounded-full bg-blau" /></span>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <svg viewBox="0 0 420 180" fill="none" role="img" aria-label="Illustration einer Brille" className="w-full max-w-[440px]">
              <rect x="18" y="40" width="160" height="110" rx="46" stroke="#0E1B2B" strokeWidth="7" />
              <rect x="242" y="40" width="160" height="110" rx="46" stroke="#0E1B2B" strokeWidth="7" />
              <path d="M178 76c10-14 54-14 64 0" stroke="#0E1B2B" strokeWidth="7" strokeLinecap="round" />
              <path d="M18 66L2 58M402 66l16-8" stroke="#0E1B2B" strokeWidth="7" strokeLinecap="round" />
              <rect x="30" y="52" width="136" height="86" rx="38" fill="#0A62A8" opacity="0.12" />
              <rect x="254" y="52" width="136" height="86" rx="38" fill="#0A62A8" opacity="0.12" />
            </svg>
          </div>
          <div className="flex flex-col gap-11">
            {[garantien.garantien[2], { kurz: 'Service danach', text: garantien.serviceNachKauf, titel: 'service' }].map((g) => (
              <div key={g.titel} className="flex items-start gap-3.5">
                <span className="relative mt-4 h-0.5 w-14 shrink-0 bg-blau"><span className="absolute -left-[5px] -top-1 h-2.5 w-2.5 rounded-full bg-blau" /></span>
                <div><div className="condensed text-2xl">{g.kurz}</div><div className="text-[15px] text-text-3">{g.text}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zahlen ───────────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 px-6 py-20">
          {[
            [String(team.length), 'Augenoptikerinnen und Augenoptiker'],
            [String(meister), 'Meister im Team'],
            ['3', 'Jahre Garantie auf jede Brille'],
            [String(marken.length), 'Marken im Sortiment'],
          ].map(([z, t], i) => (
            <div key={t} className="a-reveal">
              <div className={`text-[104px] font-[780] leading-[0.85] [font-stretch:65%] ${i === 2 ? 'text-blau-hell' : ''}`}>{z}</div>
              <div className="mt-2.5 text-auf-dunkel">{t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Persönlich ───────────────────────────────────────── */}
      <section className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-14 px-6 py-28">
        <div className="a-reveal mx-auto min-w-0 flex-[0_1_440px]">
          <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-white shadow-[0_30px_60px_-30px_rgba(14,27,43,0.4)]">
            <Bild src="/images/team/alexander-jaeh.jpg" alt="Alexander Jäh" style={{ objectPosition: '45% 30%' }} />
          </div>
        </div>
        <div className="a-reveal min-w-0 flex-[1_1_520px]">
          <svg width="54" height="40" viewBox="0 0 54 40" fill="#0A62A8" aria-hidden><path d="M0 40V22C0 9 7 2 20 0l2 6c-7 2-10 6-10 12h10v22zM32 40V22C32 9 39 2 52 0l2 6c-7 2-10 6-10 12h10v22z" /></svg>
          <p className="mt-5 text-[clamp(28px,2.8vw,40px)] font-semibold leading-[1.15] [font-stretch:85%]">{startseite.zitat.text}</p>
          <div className="mt-6"><div className="font-bold">{startseite.zitat.name}</div><div className="text-[15px] text-text-3">{startseite.zitat.rolle}</div></div>
          <Link href="/ueber-uns#team" className="mt-7 inline-block font-semibold no-underline">Das ganze Team kennenlernen →</Link>
        </div>
      </section>

      {/* ── Bewertungen ──────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-24">
          <h2 className="display a-reveal mb-8 text-[clamp(40px,4.6vw,64px)]">Das sagen unsere Kunden</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
            {startseite.bewertungen.map((b, i) => (
              <figure key={i} className="a-reveal m-0 flex min-h-[200px] flex-col justify-between rounded-[22px] bg-grund p-7">
                <blockquote className="m-0 text-lg text-text-2">{b.text}</blockquote>
                <figcaption className="text-[15px] font-semibold">{b.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marken ───────────────────────────────────────────── */}
      <Laufband langsam label="Unsere Marken" className="border-y border-ink/10 py-11">
        {marken.map((m, i) => (
          <span key={m} className={`whitespace-nowrap pr-14 text-[40px] font-bold uppercase [font-stretch:70%] ${i % 2 ? 'text-blau' : 'text-ink'}`}>{m}</span>
        ))}
      </Laufband>

      <MehrAlsBrillen />

      {/* ── Aktion, Öffnungszeiten, Anfahrt ─────────────────── */}
      <section className="mx-auto grid max-w-[1320px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5 px-6 py-28">
        <AktionStartseite />
        <OeffnungszeitenKarte />
        <div className="a-reveal relative min-h-[420px] overflow-hidden rounded-[28px] text-white">
          <Bild src="/images/laden/laden-aussen.jpg" alt="Ladenfront an der Hattinger Straße" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/5 from-30% to-ink/90" />
          <div className="absolute inset-x-7 bottom-7">
            <div className="display text-[34px]">So finden Sie uns</div>
            <div className="mt-2.5">{stammdaten.strasse}, {stammdaten.plz} {stammdaten.ort}</div>
            <div className="text-sm text-[#C9D4DE]">{stammdaten.parkhinweis}</div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a href={stammdaten.routeLink} target="_blank" rel="noopener" className="rounded-full bg-white px-[18px] py-3 font-semibold text-ink no-underline hover:text-ink">Route planen</a>
              <a href={`tel:${stammdaten.telefonLink}`} className="rounded-full border border-white/50 px-[18px] py-3 font-semibold text-white no-underline hover:text-white">Anrufen</a>
            </div>
          </div>
        </div>
      </section>

      <CtaBand titel="Zeit für einen klaren Blick?" text="Wählen Sie Ihr Anliegen – wir melden uns mit einem Terminvorschlag." dunkel={false} />
    </>
  )
}
