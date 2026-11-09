# Übergabe-Checkliste: Umzug auf Cloudflare und Übergabe an Alexander

> Wird von **David** gemeinsam mit **Alexander** abgearbeitet, von oben nach unten. An jedem **HALTEPUNKT** wird nicht weitergemacht,
> bevor alles darüber erledigt und geprüft ist. Die Reihenfolge schützt vor allem eines: **die E-Mail des Ladens**
> (`info@weitmarer-brillenstudio.de`). Solange die Mail-Einträge nicht gesichert und in Cloudflare nachgebaut sind, werden die Nameserver nicht angefasst.
>
> Platzhalter: `[STAGING-URL]` = Vorschau-Adresse der Testversion (…`.workers.dev`); sie wird in CLAUDE.md, `.claude/skills/` und `docs/` erst in A5a durch die echte Adresse ersetzt. Die Live-Adresse ist überall fest eingetragen: `https://www.weitmarer-brillenstudio.de`.
> **Keine Passwörter, Schlüssel oder Tokens in dieses Dokument schreiben.** Sie gehören nur ins Cloudflare-Dashboard bzw. in einen Passwortmanager.
>
> Welche Variablen es gibt und was sie bedeuten: `docs/03-technik.md`, Abschnitt „Betrieb / Einrichtung Cloudflare“ (Tabelle dort nicht hier pflegen).
> Übersicht der Dienste: `docs/01-zugaenge.md`.

Wer: **D** = David, **A** = Alexander, **D+A** = beide.

---

## Teil A – Cloudflare einrichten (unter Davids Konto, vor der Übergabe)

Ziel: Testversion läuft, geschützt, Terminformular getestet. Live-Domain und E-Mail werden hier noch **nicht** berührt.

- [ ] **A1. Worker-Projekt anlegen** (D). Cloudflare-Dashboard → Workers & Pages → Create → mit GitHub verbinden, Repo `weitmarer-brillenstudio-site`.
  Projektname `weitmarer-brillenstudio-site` (muss zu `name` in `wrangler.jsonc` passen). Build-Befehl `npm run build`.
  Produktions-Branch `main` → Deploy-Befehl `npx wrangler deploy`; Testversion als **Worker Preview** `staging` (Settings → Builds → Preview anlegen, Tracking branch `staging`, Build command `npm run build`, Preview command `npx wrangler preview`). Secrets der Testversion getrennt setzen: `npx wrangler preview secret put NAME --name staging`.
  *Prüfen:* In den Einstellungen des Projekts stehen beide Befehle genau so; „Branch-Builds“ ist aktiv.
- [ ] **A2. Spamschutz und Mailversand vorbereiten** (D). Turnstile-Widget anlegen (Site-Key + Secret), Resend-Konto mit API-Key.
  Turnstile-Hostnamen: die `workers.dev`-Adresse; später kommen `www` und Apex dazu (Teil G).
  *Prüfen:* Site-Key und Secret liegen als Paar vor (nie nur eines setzen, siehe `docs/03-technik.md`).
- [ ] **A3. Geheimnisse und Variablen setzen** (D), im Dashboard (Worker → Einstellungen → Variablen und Geheimnisse bzw. Build → Build-Variablen) laut Tabelle in `docs/03-technik.md`.
  Grund: `npx wrangler deploy` (Workers Builds auf `main`) überschreibt einfache Dashboard-Variablen, die nicht in `wrangler.jsonc` stehen. **Secrets** (verschlüsselt) bleiben bei jedem Deploy erhalten.
  - **Worker-Secrets:** `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `TERMIN_TO_EMAIL` (Postfach des Ladens), `TERMIN_TO_EMAIL_TEST` (Davids Test-Postfach, **Pflicht**); `LIVE_HOST` später (vor den Domains, Schritt G0), siehe unten.
  - **Build-Variablen** (Workers Builds, werden beim Bauen eingebacken): `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_CF_BEACON_TOKEN`, `SITE_URL` (`https://www.weitmarer-brillenstudio.de`)
  - **`LIVE_HOST` noch nicht setzen.** Erst unmittelbar **vor** dem Anhängen der Domains (Schritt G0). Solange er fehlt, gilt jede Adresse als Testversion, und Terminmails gehen nie an den Laden.
  *Prüfen:* Alle Einträge sichtbar (Werte verdeckt), die vier Worker-Werte unter „Geheimnisse“. Kein Wert steht im Repo (`git grep -n "re_"` findet nichts).
- [ ] **A4. Cloudflare Access auf die Vorschau-Adressen legen** (D). Zero Trust → Access → Anwendung für die Vorschau-Adresse (`*-weitmarer-brillenstudio-site.david-grimaud33.workers.dev`);
  Regel „E-Mail-Code“ für die Adressen von David und Alexander. *Prüfen:* siehe A6.
- [ ] **A4a. Resend-Absenderdomain jetzt verifizieren** (D, **vor A5/A6**). Der Absender `termin@weitmarer-brillenstudio.de` (`TERMIN_FROM_EMAIL` in `wrangler.jsonc`) funktioniert nur, wenn die Domain in Resend verifiziert ist; sonst lehnt Resend den Versand ab und das Terminformular meldet in A6, D3 und F3 einen Fehler (502).
  In Resend die Domain `weitmarer-brillenstudio.de` hinzufügen und die genannten Einträge **bei Alfahosting** (dort liegt die DNS-Zone bis zum Nameserver-Wechsel) anlegen: DKIM (TXT), SPF und den Return-Path-MX auf einer **Subdomain** (z. B. `send.`), nie auf dem Apex.
  Zu einem vorhandenen SPF-Eintrag auf dem Apex den Resend-Teil **ergänzen**, nie einen zweiten SPF-Eintrag anlegen; den MX-Eintrag des Ladens (`info@`) nicht verändern. Warten, bis Resend „Verified“ zeigt (Minuten bis Stunden).
  *Prüfen:* Resend zeigt die Domain als „Verified“. Die neuen Einträge sind danach Teil der DNS-Sicherung (C2) und werden in E2 in Cloudflare nachgebaut.
- [ ] **A5. Branch `umbau-cloudflare` in `staging` mergen und pushen** (D). Erst nach grünem `npm run build` und `npm test` auf `umbau-cloudflare`.
  ```
  git checkout staging && git pull && git merge umbau-cloudflare && git push
  ```
  *Prüfen:* In Cloudflare läuft ein Build für `staging` und endet grün; die Vorschau-Adresse `[STAGING-URL]` erscheint.
- [ ] **A5a. Platzhalter `[STAGING-URL]` ersetzen** (D), sobald die Vorschau-Adresse feststeht und stabil ist: `[STAGING-URL]` in `CLAUDE.md`, `.claude/skills/` und `docs/` durch die feste Vorschau-Adresse ersetzen (über `staging` committen).
  *Prüfen:* `grep -rn "STAGING-URL" CLAUDE.md .claude docs --exclude=04-uebergabe-checkliste.md --exclude-dir=superpowers` findet nichts (diese Checkliste nennt den Platzhalter selbst und wird ausgenommen).
- [ ] **A6. Testversion prüfen** (D, Alexander schaut zu):
  - [ ] `[STAGING-URL]` im privaten Fenster öffnen: **Login per E-Mail-Code ist Pflicht**; ohne Login keine Seite. Mit Davids und Alexanders Adresse klappt der Login, eine fremde Adresse bekommt keinen Zugang.
  - [ ] Alle Hauptseiten laden (Start, Sehhilfen, Augengesundheit, Service & Preise, Über uns, Holzkern, Termin, Impressum, Datenschutz, `/musterbuch`).
  - [ ] Alte WordPress-Adressen leiten weiter (aus `public/_redirects`): z. B. `/relax24/` → Service & Preise, `/kontakt/` → Termin, `/produkte/glaeser/` → Sehhilfen, `/angebote/irgendwas` → Service & Preise.
  - [ ] **Varianten ohne Schrägstrich testen:** `/relax24` und `/kontakt`. Die alten Regeln stehen mit Schrägstrich am Ende. Cloudflare kann die Variante ohne Schrägstrich anders behandeln
    (leitet auf die Variante mit Schrägstrich um, oder liefert 404). **Ergebnis hier notieren:** `/relax24` → ______ ; `/kontakt` → ______.
    Liefert eine Variante 404, ist das **vor dem Live-Gang zu entscheiden** (zusätzliche Regeln in `public/_redirects` einfügen; das ist eine Änderung an einer geschützten Datei, also Davids Aufgabe) und alle 13 Regeln mit beiden Schreibweisen zu testen. Alte Google-Treffer verlieren sonst ihr Ziel.
  - [ ] Seite zeigt auf der Testversion `noindex` (Seitenquelltext: `<meta name="robots" content="noindex…">`).
  - [ ] **Terminformular absenden** mit Testdaten (setzt A4a voraus: Resend-Domain verifiziert): Die Mail kommt **nur im Test-Postfach** an (`TERMIN_TO_EMAIL_TEST`), die Bestätigung geht an die angegebene Kundenadresse (hier die eigene eintragen). **Im Postfach des Ladens darf nichts ankommen** (Alexander bestätigt).
  *Haltepunkt 1:* Resend-Domain verifiziert (A4a), alle Häkchen in A6 gesetzt, 404-Entscheidung getroffen. Vorher nicht weiter.

---

## Teil B – Voraussetzungen vor dem Live-Gang (rechtlich und fachlich)

- [ ] **B1. Datenschutzerklärung freigeben** (D). `app/datenschutz/page.tsx` ist ein Entwurf. Alle Stellen mit `[PRÜFEN: …]`, `[SPEICHERDAUER]` und `[DATUM DER FREIGABE]` klären und ausfüllen
  (Cloudflare-/Resend-Auftragsverarbeitung abgeschlossen? DPF/SCC? E-Mail-Anbieter des Ladens? Speicherdauern, Aufsichtsbehörde).
  Danach die rote Box „Entwurf – nicht freigegeben“ entfernen. Nach der Freigabe: Impressum prüfen lassen.
  *Prüfen:* `grep -n "PRÜFEN\|SPEICHERDAUER\|DATUM DER FREIGABE\|Entwurf" app/datenschutz/page.tsx` findet nichts mehr; Seite auf der Testversion durchlesen.
- [ ] **B2. Einwilligung für Gesundheitsdaten im Terminformular entscheiden** (D, mit Alexander). Der Text der Checkbox in `components/TerminAssistent.tsx` lautet heute nur: „Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden.“
  Das Anliegen (z. B. Augenbeschwerden) kann Gesundheitsdaten enthalten (Art. 9 DSGVO, ausdrückliche Einwilligung). Entscheidung treffen und festhalten:
  Text der Checkbox ausdrücklich um Gesundheitsangaben erweitern **oder** das Freitextfeld/Anliegen so gestalten, dass keine Gesundheitsdaten verlangt werden. Datenschutzerklärung Abschnitt 5 und Formular müssen zusammenpassen.
  Entscheidung: ______________________ (Datum ______). Änderung am Formular über David, wieder auf `staging` testen (A6).
- [ ] **B3. Platzhalter und Fakten** (D+A). `grep -rn "\[" content/` durchgehen: eckige Klammern müssen geklärt oder bewusst gelassen sein.
  Gesundheitsaussagen (TearStim) rechtlich geprüft; RELAX24-Rechner nur aktiv, wenn die Konditionen bestätigt sind (`content/garantien.json`).
  *Haltepunkt 2:* B1 bis B3 erledigt. Ohne freigegebene Datenschutzerklärung kein Domain-Umzug und kein Live-Gang.

---

## Teil C – Alfahosting: Lage klären und DNS sichern (E-Mail-Schutz)

- [ ] **C1. Klären, wo das Postfach liegt** (D+A). Bei Alfahosting nachsehen: Läuft `info@weitmarer-brillenstudio.de` dort (Mailhosting im Paket) oder bei einem anderen Anbieter?
  Ist der **Wechsel der Nameserver** im Vertrag erlaubt (Alfahosting-Kundenmenü, Domainverwaltung / Nameserver, ggf. Rückfrage beim Support)? Ergebnis notieren: ______________________
- [ ] **C2. Alle DNS-Einträge exportieren** (D+A). Im Alfahosting-Kundenmenü die gesamte DNS-Zone ansehen und **abspeichern** (Screenshot **und** abgeschriebene Liste in einer Datei außerhalb des Repos, z. B. im Passwortmanager als Notiz). Vollständig:
  - [ ] **MX** (alle, mit Priorität)
  - [ ] **SPF** (TXT mit `v=spf1 …`)
  - [ ] **DKIM** (TXT/CNAME, oft `…._domainkey`)
  - [ ] **DMARC** (`_dmarc`), sonstige **TXT** (Verifizierungen z. B. für Google, Microsoft)
  - [ ] **A/AAAA/CNAME** für Apex, `www` und **alle Subdomains** (z. B. `mail.`, `webmail.`, `autodiscover.`, `autoconfig.`, `ftp.`)
  - [ ] **SRV**, **CAA**, falls vorhanden
  - [ ] Die in A4a angelegten **Resend-Einträge** (DKIM, SPF-Ergänzung, Return-Path-MX der Subdomain) sind mit dabei.
  - [ ] **Ursprüngliche Nameserver notieren:** `dig NS weitmarer-brillenstudio.de +short`, Ausgabe wörtlich in die Sicherung legen. Der Notausstieg in E6 und G7 stellt genau diese Werte wieder her. Ergebnis: ______________________
  - [ ] **DNSSEC aktiv?** DS-Eintrag bei Alfahosting bzw. DENIC prüfen (z. B. `dig DS weitmarer-brillenstudio.de +short`, Domainverwaltung bei Alfahosting). Ergebnis notieren: ______. Wenn aktiv, ist E5a Pflicht.
  *Prüfen:* Zusätzlich von außen gegenprüfen, falls das Kundenmenü unvollständig wirkt:
  `dig MX weitmarer-brillenstudio.de +short`, `dig TXT weitmarer-brillenstudio.de +short`, `dig TXT _dmarc.weitmarer-brillenstudio.de +short`, `dig CNAME www.weitmarer-brillenstudio.de +short`. Die Ausgabe in die Sicherung legen.
- [ ] **C3. Alfahosting-Vertrag und Domain bleiben bestehen** (A). Der Vertrag wird **nicht gekündigt**: Die Domain ist dort registriert (Cloudflare Registrar unterstützt `.de` nicht), nur die Nameserver wechseln. Falls das Postfach dort liegt, braucht es den Vertrag weiter.
  *Haltepunkt 3:* DNS-Sicherung vollständig, Postfach-Ort bekannt, Nameserver-Wechsel erlaubt.

---

## Teil D – Konten und Repo auf Alexander übertragen

Die Einrichtung aus Teil A wird im neuen Konto **wiederholt**; das Konto von David dient nur als Probelauf und wird danach abgebaut (D4).

- [ ] **D1. Cloudflare-Konto für Alexander** (A legt an, D begleitet). Alexander ist Super-Administrator (Zwei-Faktor aktivieren), David wird als Administrator eingeladen.
  *Prüfen:* David sieht das Konto von Alexander in seinem Dashboard.
- [ ] **D2. GitHub-Repo auf Alexanders Konto übertragen** (D überträgt, A nimmt an). Repo → Settings → Transfer ownership; danach David als Admin hinzufügen.
  Auf Davids Rechner `git remote set-url origin <neue Adresse>` (SSH oder HTTPS). *Prüfen:* `git fetch` funktioniert; Branches `main` und `staging` sind da; auf GitHub sind Branch-Schutz und Actions (`guard-media-size`) weiter aktiv.
- [ ] **D3. Worker-Projekt in Alexanders Cloudflare neu anlegen** (D+A). Wie A1 bis A4, aber im Konto von Alexander und mit dem übertragenen Repo: Workers Builds neu mit GitHub verbinden,
  Secrets/Variablen **neu setzen** (neues Resend-Konto von Alexander **mit neu hinzugefügter und verifizierter Absenderdomain**: Resend nennt für das neue Konto evtl. andere DKIM/SPF-/Return-Path-Einträge, dann im DNS (Alfahosting bzw. nach E2 Cloudflare) die alten Resend-Einträge ersetzen und auf „Verified“ warten, sonst scheitert das Formular; neues Turnstile-Widget, neuer Beacon-Token; `TERMIN_TO_EMAIL_TEST` bleibt Davids Postfach), Access neu einrichten.
  Alexander gibt Cloudflare den Zugriff auf das GitHub-Repo. *Prüfen:* Ein Push auf `staging` baut im neuen Konto; Teil A6 komplett wiederholen (Login, Seiten, Weiterleitungen, Testmail nur im Test-Postfach). Danach `[STAGING-URL]` erneut ersetzen (Schritt A5a, die Vorschau-Adresse im neuen Konto ist eine andere), gleiche `grep`-Prüfung.
- [ ] **D4. Altes Projekt in Davids Konto abschalten** (D), erst wenn D3 geprüft ist: Projekt löschen oder mindestens die Verbindung zum Repo trennen, damit nicht zwei Projekte gleichzeitig bauen.
  *Haltepunkt 4:* Testversion läuft vollständig unter Alexanders Konten.

---

## Teil E – Domain-Zone in Cloudflare und Nameserver-Wechsel

- [ ] **E1. Zone anlegen** (D+A). In Alexanders Cloudflare „Website hinzufügen“ mit `weitmarer-brillenstudio.de`, Free-Tarif. Cloudflare nennt zwei Nameserver; **notieren**.
  Die Zone bleibt „ausstehend“, bis die Nameserver bei Alfahosting umgestellt sind. Die Live-Seite bleibt bis dahin unberührt.
- [ ] **E2. DNS-Einträge 1:1 nachbauen** (D). Jeden Eintrag aus der Sicherung (C2) in Cloudflare anlegen. Wichtig:
  - MX, SPF, DKIM, DMARC und alle sonstigen TXT **exakt** übernehmen (Werte, Priorität), darunter die **Resend-Einträge aus A4a** (bzw. die neuen aus D3).
  - Einträge für Mail (`mail.`, `webmail.`, `autodiscover.` usw.) auf **„Nur DNS“ (graue Wolke)** stellen, nie über den Cloudflare-Proxy.
  - Die **alten** Einträge für Apex und `www` (A/CNAME auf den bisherigen Webspace) erst in Teil G (G1) durch die Worker-Domains ersetzen, vorher die alte Seite weiter erreichbar lassen.
  *Prüfen:* Cloudflare kann beim Anlegen der Zone Einträge automatisch einlesen; Ergebnis **trotzdem Zeile für Zeile** mit der Sicherung abgleichen. Zweite Person (A) liest vor, D hakt ab.
- [ ] **E3. Resend-Domain erneut prüfen** (D). Die Domain wurde schon in A4a (bzw. D3) verifiziert und die Einträge in E2 nachgebaut. In Resend „Verify“ erneut auslösen: Die Domain muss nach dem Nameserver-Wechsel weiter „Verified“ sein (SPF nur **ein** Eintrag, Resend-Teil enthalten). Der Absender `termin@weitmarer-brillenstudio.de` (`TERMIN_FROM_EMAIL`) braucht das.
  *Prüfen:* Resend zeigt die Domain als „Verified“; Terminformular auf der Testversion schickt weiter Mails.
- [ ] **E4. Zeitpunkt wählen** (D+A). Nameserver-Wechsel nicht kurz vor Ladenschluss oder am Freitagabend; die Umstellung kann bis zu 24 Stunden dauern. Sofort danach Mail testen können.
- [ ] **E5a. Nur wenn DNSSEC aktiv ist (C2):** bei Alfahosting DNSSEC deaktivieren und den **DS-Eintrag entfernen**, danach mindestens die TTL des DS-Eintrags abwarten (meist bis zu 24 Stunden, im Zweifel einen Tag Vorlauf). Erst dann E5. Sonst können Resolver, die DNSSEC prüfen, die Domain nach dem Wechsel als ungültig ablehnen und **auch Mail geht dann verloren**.
- [ ] **E5. Nameserver bei Alfahosting umstellen** (A im Kundenmenü, D leitet an) auf die zwei Cloudflare-Nameserver aus E1.
  *Prüfen:* `dig NS weitmarer-brillenstudio.de +short` zeigt Cloudflare; Zone in Cloudflare wechselt auf „Aktiv“.
- [ ] **E6. Mail testen** (D+A), sofort und nochmal nach einigen Stunden:
  - [ ] `dig MX weitmarer-brillenstudio.de +short` liefert dieselben Einträge wie in der Sicherung.
  - [ ] **Empfang:** Testmail von einer fremden Adresse (z. B. Davids) an `info@weitmarer-brillenstudio.de`; Alexander bestätigt den Eingang im Postfach.
  - [ ] **Versand:** Alexander schickt eine Mail aus dem Postfach an eine fremde Adresse; sie kommt an und landet nicht im Spam (SPF/DKIM: im Mail-Header prüfen).
  - [ ] Die alte Webseite (bisheriger Webspace) ist über `www` noch erreichbar, falls sie bis jetzt weiterläuft.
  - [ ] **DNSSEC (falls vorher aktiv):** erst jetzt, **nach bestandenen Mail-Tests**, in Cloudflare (DNS → Einstellungen → DNSSEC) aktivieren und den dort angezeigten **neuen DS-Eintrag** bei Alfahosting eintragen. Danach `dig MX …` und Mail-Test wiederholen.
  **Im Fehlerfall:** Nameserver bei Alfahosting wieder auf die ursprünglichen Werte aus C2 zurückstellen und die Sicherung C2 vergleichen.
  *Haltepunkt 5:* Mail-Empfang und -Versand laufen über die neuen Nameserver. Ohne das kein Teil F.

---

## Teil F – Freigabe, Production-Deploy und Rauchtest (noch ohne eigene Domain)

Bis hier hängt keine echte Domain am Worker. Jetzt wird `main` gebaut und **zuerst unter der Production-`workers.dev`-Adresse** geprüft. Erst danach gehen Domains dran.
Hinweis: Diese Adresse ist nicht durch Access geschützt und hat kein `noindex`; sie nur intern verwenden und die Zeit bis G5 kurz halten.

- [ ] **F1. Davids ausdrückliche Freigabe** (D, schriftlich im Chat oder Notiz mit Datum): „Live-Gang freigegeben.“ Voraussetzungen alle abgehakt: A6, B1 bis B3, E6 (inkl. DNSSEC-Schritt), Haltepunkte 1 bis 5.
- [ ] **F2. `main` bauen und deployen** (D mit A), nach dem Ablauf des Befehls `live-schalten`:
  ```
  git checkout main && git pull && git merge staging && git push
  ```
  Danach zurück auf `staging`: `git checkout staging`. *Prüfen:* Cloudflare-Build für `main` grün; `npx wrangler deployments list` zeigt die neue Veröffentlichung.
  **Nach jedem Deploy prüfen:** (1) `LIVE_HOST` ist hier **noch nicht** gesetzt (richtig), die vier Worker-Secrets aus A3 sind weiter vorhanden (Dashboard → Geheimnisse); (2) Zustand von `workers.dev` entspricht dem Plan (hier: Production-`workers.dev` **an**, weil F3 sie braucht).
- [ ] **F3. Rauchtest auf der Production-`workers.dev`-Adresse** (D+A):
  - [ ] Alle Hauptseiten laden; alte Adressen leiten weiter (A6-Liste inkl. Entscheidung zu den Varianten ohne Schrägstrich).
  - [ ] Terminformular mit Testdaten absenden (Resend-Domain verifiziert, E3): Die Mail geht **ans Test-Postfach**, nicht an den Laden (Host ist `workers.dev`, `LIVE_HOST` fehlt). **Im Postfach des Ladens darf nichts ankommen.**
  - [ ] Turnstile funktioniert (Hostname `workers.dev` ist im Widget eingetragen, A2).
  *Haltepunkt 6:* Production-Version unter `workers.dev` ist in Ordnung. **Noch keine Domain angehängt, `LIVE_HOST` nicht gesetzt.** Bei Fehlern: `rueckgaengig`-Ablauf bzw. Fix über `staging`, die Domain wird noch nicht berührt.

---

## Teil G – Domains umschalten (der eigentliche Live-Gang) und Live-Prüfung

- [ ] **G0. `LIVE_HOST` als Worker-Secret setzen, bevor die Domains angehängt werden** (D): Name `LIVE_HOST`, Wert genau **`www.weitmarer-brillenstudio.de`**. Das ist jetzt gefahrlos, weil noch keine Anfrage mit diesem Hostnamen den Worker erreicht. Würde er erst nach G1 gesetzt, gingen echte Kundenanfragen in der Zwischenzeit ans Test-Postfach statt an den Laden.
  *Prüfen:* Das Secret erscheint im Dashboard; Production-`workers.dev` schickt Terminmails weiter ans Test-Postfach.
- [ ] **G1. Custom Domains am Worker** (D). Im Worker-Projekt (Alexanders Konto) → Domains → `www.weitmarer-brillenstudio.de` **und** `weitmarer-brillenstudio.de` (Apex) hinzufügen.
  Cloudflare ersetzt dabei vorhandene A/CNAME-Einträge für diese Namen (der **Rückweg steht unter G7**); Mail-Einträge (MX/TXT) bleiben unberührt, danach trotzdem `dig MX` wiederholen.
  *Prüfen:* Beide Namen zeigen das Zertifikat „aktiv“.
- [ ] **G2. Weiterleitung Apex → www** (D), **sofort nach G1**. Cloudflare → Regeln → Redirect Rules: Wenn Hostname = `weitmarer-brillenstudio.de`, dann 301 auf `https://www.weitmarer-brillenstudio.de${http.request.uri.path}` (Pfad und Abfrage erhalten).
  *Prüfen:* `curl -sI https://weitmarer-brillenstudio.de/termin` zeigt `301` und `location: https://www.weitmarer-brillenstudio.de/termin`.
- [ ] **G3. `LIVE_HOST` prüfen** (D): Das Secret wurde schon in G0 gesetzt (Name `LIVE_HOST`, Wert genau **`www.weitmarer-brillenstudio.de`**); fehlt es, jetzt **sofort** nachholen. Es gibt nur **einen** Live-Hostnamen. Die Worker-Einstellungen gelten für alle Versionen des Workers; Vorschau-Adressen haben einen anderen Hostnamen und bleiben deshalb automatisch im Testmodus (Terminmails ans Test-Postfach, `noindex`; siehe `worker/termin.ts`).
  Es darf keine `NEXT_PUBLIC_IS_STAGING`-Variable von Hand gesetzt werden.
  *Prüfen:* Das Secret ist im Dashboard sichtbar; Terminformular auf `https://www.weitmarer-brillenstudio.de` (G6) geht jetzt an den Laden, auf `workers.dev` und Vorschau-Adressen weiter ans Test-Postfach.
- [ ] **G4. Turnstile und Statistik** (D). Turnstile-Widget: `www.weitmarer-brillenstudio.de` und Apex als Hostnamen eintragen. Web Analytics: Standort `www.weitmarer-brillenstudio.de`; Beacon-Token ist als Build-Variable gesetzt (A3/D3).
- [ ] **G5. `workers.dev` für Production abschalten, in Git** (D). In `wrangler.jsonc` `"workers_dev": false` ergänzen (geschützte Datei, nur Davids Änderung), über `staging` testen (`npm run build`) und nach `main` bringen (wie F2). Nur im Dashboard abzuschalten reicht nicht: Der nächste `wrangler deploy` schaltet `workers.dev` sonst wieder ein.
  Die **Vorschau-Adressen** (`preview_urls: true`) bleiben, geschützt durch Access.
  **Prüfen nach diesem Deploy:** (1) `LIVE_HOST` ist im Dashboard weiter vorhanden, ebenso die übrigen Worker-Secrets; (2) die Production-`workers.dev`-Adresse liefert keine Seite mehr; (3) `[STAGING-URL]` fragt weiter nach dem Login; (4) `https://www.weitmarer-brillenstudio.de` lädt.
- [ ] **G6. Live-Seite prüfen** (D+A) auf `https://www.weitmarer-brillenstudio.de`:
  - [ ] Seite lädt unter `https://www…`; `https://weitmarer-brillenstudio.de` leitet auf `www` um; `http://` leitet auf `https://`.
  - [ ] **Kein** `noindex` im Quelltext, `robots.txt` und `sitemap.xml` zeigen auf `www.weitmarer-brillenstudio.de`.
  - [ ] Alte Adressen leiten weiter (A6-Liste).
  - [ ] **Terminformular mit einer echten Testanfrage** (Name deutlich als „TEST“ markieren): Die Mail kommt im **Postfach des Ladens** an, die Bestätigung bei der Testadresse. Alexander löscht die Test-Mail danach.
  - [ ] Cloudflare Web Analytics zählt (nach einigen Minuten sichtbar).
  - [ ] `dig MX weitmarer-brillenstudio.de +short` unverändert gegenüber der Sicherung.
- [ ] **G7. Notausstieg für den Domain-Schritt** (nur bei Problemen, D). Reihenfolge:
  1. Im Worker unter Domains die Custom Domains `www.` und Apex **entfernen**, die Redirect Rule (G2) deaktivieren.
  2. Im Cloudflare-DNS die **alten A/CNAME-Einträge für Apex und `www` aus der Sicherung C2 wieder anlegen** (Alfahosting-Webspace); alle Mail-Einträge bleiben unverändert.
  3. `LIVE_HOST` löschen (Secret entfernen; ab G0 ist es gesetzt), damit nichts mehr als „live“ gilt.
  4. Prüfen: `dig www.weitmarer-brillenstudio.de +short` zeigt wieder die alten Ziele, alte Seite lädt, `dig MX` und Mail-Test (E6) bestanden.
  5. Bleibt dennoch alles kaputt: Nameserver bei Alfahosting auf die ursprünglichen Werte zurück (siehe E6, Fehlerfall; bei aktivem DNSSEC vorher den DS-Eintrag beachten).
  *Haltepunkt 7:* Live-Seite und Formular laufen (G6 komplett) oder der Notausstieg ist durchgeführt und geprüft.
- [ ] **G8. Rollback einmal echt testen** (D führt aus, A schaut zu; Ablauf wie im Skill `rueckgaengig`, Teil A):
  1. `npx wrangler deployments list` anzeigen. Ziel **nur** aus dieser Liste (nie aus `npx wrangler versions list`, dort stehen auch nie veröffentlichte Testversionen).
     Gibt es erst **eine** Veröffentlichung, vorher eine harmlose Änderung (z. B. ein Leerzeichen in einem Kommentar in einer Content-Datei) über `staging` → `main` live bringen, damit es ein Ziel gibt.
  2. Vorherige Veröffentlichung nennen, Alexander bestätigt.
  3. `npx wrangler rollback <VERSION-ID> --message "Rollback-Test bei der Übergabe" --yes`
  4. `npx wrangler deployments list` zeigt die gewählte Version als aktiv; Live-Seite öffnen (`https://www.weitmarer-brillenstudio.de`).
  5. **Wieder vorwärts:** Die neueste Veröffentlichung aus `deployments list` auf dieselbe Art wieder aktivieren (`npx wrangler rollback <NEUESTE-VERSION-ID> --message "Zurück auf aktuellen Stand" --yes`); `deployments list` prüfen, Live-Seite prüfen.
  Hinweis: Der Rollback ändert nur die Live-Seite, nicht Git. Beim nächsten Push auf `main` gilt wieder der Stand aus Git.
  *Prüfen:* Nach dem Zurückrollen ist die aktuelle (neueste) Version wieder aktiv, Formular erneut kurz getestet.

---
  *Haltepunkt 8:* Rollback getestet und wieder vorwärts; `LIVE_HOST` und `workers.dev`-Zustand danach nochmals geprüft.

---

## Teil H – Aufräumen

- [ ] **H1. Netlify-Site `wbs-staging` löschen** (D), erst wenn G6 bestanden ist und die Testversion unter Cloudflare läuft. Auch alte Netlify-Formulare/Zugänge schließen.
- [ ] **H2. `docs/01-zugaenge.md` aktualisieren** (D): Netlify-Hinweise streichen (steht dort schon als „entfallen“), Status von Cloudflare/Resend/GitHub auf „eingerichtet“ setzen, Repo-Inhaber eintragen.
- [ ] **H3. Offene Punkte in `docs/03-technik.md` abhaken** (D), was erledigt ist.
- [ ] **H4. Alten Webspace bei Alfahosting** (D+A): Nur ansehen, **nicht kündigen**. Erst nach Wochen, wenn klar ist, dass Postfach und Domain wirklich nichts mehr brauchen, über Änderungen am Vertrag sprechen.

---

## Teil I – Alexanders Rechner einrichten

Alexander arbeitet danach selbst mit Claude Code. Alles in einer Sitzung, David sitzt daneben.

- [ ] **I1. Claude Code installieren** (A mit D) und anmelden (Anleitung von Anthropic für macOS/Windows). *Prüfen:* `claude --version` zeigt eine Versionsnummer.
- [ ] **I2. Git und Node.js installieren** (D). *Prüfen:* `git --version`, `node --version`.
- [ ] **I3. GitHub-Zugang** (A mit D): `gh auth login` (GitHub CLI, Anmeldung im Browser) **oder** SSH-Schlüssel erzeugen und bei GitHub hinterlegen.
  *Prüfen:* `gh auth status` bzw. `ssh -T git@github.com` meldet Alexanders Konto.
- [ ] **I4. Repo klonen** (A): `git clone <Repo-Adresse>` in einen Ordner, z. B. `Dokumente/weitmarer-brillenstudio-site`; dann `git checkout staging`.
- [ ] **I5. Abhängigkeiten installieren** (A): `npm install` im Projektordner (richtet auch den Commit-Schutz gegen zu große Dateien ein, `.githooks`). *Prüfen:* läuft ohne Fehler durch; danach `npm run build` grün.
- [ ] **I6. Cloudflare-Anmeldung für Rückgängig-Machen** (A): `npx wrangler login` im Browser mit **Alexanders** Cloudflare-Konto. *Prüfen:* `npx wrangler whoami` zeigt Alexanders Konto; `npx wrangler deployments list` listet die Veröffentlichungen.
- [ ] **I7. Erster Test mit Claude Code** (A): Im Projektordner `claude` starten, Satz eingeben: **„Was steht gerade bei den Öffnungszeiten?“**
  *Prüfen:* Claude antwortet in einfachem Deutsch mit den Zeiten aus `content/oeffnungszeiten.json` und ändert nichts.
- [ ] **I8. Musterbuch und Beispielsätze zeigen** (D): `[STAGING-URL]/musterbuch` (Bausteine mit Nummern) öffnen und `docs/05-beispielsaetze.md` durchgehen; Alexander probiert einen Satz aus („Nimm die Aktion … raus“ oder eine Urlaubseintragung) auf `staging`, sieht die Änderung auf der Testversion und verwirft sie wieder (Befehl `rueckgaengig`, Teil B).
- [ ] **I9. Abschluss** (D+A): Alexander weiß, wo `docs/02-pflege-per-vibe-coding.md` und `docs/05-beispielsaetze.md` liegen; David ist als Ansprechpartner eingetragen. Übergabe in `docs/01-zugaenge.md` mit Datum vermerken.

---

## Kurzfassung der Haltepunkte

1. Resend-Absenderdomain verifiziert (A4a); Testversion geprüft (Login, Seiten, Weiterleitungen, Testmail nur im Test-Postfach).
2. Datenschutzerklärung freigegeben, Einwilligung für Gesundheitsdaten entschieden.
3. DNS-Sicherung vollständig (inkl. Resend-Einträge und ursprünglicher Nameserver), Nameserver-Wechsel erlaubt.
4. Alles läuft unter Alexanders Konten (Cloudflare, GitHub, Resend mit verifizierter Domain, Turnstile).
5. Mail-Empfang und -Versand nach dem Nameserver-Wechsel getestet.
6. Production-Version unter `workers.dev` getestet (Testmail geht noch ans Test-Postfach), noch keine Domain, kein `LIVE_HOST`.
7. `LIVE_HOST` gesetzt (G0), dann Domains umgeschaltet, Live-Seite und Formular getestet (oder Notausstieg G7 durchgeführt).
8. Rollback einmal geübt und wieder vorwärts.
