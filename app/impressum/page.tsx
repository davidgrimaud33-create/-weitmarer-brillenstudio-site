import type { Metadata } from 'next'
import { Brotkruemel } from '@/components/Gestaltung'

export const metadata: Metadata = { title: 'Impressum', alternates: { canonical: '/impressum' } }

// Angaben aus dem bisherigen Impressum übernommen (Tippfehler korrigiert).
// Offene Punkte sind markiert – vor dem Livegang mit Alexander klären.
export default function Impressum() {
  return (
    <section className="mx-auto max-w-[820px] px-6 pb-28 pt-8">
      <Brotkruemel seite="Impressum" />
      <h1 className="display mt-8 text-[clamp(48px,7vw,96px)]">Impressum</h1>
      <div className="mt-10 space-y-8 text-[17px] leading-relaxed [&_h2]:condensed [&_h2]:mb-2 [&_h2]:text-2xl">
        <div>
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>Weitmarer Brillenstudio Alexander Jäh e.K.<br />Inhaber: Alexander Jäh<br />Hattinger Straße 252<br />44795 Bochum</p>
          <p>Handelsregister: HRA 5837<br />Registergericht: Amtsgericht Bochum</p>
        </div>
        <div>
          <h2>Kontakt</h2>
          <p>Telefon: 0234 43 21 41<br />Telefax: 0234 45 26 222<br />E-Mail: [klären: bisher stand hier optik-noethe@t-online.de, auf der Kontaktseite info@weitmarer-brillenstudio.de]</p>
        </div>
        <div>
          <h2>Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: DE 247249345</p>
        </div>
        <div>
          <h2>Berufsrechtliche Angaben</h2>
          <p>Zuständige Handwerkskammer: Handwerkskammer Dortmund, Reinoldistraße 7–9, 44135 Dortmund, <a href="https://www.hwk-do.de">www.hwk-do.de</a></p>
          <p>Berufsbezeichnung: Augenoptikermeister (verliehen in Deutschland) [prüfen]</p>
        </div>
        <div>
          <h2>Redaktionell verantwortlich</h2>
          <p>Alexander Jäh, Hattinger Straße 252, 44795 Bochum</p>
        </div>
        <div>
          <h2>Verbraucherstreitbeilegung</h2>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </div>
        <p className="rounded-2xl bg-[#FFF1EF] p-4 text-[15px] text-[#7A1E18]">[Hinweis für David/Alexander: Impressum vor dem Livegang rechtlich prüfen lassen. Diese Box danach entfernen.]</p>
      </div>
    </section>
  )
}
