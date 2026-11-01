import type { Metadata } from 'next'
import { Brotkruemel } from '@/components/Gestaltung'

export const metadata: Metadata = { title: 'Datenschutz', alternates: { canonical: '/datenschutz' }, robots: { index: false } }

export default function Datenschutz() {
  return (
    <section className="mx-auto max-w-[820px] px-6 pb-28 pt-8">
      <Brotkruemel seite="Datenschutz" />
      <h1 className="display mt-8 text-[clamp(48px,7vw,96px)]">Datenschutz&shy;erklärung</h1>
      <div className="mt-10 rounded-[22px] bg-[#FFF1EF] p-6 text-[#7A1E18]">
        <p className="font-bold">[Platzhalter – vor dem Livegang ersetzen]</p>
        <p className="mt-2">Die bisherige Datenschutzerklärung nennt Alfahosting als Hoster. Mit dem Umzug ändern sich die Dienste. Die neue Erklärung muss mindestens abdecken:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>Hosting und Auslieferung: Netlify (USA, mit EU-Standardvertragsklauseln)</li>
          <li>Bilder-CDN: Bunny.net (EU), falls aktiviert</li>
          <li>Terminanfrage-Formular und Mailversand: Resend</li>
          <li>Statistik: Umami auf eigenem Hetzner-Server (ohne Cookies, IP nicht gespeichert)</li>
          <li>Schriftart: Archivo wird beim Build eingebunden und vom eigenen Server ausgeliefert (keine Verbindung zu Google beim Seitenaufruf)</li>
          <li>Verlinkung zu Google Maps („Route planen“, öffnet erst nach Klick)</li>
        </ul>
        <p className="mt-2">Empfehlung: mit einem Generator (z. B. e-recht24) oder anwaltlich erstellen lassen.</p>
      </div>
    </section>
  )
}
