'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bild } from '@/components/Gestaltung'
import { angebotsStatus, datumLang, KATEGORIEN, type Angebot, type Angebote, type Kategorie } from '@/lib/angebote-status'

/** Gilt das Angebot heute? Erst im Browser bekannt – vorher (statisches HTML) wird alles gezeigt. */
function useStatus(a: Angebote) {
  const [s, setS] = useState<{ aktiv: boolean; restTage: number } | null>(null)
  useEffect(() => setS(angebotsStatus(a)), [a])
  return s
}

export function KategorieSymbol({ k, hell = false, gross = false }: { k: Kategorie; hell?: boolean; gross?: boolean }) {
  const f = hell ? '#fff' : '#0A62A8'
  const m = gross ? 1.8 : 1
  if (k === 'fassungen')
    return <svg aria-hidden width={20 * m} height={11 * m} viewBox="0 0 36 20"><circle cx="8" cy="10" r="7" fill="none" stroke={f} strokeWidth="3" /><circle cx="28" cy="10" r="7" fill="none" stroke={f} strokeWidth="3" /><path d="M15 9h6" stroke={f} strokeWidth="3" /></svg>
  if (k === 'glaeser')
    return <svg aria-hidden width={17 * m} height={17 * m} viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="8" ry="6" fill="#9CC7EC" stroke={f} strokeWidth="2" /></svg>
  return <svg aria-hidden width={20 * m} height={14 * m} viewBox="0 0 60 40"><path d="M6 30c8-22 40-22 48 0" fill="none" stroke={f} strokeWidth="6" strokeLinecap="round" /></svg>
}

/** Ziffern rollen nacheinander hoch; Leerzeichen und Zeichen bleiben stehen. */
function RollWert({ wert, start = 0 }: { wert: string; start?: number }) {
  let n = 0
  return (
    <span aria-label={wert}>
      {[...wert].map((z, i) =>
        /\d/.test(z) ? (
          <span key={i} aria-hidden className="ang-ziffer" style={{ animationDelay: `${start + 0.12 * n++}s` }}>{z}</span>
        ) : (
          <span key={i} aria-hidden>{z}</span>
        ),
      )}
    </span>
  )
}

function Wert({ a }: { a: Angebot }) {
  if (a.wertArt === 'rabatt')
    return (
      <div className="ang-stern absolute right-3 top-[118px] z-10 flex h-[92px] w-[92px] items-center justify-center bg-pupille text-center text-[24px] font-black leading-[.95] text-white">
        <RollWert wert={a.wert} start={1.6} />
      </div>
    )
  if (a.wertArt === 'preis')
    return (
      <div className="ang-schild absolute right-4 top-[124px] z-10 rounded-[14px] border-[3px] border-ink bg-white px-3 py-2 shadow-[0_10px_18px_rgba(0,0,0,.2)]">
        {a.wertVorsatz && <div className="text-[11px] font-semibold text-text-3">{a.wertVorsatz}</div>}
        <div className="text-[34px] font-black leading-[.9] tracking-[-0.03em]"><RollWert wert={a.wert} start={1.6} /></div>
      </div>
    )
  return null
}

function FotoKarte({ a, nr }: { a: Angebot; nr: number }) {
  return (
    <article className="ang-karte ang-auf relative overflow-hidden rounded-[24px] bg-white" style={{ animationDelay: `${0.45 + 0.15 * nr}s` }}>
      <div className="ang-foto relative h-[170px] overflow-hidden">
        <Bild src={a.bild!} alt={a.bildAlt!} sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <Wert a={a} />
      <div className="p-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blau-zart"><KategorieSymbol k={a.kategorie} /></span>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-blau">{KATEGORIEN[a.kategorie]}</span>
        </div>
        <h3 className="mt-3 text-[22px] font-extrabold leading-tight">{a.titel}</h3>
        <p className="mt-1 text-text-3">{a.text}</p>
        {a.wertArt === 'aktion' && <div className="mt-3 text-[40px] font-black leading-none text-pupille"><RollWert wert={a.wert} start={1.6} /></div>}
      </div>
    </article>
  )
}

function BandKarte({ a, nr }: { a: Angebot; nr: number }) {
  return (
    <article className="ang-karte ang-auf relative col-span-full flex flex-wrap items-center gap-5 overflow-hidden rounded-[24px] bg-blau-zart p-6 pl-16" style={{ animationDelay: `${0.45 + 0.15 * nr}s` }}>
      <div className="ang-band absolute left-[-38px] top-[18px] -rotate-[35deg] overflow-hidden bg-pupille px-11 py-1 text-[11px] font-extrabold tracking-[0.14em] text-white">AKTION</div>
      <span className="flex h-16 w-16 flex-none items-center justify-center rounded-full border-2 border-blau bg-white"><KategorieSymbol k={a.kategorie} gross /></span>
      <div className="min-w-[200px] flex-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-blau">{KATEGORIEN[a.kategorie]}</span>
        <h3 className="text-[22px] font-extrabold leading-tight">{a.titel}</h3>
        <p className="text-text-3">{a.text}</p>
      </div>
      <div className={`text-[52px] font-black leading-none tracking-[-0.03em] ${a.wertArt === 'preis' ? 'text-ink' : 'text-pupille'}`}>
        {a.wertVorsatz && <span className="mr-1 text-[18px] font-semibold text-text-3">{a.wertVorsatz}</span>}
        <RollWert wert={a.wert} start={1.6} />
      </div>
    </article>
  )
}

export function AngeboteAnsicht({ daten }: { daten: Angebote }) {
  const status = useStatus(daten)

  if (status && !status.aktiv) {
    return (
      <section className="mx-auto max-w-[1100px] px-6 py-24 text-center">
        <div className="kicker">Monatsangebote</div>
        <h1 className="display mt-3 text-[clamp(40px,6vw,72px)]">Neue Angebote folgen in Kürze.</h1>
        <p className="mx-auto mt-4 max-w-[520px] text-[18px] text-text-2">Schauen Sie bald wieder vorbei – oder fragen Sie uns im Laden nach den aktuellen Preisen.</p>
        <Link href="/termin" className="mt-8 inline-block rounded-full bg-ink px-6 py-4 font-semibold text-white no-underline hover:text-white">Termin vereinbaren</Link>
      </section>
    )
  }

  const fotos = daten.angebote.filter((a) => a.bild).length
  const spalten = fotos >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : fotos === 2 ? 'md:grid-cols-2' : ''
  const zeit = status ? (status.restTage <= 1 ? 'Nur noch heute' : `Noch ${status.restTage} Tage`) : `Gültig bis ${datumLang(daten.gueltigBis)}`

  return (
    <>
      <header className="ang-kopf relative overflow-hidden text-white">
        <div aria-hidden className="ang-ring ang-ring-dreht absolute -right-24 -top-36 h-[520px] w-[520px] rounded-full border-2 border-dashed border-white/15" />
        <div aria-hidden className="absolute -right-6 -top-16 h-[340px] w-[340px] rounded-full border-2 border-white/15" />
        <div aria-hidden className="ang-puls absolute right-16 top-6 h-[180px] w-[180px] rounded-full border-2 border-pupille/80" />
        <div aria-hidden className="ang-puls ang-puls-2 absolute right-16 top-6 h-[180px] w-[180px] rounded-full border-2 border-pupille/80" />
        <div className="relative mx-auto max-w-[1100px] px-6 pb-16 pt-14">
          {daten.entwurf && (
            <div className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-[13px] font-semibold">Entwurf · Beispiel-Angebote, noch nicht echt</div>
          )}
          <div className="ang-auf">
            <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-blau-blass">Monatsangebote · {daten.monat}</div>
            <h1 className="display mt-2 text-[clamp(48px,8vw,104px)] !leading-[0.9]">{daten.ueberschrift}</h1>
          </div>
          <div className="ang-auf mt-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[15px] font-semibold" style={{ animationDelay: '.25s' }}>
            <span aria-hidden className="ang-uhr inline-block">⏱</span> {zeit} · bis {datumLang(daten.gueltigBis)}
          </div>
        </div>
      </header>

      <section className="bg-grund">
        <div className={`mx-auto -mt-8 grid max-w-[1100px] grid-cols-1 gap-5 px-6 pb-10 ${spalten}`}>
          {daten.angebote.map((a, i) => (a.bild ? <FotoKarte key={i} a={a} nr={i} /> : <BandKarte key={i} a={a} nr={i} />))}
        </div>

        <div className="mx-auto flex max-w-[1100px] flex-wrap items-stretch gap-5 px-6 pb-24">
          {daten.pdf && (
            <a href={daten.pdf} target="_blank" rel="noopener" className="ang-karte flex min-w-[280px] flex-1 items-center gap-4 rounded-[24px] bg-ink p-6 text-white no-underline hover:text-white">
              <span className="flex h-[64px] w-[50px] flex-none items-center justify-center rounded-md bg-white text-[12px] font-black text-pupille">PDF</span>
              <span><b className="text-[18px]">Kompletter Monatsprospekt</b><br /><span className="text-auf-dunkel">ansehen oder herunterladen</span></span>
            </a>
          )}
          <Link href="/termin" className="ang-karte flex min-w-[280px] flex-1 items-center justify-between gap-4 rounded-[24px] bg-white p-6 text-ink no-underline hover:text-ink">
            <span><b className="text-[18px]">Im Laden ausprobieren</b><br /><span className="text-text-3">Termin vereinbaren – wir beraten Sie gern.</span></span>
            <span aria-hidden className="text-[28px]">→</span>
          </Link>
        </div>
        {daten.hinweis && <p className="mx-auto max-w-[1100px] px-6 pb-16 text-[14px] text-text-3">{daten.hinweis}</p>}
      </section>
    </>
  )
}

/** Band auf der Startseite – verschwindet, wenn keine Angebote gelten. */
export function AngeboteHinweis({ daten }: { daten: Angebote }) {
  const status = useStatus(daten)
  if (status && !status.aktiv) return null
  const anzahl = daten.angebote.length
  return (
    <section className="mx-auto max-w-[1320px] px-6 pt-5">
      <Link href="/angebote" className="ang-kopf ang-karte group relative flex flex-wrap items-center gap-4 overflow-hidden rounded-[20px] px-5 py-3.5 text-white no-underline hover:text-white">
        <div aria-hidden className="ang-puls absolute -right-6 -top-10 h-[140px] w-[140px] rounded-full border-2 border-pupille/80" />
        <span className="ang-stern-klein bg-pupille px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em]">Neu im {daten.monat.split(' ')[0]}</span>
        <span className="min-w-[200px] flex-1 text-[17px] font-bold">
          {anzahl} {anzahl === 1 ? 'Monatsangebot' : 'Monatsangebote'} für {[...new Set(daten.angebote.map((a) => KATEGORIEN[a.kategorie]))].join(', ').replace(/, (?=[^,]*$)/, ' und ')}
        </span>
        <span className="relative rounded-full bg-white px-5 py-2.5 text-[15px] font-bold text-ink transition-transform group-hover:translate-x-1">Angebote ansehen →</span>
      </Link>
    </section>
  )
}
