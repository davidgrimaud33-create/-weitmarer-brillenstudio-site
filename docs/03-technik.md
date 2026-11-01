# Technische Dokumentation

> Aufbau nach dem Vorbild von **mb-barbier-site** (MB Coiffeur Barbier), angepasst:
> nur Deutsch (kein next-intl), kein Decap CMS (Pflege per Vibe-Coding), Staging auf eigenem Branch.
>
> Stand: 1. November 2026

## Stack

| Schicht | Technik |
|---|---|
| Framework | Next.js 16.2 (App Router), React 19.2, TypeScript 5 |
| Styling | Tailwind CSS 4 (Tokens in `app/globals.css`), Schrift Archivo (variabel, Breiten-Achse) |
| Inhalte | JSON in `content/`, typisiert über `lib/content.ts` |
| Hosting | Netlify (zwei Sites: `main` → Production, `staging` → Staging) |
| Bilder | `scripts/optimize-images.mjs` → WebP + `lib/webp-manifest.json`; Auslieferung über Netlify Image CDN, in Production optional über Bunny-Pull-Zone (`IMAGE_CDN_URL`) |
| Formulare | `app/api/termin/route.ts` → Resend (Mail an Laden + Bestätigung an Kunden), Honeypot gegen Spam |
| Statistik | Umami auf Hetzner (Script nur in Production, wenn `NEXT_PUBLIC_UMAMI_*` gesetzt), Ereignis `termin-anfrage` |
| Backend | Hetzner (geplant): Umami, n8n, optional Cal.com |

## Struktur

```
app/
  layout.tsx            Kopfzeile, Fußzeile, Handy-Leiste, JSON-LD „Optician“, Umami, noindex auf Staging
  page.tsx              Startseite
  sehhilfen/            Brillen, Gläser (Glas-Finder), Sonnenbrillen, Kontaktlinsen
  augengesundheit/      Screening, trockene Augen (TearStim), Visualtraining, FAQ
  service-preise/       Garantien, RELAX24, Aktionen, Reparatur
  ueber-uns/            Team, Laden, Marken
  termin/               Terminanfrage in 3 Schritten, Öffnungszeiten, Anfahrt
  impressum/ datenschutz/
  api/termin/route.ts   Mailversand
  sitemap.ts robots.ts not-found.tsx
components/             Kopfzeile (Live-Status, Suche, Mobilmenü), Gestaltung (Hero-Hintergrund,
                        Linsenrahmen, Laufband, CTA), interaktive Teile (Anliegen-Wähler, Glas-Finder,
                        FAQ, Terminassistent, Aktionen, Öffnungszeiten)
content/                ← hier pflegt Alexander
lib/                    content.ts, oeffnungszeiten.ts (Live-Status, Ausnahmen, Aktionsfilter),
                        navigation.ts (Menü + Suchindex), image-loader.ts, image-resolver.ts
scripts/                optimize-images.mjs, setup-hooks.mjs (aus MB Barbier übernommen)
.githooks/pre-commit    blockiert Dateien > 5 MB in public/
.github/workflows/      optimize-images.yml, guard-media-size.yml (main + staging)
```

## Zeitabhängige Inhalte

Die Seiten werden statisch gebaut. Öffnungsstatus, „heute“-Markierung, Feiertags-Hinweise,
Terminvorschläge und Aktionen werden deshalb **im Browser** berechnet (Zeitzone Europe/Berlin).
Abgelaufene Aktionen verschwinden so sofort, ohne neuen Build.

## Alte URLs

`netlify.toml` leitet die WordPress-Adressen (z. B. `/augenvorsorge/`, `/produkte/kontaktlinsen/`)
per 301 auf die neuen Seiten um, damit Google-Rankings erhalten bleiben.

## Befehle

```bash
npm install           # installiert auch den Git-Hook
npm run dev           # lokal auf http://localhost:3000
npm run build         # muss vor jedem Push fehlerfrei laufen
npm run typecheck
node scripts/optimize-images.mjs --all
```

## Offene Punkte

- [ ] Netlify-Sites anlegen (Production + Staging), Variablen setzen
- [ ] Resend-Konto, Domain verifizieren (SPF/DKIM beim DNS-Anbieter)
- [ ] Hetzner-Server aufsetzen (Umami, n8n), danach Umami-Variablen setzen
- [ ] Domain-Umzug inkl. Mail-Einträge (MX) planen
- [ ] Datenschutzerklärung neu erstellen, Impressum prüfen lassen
- [ ] Platzhalter in eckigen Klammern mit Alexander klären (`grep -rn "\[" content/`)
- [ ] Gesundheitsaussagen (TearStim) rechtlich prüfen
- [ ] RELAX24-Rechner erst nach Bestätigung der Konditionen aktivieren (`content/garantien.json`)
