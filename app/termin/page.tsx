import type { Metadata } from 'next'
import { Suspense } from 'react'
import { stammdaten } from '@/lib/content'
import { Bild, Brotkruemel } from '@/components/Gestaltung'
import { TerminAssistent } from '@/components/TerminAssistent'
import { OeffnungszeitenKarte } from '@/components/Oeffnungszeiten'
import { Icon } from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Termin & Kontakt',
  description: 'Termin beim Weitmarer Brillenstudio in drei Schritten anfragen – oder direkt anrufen. Öffnungszeiten und Anfahrt zur Hattinger Straße 252 in Bochum.',
  alternates: { canonical: '/termin' },
}

export default function Termin() {
  return (
    <section className="mx-auto max-w-[1320px] px-6 pb-28 pt-8">
      <Brotkruemel seite="Termin & Kontakt" />
      <h1 className="display a-rise mt-7 text-[clamp(56px,8vw,120px)] !leading-[0.86] [font-stretch:65%]">Termin in<br /><span className="text-blau">drei Schritten.</span></h1>
      <p className="a-rise a-d1 mt-5 max-w-[620px] text-xl text-text-2">Sagen Sie uns, worum es geht und wann es Ihnen passt. Wir melden uns mit einem konkreten Terminvorschlag. [Rückmeldezeit mit Alexander klären]</p>

      <div className="mt-12 flex flex-wrap items-start gap-7">
        <Suspense fallback={<div className="min-h-[520px] flex-[999_1_620px] rounded-[32px] bg-white" />}>
          <TerminAssistent />
        </Suspense>

        <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-4">
          <a href={`tel:${stammdaten.telefonLink}`} className="a-rise a-d1 flex items-center gap-[18px] rounded-[26px] bg-ink p-6 text-white no-underline hover:text-white">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blau"><Icon name="telefon" size={24} /></span>
            <span><span className="block text-sm text-auf-dunkel">Lieber direkt sprechen?</span><span className="display block text-[28px] normal-case">{stammdaten.telefon}</span></span>
          </a>
          <OeffnungszeitenKarte className="a-rise a-d2 !rounded-[26px] !p-6" />
          <div id="anfahrt" className="a-rise a-d2 relative min-h-[300px] scroll-mt-24 overflow-hidden rounded-[26px] text-white">
            <Bild src="/images/laden/laden-aussen.jpg" alt="Ladenfront an der Hattinger Straße" sizes="400px" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/5 from-25% to-ink/90" />
            <div className="absolute inset-x-6 bottom-5">
              <div className="display text-[26px]">Anfahrt</div>
              <div>{stammdaten.strasse}, {stammdaten.plz} {stammdaten.ort}</div>
              <div className="text-sm text-[#C9D4DE]">{stammdaten.parkhinweis}</div>
              <a href={stammdaten.routeLink} target="_blank" rel="noopener" className="mt-3 inline-flex rounded-full bg-white px-4 py-2.5 font-semibold text-ink no-underline hover:text-ink">Route planen</a>
            </div>
          </div>
          <p className="px-1.5 text-sm text-text-3">„Route planen“ öffnet Google Maps in einem neuen Fenster. E-Mail: <a href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a></p>
        </aside>
      </div>
    </section>
  )
}
