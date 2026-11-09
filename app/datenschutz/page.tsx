import type { Metadata } from 'next'
import { Brotkruemel } from '@/components/Gestaltung'
import { stammdaten } from '@/lib/content'

export const metadata: Metadata = { title: 'Datenschutz', alternates: { canonical: '/datenschutz' }, robots: { index: false } }

// ENTWURF (Task 10) – beschreibt nur, was der Code tatsächlich tut. Alle Angaben in eckigen Klammern
// muss David vor dem Livegang klären. Keine Rechtsberatung – Freigabe durch David, ggf. anwaltliche Prüfung.
// Nicht erwähnt: Cloudflare Access – schützt nur die nicht öffentliche Testversion, betrifft keine Besucher.
export default function Datenschutz() {
  return (
    <section className="mx-auto max-w-[820px] px-6 pb-28 pt-8">
      <Brotkruemel seite="Datenschutz" />
      <h1 className="display mt-8 text-[clamp(48px,7vw,96px)]">Datenschutz&shy;erklärung</h1>
      <div className="mt-10 rounded-[22px] bg-[#FFF1EF] p-6 text-[#7A1E18]">
        <p className="font-bold">Entwurf – nicht freigegeben</p>
        <p className="mt-2">Dieser Text ist ein Entwurf und noch nicht rechtlich geprüft. Angaben in eckigen Klammern sind vor dem Livegang zu klären. Diese Box nach der Freigabe entfernen.</p>
      </div>
      <div className="mt-10 space-y-8 text-[17px] leading-relaxed [&_h2]:condensed [&_h2]:mb-2 [&_h2]:text-2xl [&_h3]:mt-4 [&_h3]:font-bold [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
        <div>
          <h2>1. Verantwortlicher</h2>
          <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
          <p>{stammdaten.name} {stammdaten.inhaber}<br />{stammdaten.strasse}<br />{stammdaten.plz} {stammdaten.ort}<br />Telefon: {stammdaten.telefon}<br />E-Mail: <a href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a></p>
          <p>Einen Datenschutzbeauftragten haben wir nicht benannt. [PRÜFEN: Pflicht zur Benennung besteht in der Regel erst ab 20 Personen, die ständig mit der Verarbeitung personenbezogener Daten beschäftigt sind.]</p>
        </div>

        <div>
          <h2>2. Überblick</h2>
          <p>Sie können diese Website besuchen, ohne Angaben zu Ihrer Person zu machen. Wir setzen keine Cookies und keine Werbe- oder Tracking-Dienste ein. Personenbezogene Daten verarbeiten wir nur, soweit dies für die Auslieferung und Sicherheit der Website nötig ist und wenn Sie uns über das Terminformular, per E-Mail oder telefonisch kontaktieren.</p>
          <p>Die Übertragung der Seiten erfolgt verschlüsselt (HTTPS).</p>
        </div>

        <div>
          <h2>3. Hosting und Auslieferung über Cloudflare</h2>
          <p>Diese Website wird über die Plattform von Cloudflare betrieben und ausgeliefert (Cloudflare Workers, Content Delivery Network). Anbieter ist die Cloudflare, Inc., [PRÜFEN: Anschrift laut Vertrag, z. B. 101 Townsend St., San Francisco, CA 94107, USA].</p>
          <p>Beim Aufruf jeder Seite verarbeitet Cloudflare technisch notwendige Verbindungsdaten, insbesondere Ihre IP-Adresse, Datum und Uhrzeit, die aufgerufene Adresse, Browser- und Betriebssysteminformationen (User-Agent) und ggf. die zuvor besuchte Seite (Referrer). Diese Daten werden benötigt, um die Seiten auszuliefern, die Website vor Angriffen und Missbrauch zu schützen und Fehler zu erkennen (Server-Logs). Wir werten diese Daten nicht aus, um Sie als Person zu erkennen.</p>
          <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer sicheren, schnellen und zuverlässigen Bereitstellung der Website. Die Logdaten werden von Cloudflare nach [PRÜFEN: Speicherdauer der Cloudflare-Logs] gelöscht.</p>
          <p>Mit Cloudflare besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). [PRÜFEN: Auftragsverarbeitungsvertrag / Data Processing Addendum im Cloudflare-Konto abgeschlossen?]</p>
          <p>Cloudflare ist ein Unternehmen mit Sitz in den USA; eine Übermittlung von Daten in die USA ist daher nicht ausgeschlossen. Die Übermittlung stützt sich auf [PRÜFEN: DPF-Zertifizierung / SCC – Zertifizierung unter dem EU-US Data Privacy Framework (Angemessenheitsbeschluss, Art. 45 DSGVO) und/oder EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO)].</p>
        </div>

        <div>
          <h2>4. Besucherstatistik: Cloudflare Web Analytics</h2>
          <p>Um zu verstehen, welche Seiten wie oft aufgerufen werden, nutzen wir Cloudflare Web Analytics (Anbieter: Cloudflare, Inc., siehe Abschnitt 3). Dafür lädt Ihr Browser ein kleines Skript von static.cloudflareinsights.com, das anonyme Messwerte zum Seitenaufruf (z. B. aufgerufene Seite, Ladezeit, Browsertyp, Herkunftsseite) an Cloudflare übermittelt. Dabei wird Ihre IP-Adresse technisch übertragen.</p>
          <p>Cloudflare Web Analytics setzt keine Cookies und legt nach Angaben des Anbieters keine Kennungen auf Ihrem Endgerät ab; ein Profil über einzelne Besucher wird nicht erstellt. Wir sehen nur zusammengefasste Zahlen. [PRÜFEN: Aussage „keine Speicherung auf dem Endgerät“ mit aktueller Cloudflare-Dokumentation abgleichen (§ 25 TDDDG).]</p>
          <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt darin, unser Angebot zu verbessern. Zur Drittlandübermittlung siehe Abschnitt 3.</p>
        </div>

        <div>
          <h2>5. Terminanfrage über das Formular</h2>
          <p>Über unser Terminformular können Sie eine unverbindliche Terminanfrage senden. Dabei verarbeiten wir:</p>
          <ul>
            <li>Ihr Anliegen (z. B. „Neue Brille“, „Augenscreening“, „Trockene Augen“) und Ihren Wunschtermin (Tag und Tageszeit),</li>
            <li>Ihren Namen,</li>
            <li>Ihre Telefonnummer und/oder Ihre E-Mail-Adresse (mindestens eines davon ist erforderlich),</li>
            <li>eine freiwillige Nachricht an uns,</li>
            <li>Ihre Einwilligung (Häkchen im Formular).</li>
          </ul>
          <p><strong>Zweck:</strong> Wir nutzen diese Angaben ausschließlich, um Ihre Anfrage zu bearbeiten, Ihnen einen Termin vorzuschlagen und Sie dazu zu kontaktieren. Haben Sie eine E-Mail-Adresse angegeben, erhalten Sie eine automatische Eingangsbestätigung mit Ihren Angaben.</p>
          <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage) sowie Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, die Sie im Formular erteilen. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. per E-Mail an <a href={`mailto:${stammdaten.email}`}>{stammdaten.email}</a>. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.</p>
          <p>Ihr Anliegen oder Ihre Nachricht können Rückschlüsse auf Ihre Gesundheit zulassen (z. B. Augenbeschwerden). Solche Angaben verarbeiten wir nur auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO). [PRÜFEN: Reicht der Einwilligungstext im Formular dafür aus oder muss er Gesundheitsdaten ausdrücklich nennen?]</p>
          <p><strong>Ablauf und Speicherung:</strong> Das Formular wird an unseren Server bei Cloudflare (Abschnitt 3) übertragen. Von dort werden die Angaben als E-Mail über den Dienst Resend (Abschnitt 7) an unser Geschäftspostfach geschickt. In einer Datenbank auf der Website werden die Angaben nicht gespeichert. Die E-Mails liegen in unserem Postfach bei [PRÜFEN: E-Mail-Anbieter des Ladens] und werden nach [SPEICHERDAUER] gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Kommt es zu einem Auftrag, gelten die dafür üblichen Aufbewahrungsfristen.</p>
          <p><strong>Spam-Schutz:</strong> Das Formular enthält ein für Menschen unsichtbares Feld, das nur von automatisierten Programmen ausgefüllt wird, sowie Cloudflare Turnstile (Abschnitt 6).</p>
          {/*
            TODO n8n: Sobald N8N_WEBHOOK_URL gesetzt ist, leitet der Worker die Formulardaten
            (Name, Telefon, E-Mail, Nachricht, Anliegen, Wunschtermin) zusätzlich an einen n8n-Webhook weiter
            (siehe worker/termin.ts, worker/ereignis.ts). Dann hier einen Absatz bzw. eigenen Abschnitt ergänzen:
            Anbieter/Hosting der n8n-Instanz, Zweck, Rechtsgrundlage, Auftragsverarbeitung, ggf. Drittland, Speicherdauer.
            Aktuell ist die Weiterleitung NICHT aktiv und wird deshalb nicht beschrieben.
          */}
        </div>

        <div>
          <h2>6. Spam-Schutz: Cloudflare Turnstile</h2>
          <p>Zum Schutz des Terminformulars vor automatisierten Anfragen (Spam, Bots) nutzen wir Cloudflare Turnstile (Anbieter: Cloudflare, Inc., siehe Abschnitt 3). Turnstile wird erst geladen, wenn Sie im Formular den Schritt mit Ihren Kontaktdaten erreichen. Ihr Browser lädt dann ein Skript von challenges.cloudflare.com; dabei werden Ihre IP-Adresse sowie technische Merkmale Ihres Browsers und Geräts an Cloudflare übertragen, um zu prüfen, ob die Anfrage von einem Menschen stammt. Beim Absenden prüft unser Server das Ergebnis bei Cloudflare und übermittelt dazu auch Ihre IP-Adresse.</p>
          <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im Schutz unseres Formulars und Postfachs vor Missbrauch. [PRÜFEN: Ob Turnstile Informationen auf dem Endgerät speichert oder ausliest (§ 25 TDDDG) – laut Cloudflare ohne Tracking-Cookies, mit aktueller Dokumentation abgleichen.] Zur Drittlandübermittlung siehe Abschnitt 3.</p>
        </div>

        <div>
          <h2>7. E-Mail-Versand über Resend</h2>
          <p>Für den Versand der E-Mails aus dem Terminformular (Benachrichtigung an uns und Eingangsbestätigung an Sie) nutzen wir den Dienst Resend. Anbieter ist die Resend, Inc., [PRÜFEN: Anschrift laut Vertrag], USA. Resend verarbeitet dabei den Inhalt der E-Mails (Ihre Formularangaben) sowie Absender- und Empfängeradressen in unserem Auftrag.</p>
          <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bzw. Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), siehe Abschnitt 5. Mit Resend besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO). [PRÜFEN: Data Processing Agreement mit Resend abgeschlossen?] Resend speichert versendete E-Mails nach [PRÜFEN: Speicherdauer bei Resend].</p>
          <p>Die Übermittlung in die USA stützt sich auf [PRÜFEN: DPF-Zertifizierung / SCC – Zertifizierung unter dem EU-US Data Privacy Framework und/oder EU-Standardvertragsklauseln].</p>
        </div>

        <div>
          <h2>8. Kontakt per E-Mail oder Telefon</h2>
          <p>Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben (z. B. Name, Kontaktdaten, Inhalt Ihrer Anfrage), um Ihr Anliegen zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage mit einem Vertrag oder dessen Anbahnung zusammenhängt, ansonsten Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). E-Mails werden in unserem Postfach bei [PRÜFEN: E-Mail-Anbieter des Ladens] gespeichert und nach [SPEICHERDAUER] gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
        </div>

        <div>
          <h2>9. Schriftart</h2>
          <p>Die auf dieser Website verwendete Schriftart wird von unserem eigenen Server ausgeliefert. Beim Aufruf der Seiten wird keine Verbindung zu Google oder anderen Schriftanbietern hergestellt.</p>
        </div>

        <div>
          <h2>10. Links zu anderen Websites</h2>
          <p>Unsere Seiten enthalten Links zu externen Angeboten, z. B. zum Routenplaner von Google Maps („Route planen“), zur Irisfotografie unter eyemazy-herne.de oder zur Handwerkskammer Dortmund. Diese Angebote werden erst geöffnet, wenn Sie den Link anklicken; vorher werden keine Daten an die Anbieter übertragen. Für die Datenverarbeitung auf diesen Seiten ist der jeweilige Anbieter verantwortlich.</p>
        </div>

        <div>
          <h2>11. Ihre Rechte</h2>
          <p>Sie haben nach der DSGVO jederzeit das Recht auf:</p>
          <ul>
            <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO),</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
            <li>Löschung (Art. 17 DSGVO),</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
            <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
          </ul>
          <h3>Widerspruchsrecht (Art. 21 DSGVO)</h3>
          <p>Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einlegen.</p>
          <p>Für alle Anliegen genügt eine formlose Nachricht an die oben unter „Verantwortlicher“ genannten Kontaktdaten.</p>
        </div>

        <div>
          <h2>12. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Für uns zuständig ist:</p>
          <p>Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)<br />[PRÜFEN: Anschrift, z. B. Kavalleriestraße 2–4, 40213 Düsseldorf]<br />[PRÜFEN: Website, z. B. www.ldi.nrw.de]</p>
        </div>

        <div>
          <h2>13. Änderungen</h2>
          <p>Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die eingesetzten Dienste ändern. Es gilt die jeweils hier veröffentlichte Fassung.</p>
          <p>Stand: [DATUM DER FREIGABE]</p>
        </div>
      </div>
    </section>
  )
}
