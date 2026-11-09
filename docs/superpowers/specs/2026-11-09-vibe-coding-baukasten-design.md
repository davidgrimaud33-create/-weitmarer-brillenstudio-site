# Design: Weitmarer Brillenstudio – Baukasten für Pflege und Ausbau per Vibe-Coding

> Stand: 9. November 2026 · Autor: David Grimaud (DeepMetis) mit Claude
> Kennzeichnung: **[entschieden]** = von David so festgelegt · **[Vorschlag]** = Entscheidung von Claude, von David nicht einzeln bestätigt · **[Builder]** = bewusst offen gelassen

## 1. Absicht und Warum

Alexander Jäh (Inhaber, Einzelunternehmer, keine technischen Vorkenntnisse) soll seine Website nach einer
Einführung durch David **selbst per Vibe-Coding (Claude Code)** pflegen und Schritt für Schritt ausbauen.
Absehbar will er nach einigen Monaten auch **Automationen mit n8n** selbst bauen.

Die Website ist heute ein fast fertiger Entwurf (Next.js 16 + Tailwind 4, Inhalte als JSON in `content/`,
Regelwerk in `CLAUDE.md`, Staging-Ablauf). Dieses Design legt fest, **welche Bausteine, Dienste und
Leitplanken** wir ihm übergeben, damit er sicher, günstig und ohne David im Alltag arbeiten kann –
während David überall Zugriff behält, um zu helfen.

Leitgedanke **[entschieden]**: Für einen Einzelunternehmer so **wenige Dienste wie möglich**.

## 2. Ziele

1. Alexander kann **Inhalte ändern** (Öffnungszeiten, Aktionen, Team, Texte, Fotos) – wie heute vorbereitet.
2. Alexander kann **neue Seiten und Abschnitte bauen** **[entschieden]**, ohne Design-Code zu schreiben.
3. Jede Änderung geht erst auf eine **Testversion**, live erst nach seinem ausdrücklichen „passt, live schalten“.
4. Er kann eine Änderung jederzeit **rückgängig machen** („Notfallknopf“).
5. Später: Alexander baut **n8n-Abläufe selbst per Claude Code** **[entschieden]**; die Website liefert dafür feste Anschlussstellen.
6. **Alle Konten laufen auf Alexander, David ist überall Admin** **[entschieden]**.
7. Laufende Kosten nahe null in Phase 1.

## 3. Nicht-Ziele

- Kein klassisches CMS mit Login (Decap o. ä.) – Pflege läuft ausschließlich über Claude Code.
- Keine Datenbank (Supabase o. ä.) **[entschieden]** – erst neu prüfen, wenn es Kundenkonten oder echte Buchungen gibt.
- Keine Online-Buchung mit echten Zeitslots (Cal.com entfällt).
- Keine Mehrsprachigkeit.
- n8n ist **nicht Teil von Phase 1**.

## 4. Anti-Ziele (Fehlschlag, auch wenn es technisch läuft)

- Alexander kann durch eine Änderung das **Design zerschießen** oder die Live-Seite unbemerkt kaputt machen.
- Die Seite wird **pausiert oder abgeschaltet**, weil ein Kontingent (Deploys, Credits) aufgebraucht ist.
- Alexander braucht für Routineaufgaben **ein Dashboard** (Cloudflare, GitHub) – er soll nur mit Claude sprechen.
- David verliert den Zugriff oder muss Alexander um Passwörter bitten.
- Terminanfragen gehen **verloren** (z. B. weil n8n ausfällt).
- Rechtlich relevante Inhalte (Impressum, Datenschutz, Heilmittelwerbung) werden ohne Prüfung verändert.

## 5. Rahmenbedingungen

- Bestehendes Repo `davidgrimaud33-create/-weitmarer-brillenstudio-site` (Branches `main`, `staging`, `david-entwicklung`).
- Bestehende Regeln in `CLAUDE.md`, Anleitung `docs/02-pflege-per-vibe-coding.md`, Dienste `docs/01-zugaenge.md`, Technik `docs/03-technik.md` – werden fortgeschrieben, nicht ersetzt.
- Sprache gegenüber Alexander: Deutsch, einfache ausformulierte Sätze, keine Fachkürzel.
- DSGVO: jeder zusätzliche Dienst = Eintrag in der Datenschutzerklärung → Grund mehr, Dienste zu sparen.
- Next.js 16.2.3 im Repo liegt im Bereich einer kritischen Sicherheitslücke (next/og, CVE-2026-94545). Die Seite nutzt next/og nicht, Next.js wird trotzdem auf die aktuelle gepatchte Version gehoben.
- Terminplan: **kein fester Termin** für Einführung oder Live-Gang.

## 6. Dienste-Landschaft (Zielbild)

### Phase 1 – drei Konten **[entschieden: Cloudflare + statischer Export]**

| Dienst | Wofür | Inhaber / Rolle |
|---|---|---|
| **GitHub** | Code, Inhalte, Versionsgeschichte, Rückgängig-Machen | Repo wird auf Alexanders Konto übertragen, David Admin |
| **Cloudflare** | Hosting (Workers Static Assets), Vorschau-Versionen pro Branch, DNS (Nameserver), Formular-Funktion, Spamschutz (Turnstile), Statistik ohne Cookies (Web Analytics), Schutz der Testversion (Access) | Alexander = Super Administrator, David = Administrator |
| **Resend** | Versand der zwei Termin-Mails (Laden + Bestätigung Kunde) | Konto auf Alexander, David Zugriff **[Vorschlag]** |

Begründung Cloudflare statt Netlify (Recherche 9.11.2026):
- Die Seite ist bis auf das Terminformular vollständig statisch (Live-Status, Aktionen, Terminvorschläge rechnet der Browser). Mit `output: 'export'` braucht sie **keinen Server und keinen Next.js-Adapter**.
- Netlify Free: 300 Credits/Monat, ein Live-Deploy = 15 Credits (~20 Live-Gänge), danach **pausiert die Seite**; Free/Personal faktisch nur ein Mitglied → für David als Admin wäre Pro (~20 $/Monat) nötig.
- Cloudflare: statische Anfragen kostenlos und unbegrenzt, Mitglieder im Free-Plan möglich, Domain/DNS/Statistik/Spamschutz/Testversion-Login an einem Ort.

Entfällt gegenüber bisheriger Planung: **Netlify (beide Sites), Bunny.net, Umami, Cal.com**.
**Alfahosting bleibt** als Registrar der `.de`-Domain und (vermutlich) Anbieter des Postfachs `info@weitmarer-brillenstudio.de`: Cloudflare Registrar unterstützt `.de` nicht. Es werden nur die **Nameserver** auf Cloudflare umgestellt **[Vorschlag]** – siehe 9.

Resend bleibt, bis Cloudflare Email Sending aus der Beta ist (Stand: Public Beta seit April 2026, erfordert Workers Paid 5 $/Monat). Wechsel später optional **[Builder: nicht in Phase 1]**.

### Phase 2 – n8n

- n8n als zusätzlicher Dienst. **Offen, später von David zu entscheiden:** eigener Hetzner-Server (günstig, David wartet) oder n8n Cloud EU (keine Wartung, monatlicher Betrag). Nicht Teil dieses Designs.
- Rollen: David Owner/Admin, Alexander Mitglied mit Rechten zum Bauen **[entschieden: David behält vollen Zugriff]**.

## 7. Technischer Umbau der Website (Phase 1)

### 7.1 Statischer Export
- `next.config.ts`: `output: 'export'`, `trailingSlash` passend zu den bisherigen URLs **[Builder]**.
- `headers()` aus `next.config.ts` entfällt → Cache-Regeln in `public/_headers`.
- Weiterleitungen aus `netlify.toml` (alte WordPress-URLs, 301) → `public/_redirects` (Cloudflare-Format). Alle bestehenden Weiterleitungen müssen 1:1 erhalten bleiben.
- `sitemap.ts`, `robots.ts` müssen im Export funktionieren (ggf. `export const dynamic = 'force-static'`).
- `netlify.toml` und alle Netlify-spezifischen Variablen (`CONTEXT`, `NETLIFY`, `COMMIT_REF`) entfernen bzw. durch Cloudflare-Äquivalente ersetzen.
- Testversion bekommt `noindex` (bisher `NEXT_PUBLIC_IS_STAGING`) – Mechanismus über Build-Variable des Branches **[Builder]**.

### 7.2 Bilder
- Netlify Image CDN entfällt. Ziel: responsive WebP-Größen **beim Build bzw. per bestehender GitHub Action vorab erzeugen** und über einen eigenen Loader ausliefern **[Vorschlag]** – keine kostenpflichtige oder kontingentierte Bildtransformation zur Laufzeit.
- Der Arbeitsablauf für Alexander bleibt gleich: `.jpg` in `public/images/<bereich>/` legen, im Inhalt den `.jpg`-Pfad eintragen, max. 5 MB.

### 7.3 Terminanfrage
- `app/api/termin/route.ts` wird zu einer **Cloudflare-Funktion** (Worker-Route `/api/termin` neben den statischen Dateien).
- Verhalten wie heute: Honeypot, Mail an Laden, Bestätigungsmail an Kunden (falls E-Mail angegeben) über Resend; zusätzlich **Turnstile** gegen Spam.
- **Steckdose für n8n** (vorbereitet, in Phase 1 inaktiv): Ist die Variable `N8N_WEBHOOK_URL` gesetzt, schickt die Funktion das Ereignis zusätzlich an n8n. Die Mails werden **immer** verschickt, unabhängig vom Erfolg des n8n-Aufrufs (Sicherheitsnetz).
- Einheitliches Ereignisformat für alle künftigen Formulare: `{ typ: "termin-anfrage" | "kontakt" | …, zeitpunkt, daten: {…} }` **[Vorschlag]**.

### 7.4 Statistik
- Cloudflare Web Analytics (ohne Cookies) nur auf der Live-Seite **[Vorschlag]**. Datenschutzerklärung entsprechend.

### 7.5 Testversion und Live-Gang
- Ein Cloudflare-Worker-Projekt, verbunden mit GitHub: `main` → Live-Seite (Domain), `staging` → feste Vorschau-URL.
- Testversion per **Cloudflare Access** geschützt (Login per E-Mail-Code für Alexander und David) **[Vorschlag]** – damit niemand Fremdes die Testversion findet und Google sie nicht indexiert.
- Der Ablauf aus `CLAUDE.md` (erst `staging`, live nur nach „passt, live schalten“, nie `--force`) bleibt unverändert.

### 7.6 Notfallknopf **[Vorschlag]**
- Fester Satz „Mach die letzte Änderung rückgängig“, als fester Befehl hinterlegt (siehe 8.4). Ablauf in zwei Schritten:
  1. **Sofort:** Die Live-Seite wird über den Versions-Rollback von Cloudflare auf die vorherige Version zurückgesetzt (Sekunden, kein Build). Das ist ausdrücklich vom Notfallknopf-Befehl gedeckt und braucht keine weitere Freigabe.
  2. **Danach im Git:** Der fehlerhafte Inhalt wird auf `staging` korrigiert bzw. per `git revert` der betroffenen Commits (nicht des Merge-Commits) rückgängig gemacht. Mit dem nächsten „passt, live schalten“ werden `main` und Live-Seite wieder deckungsgleich. So kommt der Fehler beim nächsten Live-Gang nicht zurück.
- Fehler nur auf der Testversion: einfach auf `staging` rückgängig machen.

## 8. Baukasten für neue Seiten

### 8.1 Abschnitts-Bausteine **[Vorschlag, Liste anpassbar durch Builder]**
Etwa 10–12 fertig gestaltete Abschnittstypen im bestehenden Design (Tokens in `app/globals.css`, Komponenten aus `components/Gestaltung.tsx` wiederverwenden):

| Baustein | Inhalt |
|---|---|
| Bühne | Überschrift, Unterzeile, Bild, optional Knopf |
| Text | Überschrift + Fließtext |
| Text mit Bild | links/rechts wählbar |
| Karten-Raster | 2–4 Karten mit Icon/Bild, Titel, Text, optional Link |
| Galerie | mehrere Fotos |
| Zitat / Bewertung | Text, Name |
| FAQ | Fragen und Antworten (vorhandene `Faq`-Komponente) |
| Hinweis-Box | kurzer hervorgehobener Hinweis |
| Handlungsaufforderung | „Termin vereinbaren“ o. ä. mit Knopf |
| Markenleiste | aus `content/marken.json` |
| Öffnungszeiten / Anfahrt | vorhandene Komponenten |
| Aktionen | vorhandene Komponente, gefiltert nach Datum |

Jeder Baustein hat ein **festes, typisiertes Datenformat** – ungültige Daten lassen `npm run build` mit verständlicher deutscher Fehlermeldung scheitern.

### 8.2 Seiten als Inhaltsdatei
- Neue Seiten liegen als JSON in `content/seiten/<adresse>.json`: Titel, Beschreibung (SEO), Menü-Einstellung (Hauptmenü / nur Fußzeile / versteckt), Suchstichworte, Liste von Bausteinen mit Daten.
- Eine dynamische Route (`app/[seite]/page.tsx` mit `generateStaticParams`) erzeugt daraus statische Seiten.
- Menü (`lib/navigation.ts`), Suchindex und `sitemap.ts` lesen diese Dateien automatisch mit.
- **Bestehende Seiten bleiben vorerst als Code** **[Vorschlag]** – sie werden nicht umgebaut. Neue Seiten entstehen nur über den Baukasten.

### 8.3 Musterbuch
- Versteckte Seite (nicht im Menü, `noindex`, nicht in der Sitemap), die jeden Baustein einmal mit Nummer und Name zeigt. Alexander kann sagen: „Neue Seite wie Baustein 1, 3 und 9.“

### 8.4 Fertige Befehle für Claude Code
Als Projekt-Skills/Befehle im Repo (`.claude/`) **[Vorschlag]**, mindestens:
- neue Seite anlegen
- neue Aktion eintragen
- Urlaub / Feiertag eintragen
- Foto austauschen
- live schalten
- letzte Änderung rückgängig machen
- (Phase 2) neue Automation bauen

### 8.5 Leitplanken in `CLAUDE.md`
- Neue Seiten **nur** aus Bausteinen; fehlt ein Baustein → David fragen, keinen eigenen Design-Code schreiben.
- „Nicht ohne David“-Liste aktualisieren: `next.config.ts`, Cloudflare-Konfiguration (`wrangler.*`, `_headers`, `_redirects`), Worker-Code, `package.json`, `.github/`, `lib/`, Impressum, Datenschutz, Gesundheitsaussagen, neue Dienste/Kosten.
- Tabelle „Wo steht was?“ um `content/seiten/` ergänzen.

## 9. Übergabe der Konten

Diese Schritte brauchen Alexanders Logins bzw. Anwesenheit. Sie stehen im Plan als **eigene Checkliste für David mit Alexander**, mit Haltepunkten; der übrige Umbau läuft vorher vollständig unter Davids Konten **[Vorschlag]**. Nach der Repo-Übertragung muss die Verbindung Cloudflare ↔ GitHub neu hergestellt werden.


- GitHub-Repo von Davids Konto auf Alexanders Konto übertragen, David als Admin. SSH-Remote auf Davids Rechner anpassen.
- Cloudflare-Konto auf Alexander anlegen, David als Administrator einladen.
- Domain `weitmarer-brillenstudio.de`: Registrierung bleibt bei Alfahosting, nur die **Nameserver** zeigen auf Cloudflare. **Achtung:** Vorher bei Alfahosting prüfen, wo das Postfach `info@…` liegt und ob ein Nameserver-Wechsel im Vertrag erlaubt ist; alle bestehenden DNS-Einträge, insbesondere **MX, SPF, DKIM**, vorher sichern und in Cloudflare 1:1 anlegen, sonst kommt keine Mail mehr an. Resend-Domain-Verifizierung im Cloudflare-DNS. Den Alfahosting-Vertrag nicht kündigen.
- Netlify-Site `wbs-staging` erst löschen, wenn die Cloudflare-Testversion läuft.
- `docs/01-zugaenge.md` auf neuen Stand bringen (keine Passwörter).

## 9a. Datenschutzerklärung **[entschieden]**

- Claude schreibt einen **Entwurf** der neuen Datenschutzerklärung, der alle eingesetzten Dienste abdeckt (Cloudflare Hosting/CDN, Turnstile, Web Analytics, Access, Resend, Terminformular inkl. Einwilligung) und das Impressum auf Vollständigkeit prüft.
- David gibt den Entwurf frei. **Haltepunkt:** Ohne Davids Freigabe kein Domain-Umzug und kein Live-Gang unter der echten Domain.

## 10. Einführung und Briefing-Paket für Alexander

- **Einrichtungs-Checkliste** für seinen Rechner: Claude Code, GitHub-Zugang (SSH-Schlüssel oder `gh`), Repo klonen, `npm install`, Testlauf „Was steht gerade bei den Öffnungszeiten?“ – gemeinsam in der Einführung abzuarbeiten.
- `docs/02-pflege-per-vibe-coding.md` erweitern um: neue Seite bauen, Musterbuch nutzen, Notfallknopf, (Phase 2) Automation bauen.
- **Beispielsätze**: 10–15 Sätze, die er wörtlich so zu Claude sagen kann.

## 11. Phase 2 – n8n (Skizze, nicht Teil der Umsetzung jetzt)

- n8n mit MCP-Anbindung an Claude Code auf Alexanders Rechner; Alexander beschreibt Abläufe in Worten, Claude baut sie.
- Regel analog Website: neuer Ablauf erst im Testmodus, Aktivierung erst nach Alexanders „passt“.
- Regelmäßige automatische Sicherung der Abläufe (Export ins Git-Repo), damit David alte Stände zurückholen kann.
- Website-Seite: nur `N8N_WEBHOOK_URL` setzen – die Steckdose aus 7.3 existiert bereits.
- Typische erste Abläufe (Vermutung): Terminanfrage weiterleiten (z. B. aufs Handy), Anfragen in einer Tabelle sammeln, Google-Bewertungen einbinden, Statistik-Mail.

## 12. Reihenfolge Phase 1 **[Vorschlag]**

1. Next.js-Update (Sicherheit) und statischer Export inkl. `_redirects`/`_headers`, Bild-Lösung.
2. Terminanfrage als Cloudflare-Funktion (+ Turnstile, + inaktive n8n-Steckdose).
3. Cloudflare-Projekt mit Live und Testversion (vorerst unter Cloudflare-Adresse), Access für Testversion.
4. Baukasten: Bausteine, Seiten-Route, Musterbuch, Menü/Suche/Sitemap-Anbindung.
5. Fertige Befehle, `CLAUDE.md`, Anleitungen, Beispielsätze.
6. Entwurf Datenschutzerklärung → Freigabe durch David (Haltepunkt).
7. Kontenübergabe GitHub/Cloudflare, Domain-Umzug (mit Mail-Prüfung), Netlify abbauen.
8. Einführung mit Alexander.

## 13. Dem Builder überlassen

- Genaue Liste und Gestaltung der Bausteine (im Rahmen des bestehenden Designs).
- Technische Umsetzung der Bildgrößen, des Worker-Setups (`wrangler`-Konfiguration), der Staging-Erkennung.
- Form der fertigen Befehle (Skills vs. Slash-Commands).
- Tests: mindestens `npm run build` als Prüfung für alle Inhaltsdateien; Validierung der Baustein-Daten.

## 14. Von Claude getroffene Entscheidungen (zum Gegenlesen)

- Resend bleibt für den Mailversand in Phase 1.
- Nur Nameserver-Umzug zu Cloudflare; Domain und Postfach bleiben bei Alfahosting.
- Notfallknopf = sofortiger Cloudflare-Rollback, danach Korrektur über `staging`.
- Kontenübergabe als eigene Checkliste mit Haltepunkten, Umbau vorher unter Davids Konten.
- Bildgrößen werden vorab erzeugt statt zur Laufzeit transformiert.
- Testversion hinter Cloudflare Access.
- Cloudflare Web Analytics als Statistik.
- Bestehende Seiten bleiben Code; nur neue Seiten über den Baukasten.
- Einheitliches Ereignisformat für die n8n-Steckdose.
- Fertige Befehle als Projekt-Skills im Repo.
