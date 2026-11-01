# Zugänge und Dienste

> Übersicht aller Dienste rund um **weitmarer-brillenstudio.de** – wofür sie da sind und wer sie verwaltet.
> Keine Passwörter oder Schlüssel in dieses Dokument schreiben.
>
> Stand: 1. November 2026 · Ansprechpartner: David Grimaud (DeepMetis) – david.grimaud@deepmetis.com

| Dienst | Wofür | Status |
|---|---|---|
| GitHub `davidgrimaud33-create/weitmarer-brillenstudio-site` | Code und Inhalte, Branches `main` (live) und `staging` (Test) | angelegt |
| Netlify – Site „Production“ | baut `main`, Domain weitmarer-brillenstudio.de | anzulegen |
| Netlify – Site „Staging“ | baut `staging`, z. B. `wbs-staging.netlify.app` | anzulegen |
| Bunny.net | Bilder-CDN (Pull Zone) und Videos (Stream) | anzulegen |
| Resend | Mails der Terminanfrage | anzulegen, Domain verifizieren |
| Hetzner (eigener Server) | Umami-Statistik, n8n-Automatisierungen, ggf. Cal.com | anzulegen |
| Domain / DNS | derzeit bei Alfahosting (laut alter Datenschutzerklärung) | Umzug planen |

## Netlify

Zwei Sites aus **einem** Repo (wie bei MB Barbier):

| | Production | Staging |
|---|---|---|
| Branch | `main` | `staging` |
| `NEXT_PUBLIC_IS_STAGING` | – | `true` (keine Google-Indexierung, kein sichtbarer Hinweis) |
| `SITE_URL` | `https://www.weitmarer-brillenstudio.de` | Staging-URL |
| `RESEND_API_KEY` | ja | ja |
| `TERMIN_TO_EMAIL` | Postfach des Ladens | Test-Postfach (David) |
| `TERMIN_FROM_EMAIL` | `Weitmarer Brillenstudio <termin@weitmarer-brillenstudio.de>` | gleich |
| `IMAGE_CDN_URL` | Bunny-Pull-Zone (optional) | – |
| `NEXT_PUBLIC_UMAMI_SRC` / `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | nach Hetzner-Setup | – |

Variablen immer im Netlify-UI pro Site setzen, nicht in `netlify.toml`.
Nach Änderung: „Clear cache and deploy site“.

## Domain-Umzug – Achtung E-Mail

`info@weitmarer-brillenstudio.de` läuft vermutlich über Alfahosting. Beim Umstellen der DNS-Einträge
auf Netlify die **MX-Einträge (Mailempfang) unverändert übernehmen**, sonst kommt keine Mail mehr an.
Vorher mit Alexander klären, wo das Postfach liegt.

## Hetzner (geplant)

Eigener Server, getrennt von MB Barbier. Vorgesehen nach dem Muster des MB-Servers:
Ubuntu 24.04, Caddy als Reverse Proxy, Docker, automatische Sicherheitsupdates, monatlicher Neustart.
Dienste: Umami (Statistik ohne Cookies), n8n (z. B. Google-Bewertungen einbinden, tägliche Statistik-Mail,
Terminanfragen weiterleiten). Cal.com nur, falls Online-Terminbuchung mit echten Zeitslots gewünscht ist.
