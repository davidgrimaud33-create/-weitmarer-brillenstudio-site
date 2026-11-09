# Technische Dokumentation

> Aufbau nach dem Vorbild von **mb-barbier-site**, angepasst: nur Deutsch, kein CMS (Pflege per Vibe-Coding),
> statischer Export auf Cloudflare, Staging auf eigenem Branch.
>
> Stand: 9. November 2026

## Stack

| Schicht | Technik |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'` → statische Dateien in `out/`), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 (Tokens in `app/globals.css`), Schrift Archivo (variabel) |
| Inhalte | JSON in `content/`, typisiert über `lib/content.ts`; neue Seiten als `content/seiten/<adresse>.json` aus Bausteinen |
| Hosting | Cloudflare Worker (`wrangler.jsonc`) mit Static Assets aus `./out`; `main` → Live-Seite, `staging` → Vorschau-URL hinter Cloudflare Access |
| Formular | `worker/` (nur `/api/termin` läuft im Worker): Honeypot, Turnstile, Mail an Laden + Bestätigung an Kunden über Resend, optional Ereignis an n8n (`N8N_WEBHOOK_URL`); Mail an den Laden wird immer versucht |
| Bilder | `scripts/bildgroessen.mjs` erzeugt beim Build WebP-Größen in `public/_img/` + `lib/bild-manifest.json` (beide gitignored); Inhalte nutzen `.jpg`-Pfade, Dateien ≤ 5 MB |
| Statistik | Cloudflare Web Analytics ohne Cookies, nur Live (`NEXT_PUBLIC_CF_BEACON_TOKEN`) |
| Weiterleitungen / Header | `public/_redirects` (alte WordPress-URLs, 301), `public/_headers` (Cache-Regeln) |

Entfallen (Phase 1): Netlify, Bunny.net, Umami, Hetzner, Cal.com.

## Struktur

```
app/
  layout.tsx            Kopfzeile, Fußzeile, Handy-Leiste, JSON-LD „Optician“, Web Analytics, noindex auf Testversion
  page.tsx              Startseite
  sehhilfen/ augengesundheit/ service-preise/ ueber-uns/ holzkern/ termin/ impressum/ datenschutz/
  [seite]/page.tsx      erzeugt Seiten aus content/seiten/*.json (generateStaticParams)
  musterbuch/           versteckte Übersicht aller Bausteine (noindex, nicht in Sitemap)
  sitemap.ts robots.ts not-found.tsx
components/             Seitenteile; components/bausteine/ = Abschnitts-Bausteine des Baukastens
content/                ← hier pflegt Alexander (inkl. content/seiten/)
lib/                    content.ts, oeffnungszeiten.ts, navigation.ts (Menü + Suche), seiten.ts (Laden/Prüfen, reservierte
                        Adressen), bausteine/ (typen.ts = Schema, pruefen.ts, beispiele.ts, musterbuch.ts),
                        image-loader.ts, bild-pfad.ts
worker/                 index.ts (Routing, Env), termin.ts, mail.ts, ereignis.ts
scripts/                bildgroessen.mjs, setup-hooks.mjs
tests/                  Vitest (Seiten, Bausteine, Musterbuch, Weiterleitungen, Termin-Worker, Bildgrößen)
.githooks/pre-commit    blockiert Dateien > 5 MB in public/
.github/workflows/      guard-media-size.yml (main + staging)
.claude/skills/         Befehle für Claude Code (neue-seite, neue-aktion, urlaub-eintragen, foto-tauschen, live-schalten, rueckgaengig)
```

## Zeitabhängige Inhalte

Die Seiten sind statisch. Öffnungsstatus, „heute“-Markierung, Feiertags-Hinweise, Terminvorschläge und Aktionen
werden **im Browser** berechnet (Europe/Berlin). Abgelaufene Aktionen verschwinden so ohne neuen Build.

## Baukasten

12 Bausteine (Schema `lib/bausteine/typen.ts`, Nummern im Musterbuch laut `lib/bausteine/musterbuch.ts`; neue Bausteine nur hinten
anhängen). Adresse `^[a-z0-9-]+$`; reservierte Adressen (app-Ordner, `_redirects`, `public/`-Ordner, `musterbuch`, `api`, `_img`, `images`)
und ungültige Dateien lassen den Build mit deutscher Meldung abbrechen. Höchstens eine `buehne` pro Seite.

## Befehle

```bash
npm install           # installiert auch den Git-Hook
npm run dev           # lokal auf http://localhost:3000 (erzeugt vorher die Bildgrößen)
npm run build         # Bildgrößen + Next-Export nach out/; muss vor jedem Push grün sein
npm run vorschau      # build + wrangler dev: Seite und /api/termin lokal wie im Betrieb
npm test              # Vitest
npm run typecheck     # Seite
npm run typecheck:worker
```

## Betrieb / Einrichtung Cloudflare

Ein Worker-Projekt `weitmarer-brillenstudio`, per Workers Builds mit GitHub verbunden (Build-Befehl `npm run build`,
Deploy `npx wrangler deploy`; Branch `main` = Produktion, andere Branches = Vorschau-Versionen, `preview_urls: true`).
Die Testversion wird erkannt über `WORKERS_CI_BRANCH` (≠ `main` → `NEXT_PUBLIC_IS_STAGING=true`, `noindex`).
Geheimnisse und Variablen im Cloudflare-Dashboard (bzw. `wrangler secret put`), nie in `wrangler.jsonc` oder im Repo.

| Variable / Secret | Live (`main`) | Testversion (`staging`) | Art |
|---|---|---|---|
| `RESEND_API_KEY` | ja | ja | Secret |
| `TERMIN_FROM_EMAIL` | in `wrangler.jsonc` (`vars`) | gleich | Variable |
| `TERMIN_TO_EMAIL` | Postfach des Ladens (sonst Fallback `content/stammdaten.json`) | – | Variable |
| `TERMIN_TO_EMAIL_TEST` | – | **Pflicht**: Test-Postfach (David) | Variable |
| `LIVE_HOST` | `www.weitmarer-brillenstudio.de` | – (muss ≠ Host der Testversion sein) | Variable |
| `TURNSTILE_SECRET_KEY` | ja | ja | Secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ja (Build-Variable) | ja (Build-Variable) | Build-Variable |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | ja (Build-Variable) | – (auf Testversion wird nicht gemessen) | Build-Variable |
| `N8N_WEBHOOK_URL` | leer (Phase 2) | leer | Secret |

`NEXT_PUBLIC_*` werden beim **Build** eingebacken: Nach einer Änderung neu bauen (neuer Commit bzw. „Retry build“).

Voraussetzungen, die man leicht vergisst:

- **Apex-Domain auf www umleiten.** Der Worker erkennt „live“ über genau einen Hostnamen (`LIVE_HOST`). Die Adresse ohne `www`
  muss per Redirect (301) auf `www.weitmarer-brillenstudio.de` zeigen, sonst gelten Anfragen darüber als Testversion
  und gehen ans Test-Postfach statt an den Laden.
- **Turnstile-Schlüssel immer paarweise.** `TURNSTILE_SECRET_KEY` und `NEXT_PUBLIC_TURNSTILE_SITE_KEY` müssen zusammen gesetzt
  sein. Fehlt der Site-Key im Build, sendet das Formular kein Token, und der Worker lehnt jede Anfrage mit 403 ab. Das Secret
  nie ohne Site-Key setzen.
- **Testversion braucht `TERMIN_TO_EMAIL_TEST`.** Ohne die Variable antwortet `/api/termin` auf der Testversion mit 503.
  (Mail an den Laden gibt es dort absichtlich nie.)
- **`.wrangler/` gehört in `.gitignore`** (lokaler wrangler-Zwischenspeicher von `npm run vorschau`); steht dort bereits.
- Testversion schützen: Cloudflare Access (E-Mail-Code für Alexander und David) auf die Vorschau-Adresse legen, damit niemand
  Fremdes sie findet.
- Rückgängig-Machen der Live-Seite: `npx wrangler deployments list` / `npx wrangler rollback <VERSION-ID> --message "…"`
  (Ablauf im Skill `rueckgaengig`; setzt `wrangler login` bzw. einen API-Token voraus).

## Offene Punkte

- [ ] Cloudflare-Konto, Worker-Projekt mit GitHub verbinden, Variablen laut Tabelle setzen, Access für die Testversion
- [ ] Resend-Konto, Domain verifizieren (SPF/DKIM im Cloudflare-DNS)
- [ ] Turnstile-Widget anlegen (Site-Key + Secret)
- [ ] Domain-Umzug (Nameserver) inkl. Sicherung/Übernahme der Mail-Einträge (MX, SPF, DKIM); Apex → www
- [ ] GitHub-Repo auf Alexander übertragen, Cloudflare ↔ GitHub neu verbinden
- [ ] Datenschutzerklärung neu (Entwurf, David gibt frei), Impressum prüfen lassen
- [ ] Platzhalter in eckigen Klammern mit Alexander klären (`grep -rn "\[" content/`)
- [ ] Gesundheitsaussagen (TearStim) rechtlich prüfen
- [ ] RELAX24-Rechner erst nach Bestätigung der Konditionen aktivieren (`content/garantien.json`)
- [ ] Phase 2: n8n (nur `N8N_WEBHOOK_URL` setzen, die Steckdose existiert)
