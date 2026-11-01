import Link from 'next/link'
import { besonderes } from '@/lib/content'
import { Bild } from './Gestaltung'

/** Startseiten-Block „Mehr als Brillen“: Holzkern-Uhren (eigene Seite) + Irisfotografie (externe Seite) */
export function MehrAlsBrillen() {
  const iris = besonderes.irisfotografie
  return (
    <section className="mx-auto max-w-[1320px] px-6 pt-28" aria-labelledby="mehr-als-brillen">
      <div className="a-reveal mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 id="mehr-als-brillen" className="display m-0 text-[clamp(40px,4.6vw,68px)]">Mehr als Brillen</h2>
        <p className="m-0 max-w-[420px] text-text-3">Zwei Besonderheiten, die es nicht bei jedem Optiker gibt.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-5">
        <Link href="/holzkern" className="kachel a-reveal relative min-h-[460px] overflow-hidden rounded-[28px] bg-ink text-white no-underline hover:text-white">
          <Bild src="/images/holzkern/holzkern-04.jpg" alt="Holzkern-Uhr mit Steinzifferblatt" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/0 from-35% to-ink/90" />
          <div className="absolute inset-x-8 bottom-8">
            <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-blau-blass">Im Laden entdecken</div>
            <div className="display mt-2 text-[48px]">Holzkern-Uhren</div>
            <div className="mt-2 max-w-[460px] text-[17px] text-[#D5DEE7]">{besonderes.holzkern.teaser}</div>
            <div className="pfeil mt-4 font-semibold">Zur Kollektion →</div>
          </div>
        </Link>
        <a href={iris.url} target="_blank" rel="noopener" className="kachel a-reveal group relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-[28px] border border-ink/10 bg-white p-8 text-ink no-underline hover:text-ink">
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-grund px-3 py-1.5 text-[13px] font-semibold text-text-3">Externe Seite · Herne</span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="pfeil text-blau"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </div>
          <div className="relative mx-auto my-2 h-[200px] w-[200px]">
            <Bild src={iris.bild} alt={iris.bildAlt} sizes="200px" className="object-contain" />
          </div>
          <div>
            <div className="display text-[48px]">{iris.titel}</div>
            <div className="mt-2 text-[17px] text-text-2">{iris.teaser}</div>
            <div className="mt-2 text-sm text-text-3">Angebot {iris.ort} · öffnet in neuem Fenster</div>
            <div className="mt-4 font-semibold text-blau">{iris.linkText} →</div>
          </div>
        </a>
      </div>
    </section>
  )
}
