# Zugänge und Dienste

> Übersicht aller Dienste rund um **weitmarer-brillenstudio.de** – wofür sie da sind und wer sie verwaltet.
> Keine Passwörter oder Schlüssel in dieses Dokument schreiben.
>
> Stand: 9. November 2026 · Ansprechpartner: David Grimaud (DeepMetis) – david.grimaud@deepmetis.com

| Dienst | Wofür | Inhaber / Rolle | Status |
|---|---|---|---|
| GitHub (Repo `weitmarer-brillenstudio-site`) | Code und Inhalte, Branches `main` (live) und `staging` (Test), Versionsgeschichte | Alexander (Eigentümer), David Admin | Repo liegt noch bei David, Übertragung geplant |
| Cloudflare | Hosting (Worker mit statischen Dateien), Testversion pro Branch, DNS, Terminformular-Funktion, Turnstile (Spamschutz), Web Analytics, Access (Login für die Testversion) | Alexander Super-Administrator, David Administrator | anzulegen |
| Resend | Versand der Termin-Mails (Laden + Bestätigung an Kunden) | Alexander, David Zugriff | anzulegen, Domain verifizieren |
| Alfahosting | Registrar der Domain (`.de`) und vermutlich das Postfach `info@weitmarer-brillenstudio.de` | Alexander | bleibt, Vertrag nicht kündigen |

Entfallen sind: Netlify, Bunny.net, Umami, Hetzner, Cal.com. Phase 2 (n8n) ist noch nicht entschieden.

## Cloudflare: eine Site, zwei Versionen

Ein Worker-Projekt, verbunden mit dem GitHub-Repo:

| | Live-Seite | Testversion |
|---|---|---|
| Branch | `main` | `staging` |
| Adresse | `https://www.weitmarer-brillenstudio.de` (`www.weitmarer-brillenstudio.de`) | `[STAGING-URL]` (Vorschau-Adresse), mit Cloudflare Access geschützt (E-Mail-Code für Alexander und David) |
| Google | wird indexiert | `noindex` |
| Terminmails an | Postfach des Ladens | Test-Postfach (`TERMIN_TO_EMAIL_TEST`) |

Welche Variablen wo gesetzt werden: `docs/03-technik.md`, Abschnitt „Betrieb / Einrichtung Cloudflare“.
Variablen und Geheimnisse immer im Cloudflare-Dashboard setzen (oder `wrangler secret put`), nie ins Repo.

## Domain-Umzug – Achtung E-Mail

Alfahosting bleibt Registrar; es werden nur die **Nameserver** auf Cloudflare gestellt (Cloudflare kann `.de` nicht registrieren).
Vorher klären, wo das Postfach `info@…` liegt und ob der Nameserver-Wechsel im Vertrag erlaubt ist.
**Alle bestehenden DNS-Einträge, besonders MX, SPF und DKIM, vorher sichern und in Cloudflare 1:1 anlegen**,
sonst kommt keine Mail mehr an. Die Resend-Domain-Verifizierung (SPF/DKIM) wird ebenfalls im Cloudflare-DNS eingetragen.
Die Hauptadresse ist `www`; die Adresse ohne `www` leitet dorthin um.

## Übergabe-Reihenfolge

Die ausführliche, abhakbare Reihenfolge mit Haltepunkten steht in `docs/04-uebergabe-checkliste.md`. Kurz:

1. Cloudflare erst unter Davids Konto einrichten und die Testversion prüfen.
2. Datenschutzerklärung freigeben (David), Einwilligung für Gesundheitsdaten entscheiden.
3. Bei Alfahosting alle DNS-Einträge sichern, dann Cloudflare-Konto auf Alexander, GitHub-Repo übertragen, Worker neu verbinden.
4. Nameserver-Umzug (Mail testen), Domains am Worker, Apex → www, erst danach Live-Gang unter der echten Domain.
5. Alte Netlify-Sites erst löschen, wenn die Live-Seite auf Cloudflare läuft.
