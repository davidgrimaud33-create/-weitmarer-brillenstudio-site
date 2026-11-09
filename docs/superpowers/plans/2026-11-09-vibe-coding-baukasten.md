# Baukasten & Cloudflare-Umzug – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Website des Weitmarer Brillenstudios läuft als statischer Export auf Cloudflare, hat eine Terminanfrage-Funktion mit vorbereiteter n8n-Steckdose und einen Abschnitts-Baukasten, mit dem Alexander per Claude Code neue Seiten aus JSON-Dateien baut.

**Architecture:** Next.js erzeugt mit `output: 'export'` reine Dateien in `out/`. Ein einzelner Cloudflare Worker liefert diese als Static Assets aus und beantwortet nur `/api/*` selbst (Terminanfrage → Resend, optional n8n). Neue Seiten liegen als typgeprüfte JSON-Dateien in `content/seiten/` und werden über eine dynamische Route aus Baustein-Komponenten zusammengesetzt.

**Tech Stack:** Next.js 16 (≥ 16.4.5), React 19, Tailwind 4, TypeScript 5, Cloudflare Workers (Static Assets, Workers Builds, Access, Turnstile, Web Analytics), Wrangler, Resend REST-API, Vitest, sharp.

**Spec:** `docs/superpowers/specs/2026-11-09-vibe-coding-baukasten-design.md`

## Global Constraints

- Vor jedem Next.js-Code: passende Anleitung in `node_modules/next/dist/docs/` lesen (siehe `AGENTS.md`) – diese Next.js-Version weicht vom Trainingsstand ab.
- Next.js mindestens **16.4.5** (Sicherheitsfix CVE-2026-94545).
- Keine Datenbank, kein CMS, kein Netlify, kein Bunny, kein Umami, kein Cal.com.
- Arbeitsbranch: `umbau-cloudflare`, abgezweigt von `david-entwicklung`. Am Ende Merge in `staging`. **Nie** auf `main` pushen, nie `--force`.
- Texte, Fehlermeldungen und Commit-Nachrichten auf Deutsch; Fehlermeldungen für Alexander in einfachen Sätzen mit Dateiname.
- Keine Preise, Namen, Daten oder Rechtsaussagen erfinden – Platzhalter in eckigen Klammern.
- Bestehende Seiten (`app/<seite>/page.tsx`) bleiben inhaltlich unverändert.
- Alle 13 bestehenden 301-Weiterleitungen aus `netlify.toml` bleiben 1:1 erhalten.
- Terminanfrage: Mail an den Laden wird **immer** versucht; n8n-Fehler dürfen sie nie verhindern.
- `npm run build` und `npm test` müssen nach jedem Task fehlerfrei laufen.
- Jeder Commit endet mit `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Seitenadresse kollidiert mit bestehender Seite** (z. B. `content/seiten/termin.json`) → Build bricht mit verständlicher Meldung ab, statt still eine Seite zu überschreiben. Test in Task 5.
2. **Kaputtes JSON / fehlendes Pflichtfeld in einer Seiten-Datei** → Build-Fehler mit Dateiname und Feldname, kein leerer Abschnitt live. Test in Task 5.
3. **n8n-Webhook langsam oder nicht erreichbar** → Anfrage wird trotzdem per Mail zugestellt, Antwort `ok: true` spätestens nach ~3 s Webhook-Timeout. Test in Task 3.
4. **Terminanfrage auf der Testversion** → Mail geht an das Test-Postfach, nie an den Laden. Test in Task 3.
5. **Neues Foto mit gleichem Dateinamen ersetzt altes** → Browser/CDN zeigt das neue Foto (Dateiname der erzeugten Größen enthält Inhalts-Hash). Test in Task 2.

---

### Task 0: Branch, Next.js-Update, Testumgebung

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `vitest.config.ts`, `tests/smoke.test.ts`

**Interfaces:**
- Produces: `npm test` (Vitest, Umgebung `node`, Alias `@/` → Projektwurzel).

- [ ] **Step 1:** `git checkout david-entwicklung && git checkout -b umbau-cloudflare`
- [ ] **Step 2:** `npm install next@^16.4.5 react@latest react-dom@latest` und `npm install -D vitest`. Prüfen: `npx next --version` ≥ 16.4.5.
- [ ] **Step 3:** `vitest.config.ts` mit Alias `@` → `.` und `include: ['tests/**/*.test.ts']`; Script `"test": "vitest run"` in `package.json`.
- [ ] **Step 4:** `tests/smoke.test.ts`: `expect(1 + 1).toBe(2)`. Run: `npm test` → PASS.
- [ ] **Step 5:** `npm run build` → erfolgreich (noch mit Netlify-Konfiguration).
- [ ] **Step 6:** Commit `chore: Next.js auf gepatchte Version, Vitest eingerichtet`.

---

### Task 1: Statischer Export, Weiterleitungen, Staging-Erkennung

**Files:**
- Modify: `next.config.ts`, `lib/feature-flags.ts`, `app/sitemap.ts`, `app/robots.ts`
- Create: `public/_redirects`, `public/_headers`, `tests/redirects.test.ts`
- Delete: `netlify.toml`, `app/api/termin/route.ts` (Route-Handler mit `force-dynamic` sind im Export nicht erlaubt; Neuaufbau als Worker in Task 3 – das Formular ist bis dahin auf diesem Branch funktionslos)

**Interfaces:**
- Produces: `isStaging: boolean`, `SITE_URL: string` aus `lib/feature-flags.ts` (Namen bleiben). Build-Ausgabe in `out/`.

- [ ] **Step 1: Failing test** `tests/redirects.test.ts`: liest `public/_redirects` und prüft für jede der 13 Zeilen aus `netlify.toml` (`/angebote/*`→`/service-preise#aktionen`, `/relax24/`→`/service-preise#relax24`, `/augenvorsorge/`→`/augengesundheit#screening`, `/leistungen/was-hilft-bei-trockenen-augen/`→`/augengesundheit#trocken`, `/leistungen/`→`/service-preise`, `/produkte/kontaktlinsen/`→`/sehhilfen#linsen`, `/produkte/glaeser/`→`/sehhilfen#glaeser`, `/produkte/holzkern/`→`/holzkern`, `/produkte/*`→`/sehhilfen`, `/ueber-uns/*`→`/ueber-uns`, `/kontakt/`→`/termin`, `/datenschutzerklaerung/`→`/datenschutz`), dass eine Zeile `<von> <nach> 301` existiert, und dass spezifische Regeln vor den Wildcards `/produkte/*` stehen. Run `npm test` → FAIL (Datei fehlt).
- [ ] **Step 2:** `public/_redirects` im Cloudflare-Format anlegen. **Achtung:** `/ueber-uns/*` → `/ueber-uns` darf `/ueber-uns` selbst nicht in eine Schleife schicken – prüfen, dass `/ueber-uns/` (mit Schrägstrich) korrekt ausgeliefert wird; ggf. Regel auf `/ueber-uns/:sub/*` o. ä. einschränken und im Test anpassen. Run `npm test` → PASS.
- [ ] **Step 3:** `public/_headers`: `/images/*` → `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`; `/_img/*` → `Cache-Control: public, max-age=31536000, immutable`.
- [ ] **Step 4:** `next.config.ts`: `output: 'export'`; `headers()` und alle Netlify-Variablen (`CONTEXT`, `NETLIFY`, `COMMIT_REF`, `IMAGE_CDN_URL`) entfernen; `env.NEXT_PUBLIC_IS_STAGING` = `'true'`, wenn `process.env.WORKERS_CI_BRANCH` gesetzt und ≠ `main`, sonst Wert von `process.env.NEXT_PUBLIC_IS_STAGING` (Variablenname in Cloudflare-Doku „Workers Builds – build environment variables“ verifizieren). `images` bleibt vorerst wie es ist (Task 2).
- [ ] **Step 5:** `app/sitemap.ts` und `app/robots.ts` mit `export const dynamic = 'force-static'`; in `robots.ts` `disallow: ['/api/', '/musterbuch']`.
- [ ] **Step 6:** `netlify.toml` und `app/api/` löschen. `npm run build` → `out/` enthält `index.html`, die Seiten als HTML, `sitemap.xml`, `robots.txt`, `_redirects`, `_headers`.
- [ ] **Step 7:** Commit `feat: statischer Export, Weiterleitungen für Cloudflare`.

---

### Task 2: Bildgrößen beim Build

Ersetzt Netlify Image CDN und die WebP-Pipeline (GitHub Action + Manifest).

**Files:**
- Create: `scripts/bildgroessen.mjs`, `lib/bild-pfad.ts`, `tests/bildgroessen.test.ts`
- Modify: `lib/image-loader.ts`, `components/Gestaltung.tsx`, `components/AnliegenWaehler.tsx`, `package.json` (`build`-Script), `.gitignore`
- Delete: `lib/image-resolver.ts`, `lib/webp-manifest.json`, `scripts/optimize-images.mjs`, `.github/workflows/optimize-images.yml`, alle `public/images/**/*.webp`

**Interfaces:**
- Produces: `BREITEN = [640, 1080, 1920] as const`; `bildPfad(src: string, breite: number, manifest: BildManifest): string` in `lib/bild-pfad.ts`; `type BildManifest = Record<string, Record<number, string>>` (Originalpfad → Breite → Ausgabepfad). Generiertes Manifest: `lib/bild-manifest.json` (gitignored). Ausgabe: `public/_img/<pfad-ohne-endung>-<breite>.<hash8>.webp` (gitignored).

- [ ] **Step 1: Failing test** `tests/bildgroessen.test.ts`:
  - `bildPfad('/images/team/a.jpg', 700, m)` liefert den Eintrag für 1080 (nächstgrößere Breite); bei 2400 → 1920; bei 300 → 640.
  - Unbekannter `src` → `src` unverändert.
  - Skript-Test: zwei temporäre JPGs mit gleichem Namen, aber anderem Inhalt nacheinander durch die exportierte Funktion `erzeugeGroessen(eingabeDatei, ausgabeOrdner)` → unterschiedliche Hash-Teile im Dateinamen (Review Focus 5).
  Run → FAIL.
- [ ] **Step 2:** `scripts/bildgroessen.mjs`: für jedes `public/images/**/*.{jpg,jpeg,png}` je Breite aus `BREITEN` (nicht hochskalieren) WebP mit sharp erzeugen, Hash = erste 8 Zeichen SHA-256 des Quellinhalts; überspringen, wenn Zieldatei existiert; Manifest schreiben; alte Dateien in `public/_img/` löschen, die nicht mehr im Manifest stehen. `erzeugeGroessen` exportieren; bei direktem Aufruf alle Bilder verarbeiten.
- [ ] **Step 3:** `lib/bild-pfad.ts` implementieren; `lib/image-loader.ts` nutzt `bildPfad` mit importiertem `bild-manifest.json`. `Gestaltung.tsx`/`AnliegenWaehler.tsx`: `resolveImage` entfernen, `src` direkt übergeben.
- [ ] **Step 4:** `package.json`: `"build": "node scripts/bildgroessen.mjs && next build"`; `.gitignore`: `public/_img/`, `lib/bild-manifest.json`. Alte WebP-Dateien und Pipeline löschen; `guard-media-size.yml` und Pre-Commit-Hook bleiben.
- [ ] **Step 5:** `npm test` → PASS; `npm run build` → PASS; in `out/` Stichprobe einer Seite: `<img srcset>` zeigt auf `/_img/...webp`.
- [ ] **Step 6:** Commit `feat: Bildgrößen beim Build statt Netlify Image CDN`.

---

### Task 3: Cloudflare Worker mit Terminanfrage und n8n-Steckdose

**Files:**
- Create: `wrangler.jsonc`, `worker/index.ts`, `worker/termin.ts`, `worker/mail.ts`, `worker/ereignis.ts`, `worker/tsconfig.json`, `tests/termin.test.ts`
- Modify: `components/TerminAssistent.tsx`, `tsconfig.json` (`worker` ausschließen), `package.json` (`vorschau`-Script, Dev-Deps `wrangler`, `@cloudflare/workers-types`)
- Delete: Abhängigkeit `resend`

**Interfaces:**
- Consumes: `content/stammdaten.json`.
- Produces:
  - `type Env = { ASSETS: Fetcher; RESEND_API_KEY?: string; TERMIN_TO_EMAIL?: string; TERMIN_TO_EMAIL_TEST?: string; TERMIN_FROM_EMAIL?: string; LIVE_HOST?: string; TURNSTILE_SECRET_KEY?: string; N8N_WEBHOOK_URL?: string }`
  - `handleTermin(req: Request, env: Env, ctx: ExecutionContext): Promise<Response>` in `worker/termin.ts`
  - `sendeMail(env: Env, mail: { from: string; to: string; replyTo?: string; subject: string; html: string }): Promise<{ ok: boolean }>` in `worker/mail.ts` (Resend REST `POST https://api.resend.com/emails`, kein SDK)
  - `type Ereignis = { typ: 'termin-anfrage' | 'kontakt'; zeitpunkt: string; quelle: 'live' | 'test'; daten: Record<string, string> }`; `sendeEreignis(env: Env, e: Ereignis): Promise<void>` in `worker/ereignis.ts` (Timeout 3000 ms, schluckt alle Fehler)
  - Client sendet zusätzlich Feld `turnstileToken: string`.

- [ ] **Step 1: Failing tests** `tests/termin.test.ts` (globales `fetch` per `vi.stubGlobal` gemockt, `ctx.waitUntil` als Spy):
  - Honeypot `website` gefüllt → 200 `{ ok: true }`, kein `fetch`-Aufruf.
  - Name < 2 Zeichen oder weder Telefon noch E-Mail oder keine Einwilligung → 422.
  - `TURNSTILE_SECRET_KEY` gesetzt und Siteverify antwortet `success:false` → 403; ohne Secret → keine Prüfung.
  - Host ≠ `LIVE_HOST` → Laden-Mail an `TERMIN_TO_EMAIL_TEST`; Host = `LIVE_HOST` → an `TERMIN_TO_EMAIL` (Review Focus 4). `LIVE_HOST` nicht gesetzt → immer Test.
  - Mit E-Mail des Kunden → zweite Mail (Bestätigung) an diese Adresse.
  - Laden-Mail schlägt fehl → 502.
  - `N8N_WEBHOOK_URL` gesetzt, Webhook-`fetch` wirft oder hängt → Antwort trotzdem 200, Laden-Mail wurde gesendet, Ereignis über `ctx.waitUntil` angestoßen mit `typ: 'termin-anfrage'` und `quelle` passend zum Host (Review Focus 3).
  - Ohne `N8N_WEBHOOK_URL` → kein Webhook-Aufruf.
  - Ohne `RESEND_API_KEY` → 503.
  Run → FAIL.
- [ ] **Step 2:** `worker/mail.ts`, `worker/ereignis.ts`, `worker/termin.ts` implementieren. Validierung, Längenbegrenzungen, HTML-Escaping und Mail-Vorlagen (`rahmen`, `zeile`) unverändert aus der bisherigen Route übernehmen (`git show david-entwicklung:app/api/termin/route.ts`).
- [ ] **Step 3:** `worker/index.ts`: `POST /api/termin` → `handleTermin`; andere `/api/*` → 404; alles andere → `env.ASSETS.fetch(req)`.
- [ ] **Step 4:** `wrangler.jsonc`: `name: "weitmarer-brillenstudio"`, `main: "worker/index.ts"`, aktuelles `compatibility_date`, `assets: { directory: "./out", binding: "ASSETS", not_found_handling: "404-page", run_worker_first: ["/api/*"] }`, `preview_urls: true`, `vars: { TERMIN_FROM_EMAIL: "Weitmarer Brillenstudio <termin@weitmarer-brillenstudio.de>" }`. Secrets nicht in die Datei. Vor dem Schreiben aktuelle Cloudflare-Doku zu Workers Static Assets prüfen.
- [ ] **Step 5:** `TerminAssistent.tsx`: Turnstile-Widget (Script `https://challenges.cloudflare.com/turnstile/v0/api.js`, Site-Key aus `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; ohne Key kein Widget) im Kontaktschritt, Token mitsenden; `trackEvent`-Aufruf entfernen.
- [ ] **Step 6:** `resend` deinstallieren; Script `"vorschau": "npm run build && wrangler dev"`.
- [ ] **Step 7:** `npm test` → PASS; `npm run build` → PASS; `npm run vorschau` → Startseite lädt, `/sehhilfen` lädt, `/kontakt/` leitet auf `/termin` weiter, `curl -X POST localhost:8787/api/termin -d '{}'` → 422.
- [ ] **Step 8:** Commit `feat: Terminanfrage als Cloudflare-Funktion mit Turnstile und n8n-Steckdose`.

---

### Task 4: Statistik umstellen

**Files:**
- Modify: `app/layout.tsx`
- Delete: `lib/analytics.ts`

- [ ] **Step 1:** In `layout.tsx` Umami-Script ersetzen durch Cloudflare-Web-Analytics-Beacon (`https://static.cloudflareinsights.com/beacon.min.js`, `data-cf-beacon='{"token":"…"}'` aus `NEXT_PUBLIC_CF_BEACON_TOKEN`), nur wenn `!isStaging` und Token gesetzt.
- [ ] **Step 2:** `lib/analytics.ts` löschen; `grep -rn "analytics\|umami" app components lib` → keine Treffer.
- [ ] **Step 3:** `npm run build` → PASS. Commit `feat: Cloudflare Web Analytics statt Umami`.

---

### Task 5: Baustein-Schema und Seiten-Laden

**Files:**
- Create: `lib/bausteine/typen.ts`, `lib/bausteine/pruefen.ts`, `lib/bausteine/beispiele.ts`, `lib/seiten.ts`, `content/seiten/.gitkeep`, `tests/seiten.test.ts`

**Interfaces:**
- Produces:
  - `type Baustein =` Union mit Feld `typ`:
    - `'buehne'` `{ titel; unterzeile?; bild?; knopf?: Knopf }`
    - `'text'` `{ titel?; text }` (Absätze durch Leerzeile)
    - `'text-bild'` `{ titel?; text; bild; bildAlt; bildSeite: 'links' | 'rechts' }`
    - `'karten'` `{ titel?; karten: { titel; text; bild?; link?: string }[] }` (2–4 Karten)
    - `'galerie'` `{ titel?; bilder: { src; alt }[] }` (≥ 2)
    - `'zitat'` `{ text; name? }`
    - `'faq'` `{ titel?; eintraege: { frage; antwort }[] }`
    - `'hinweis'` `{ text }`
    - `'aufforderung'` `{ titel; text?; knopf: Knopf }`
    - `'marken'` `{ titel? }`
    - `'oeffnungszeiten'` `{ titel? }`
    - `'aktionen'` `{ titel? }`
    - mit `type Knopf = { text: string; link: string }`; alle Textfelder `string`.
  - `type Seite = { adresse: string; titel: string; beschreibung: string; menue: 'haupt' | 'fusszeile' | 'versteckt'; stichworte: string; bausteine: Baustein[] }`
  - `pruefeSeite(daten: unknown, datei: string): Seite` – wirft `Error` mit deutscher Meldung, die `datei`, Baustein-Nummer (1-basiert) und Feldnamen nennt.
  - `RESERVIERTE_ADRESSEN: string[]` = alle Ordner unter `app/` plus `musterbuch`, `api`, `_img`, `images`.
  - `ladeSeiten(ordner = 'content/seiten'): Seite[]` – liest alle `*.json`, `adresse` = Dateiname ohne Endung, prüft Kollision mit `RESERVIERTE_ADRESSEN` und Format `^[a-z0-9-]+$`.
  - `BEISPIELE: Record<Baustein['typ'], Baustein>` – je ein gültiges Beispiel (für Musterbuch und Tests).

- [ ] **Step 1: Failing tests** `tests/seiten.test.ts`:
  - Jedes Element von `BEISPIELE` in eine Seite gepackt → `pruefeSeite` gibt es unverändert zurück.
  - Unbekannter `typ: 'slider'` → Fehler enthält `"slider"` und `"Baustein 1"`.
  - `text-bild` ohne `bildAlt` → Fehler enthält Dateiname und `"bildAlt"` (Review Focus 2).
  - `karten` mit 5 Karten → Fehler.
  - `menue: 'oben'` → Fehler.
  - Temporärer Ordner mit `termin.json` → `ladeSeiten` wirft, Meldung enthält `"termin"` und `"bereits"` (Review Focus 1).
  - Dateiname `Neue Seite.json` → Fehler zum Dateinamen.
  - Ungültiges JSON → Fehler nennt Dateiname.
  Run → FAIL.
- [ ] **Step 2:** Typen, `pruefeSeite`, `ladeSeiten`, `BEISPIELE` implementieren (ohne neue Abhängigkeit; Beispieltexte neutral, keine erfundenen Preise).
- [ ] **Step 3:** `npm test` → PASS. Commit `feat: Baustein-Schema und Prüfung der Seitendateien`.

---

### Task 6: Baustein-Komponenten und Musterbuch

**Files:**
- Create: `components/bausteine/<Typ>.tsx` je Baustein, `components/bausteine/BausteinListe.tsx`, `app/musterbuch/page.tsx`

**Interfaces:**
- Consumes: `Baustein`, `BEISPIELE` (Task 5); vorhandene `Bild`, `HeroGrund`, `CtaBand` (`components/Gestaltung.tsx`), `Faq`, `Oeffnungszeiten`, `Aktionen`, Marken-Darstellung aus `app/ueber-uns/page.tsx`.
- Produces: `BausteinListe({ bausteine }: { bausteine: Baustein[] })` – rendert in Reihenfolge; `switch` über `typ` mit Exhaustiveness-Check.

- [ ] **Step 1:** Je Baustein eine Komponente im bestehenden Design (Tokens aus `app/globals.css`, Abstände und Typografie wie auf den bestehenden Seiten). Bestehende Komponenten wiederverwenden statt nachbauen; `Faq`/`Oeffnungszeiten`/`Aktionen`/Marken nur einbetten.
- [ ] **Step 2:** `app/musterbuch/page.tsx`: `metadata.robots = { index: false, follow: false }`; zeigt jeden Baustein aus `BEISPIELE` mit Überschrift „Baustein N – <Name>“ in fester Reihenfolge (Reihenfolge der Union in Task 5).
- [ ] **Step 3:** `npm run build` → PASS; `npm run vorschau` → `/musterbuch` zeigt alle 12 Bausteine, auf Handybreite (375 px) ohne horizontales Scrollen.
- [ ] **Step 4:** Commit `feat: Baustein-Komponenten und Musterbuch`.

---

### Task 7: Seiten aus `content/seiten/` – Route, Menü, Suche, Sitemap

**Files:**
- Create: `app/[seite]/page.tsx`, `tests/navigation.test.ts`
- Modify: `lib/navigation.ts`, `app/sitemap.ts`, `components/Kopfzeile.tsx`, `components/Fusszeile.tsx`, `components/Suche.tsx`

**Interfaces:**
- Consumes: `ladeSeiten`, `BausteinListe`.
- Produces: `hauptmenue(seiten: Seite[]): {href; label}[]`, `fusszeilenLinks(seiten: Seite[])`, `suchindex(seiten: Seite[])`, `sitemapEintraege(seiten: Seite[]): string[]` (Adressen) in `lib/navigation.ts` (bisherige Konstanten bleiben als Basis; Seiten werden angehängt; `versteckt` nirgends).

- [ ] **Step 1: Failing test** `tests/navigation.test.ts`: Seite mit `menue: 'haupt'` erscheint in `hauptmenue` nach den vier festen Einträgen, nicht in `fusszeilenLinks`; `fusszeile` umgekehrt; `versteckt` in keinem Menü, nicht im Suchindex und nicht in der Sitemap (`sitemapEintraege(seiten)` ebenfalls in `lib/navigation.ts`). Alle nicht-versteckten Seiten im Suchindex mit ihren `stichworte`. Run → FAIL.
- [ ] **Step 2:** Funktionen implementieren; Kopfzeile, Fußzeile, Suche und `sitemap.ts` verwenden sie mit `ladeSeiten()` (Aufruf nur in Server-Komponenten; an Client-Komponenten als Props übergeben).
- [ ] **Step 3:** `app/[seite]/page.tsx`: `generateStaticParams` aus `ladeSeiten()`, `dynamicParams = false`, `generateMetadata` mit `titel`/`beschreibung` (bei `versteckt` zusätzlich `noindex`), Seite = `BausteinListe`. Ohne Seiten-Dateien muss der Build trotzdem laufen (leere Params – in der Next-Doku zu `output: 'export'` prüfen; falls leere Liste nicht erlaubt ist, eine Lösung wählen, die keine sichtbare Seite erzeugt).
- [ ] **Step 4:** Prüfen mit `content/seiten/beispiel-seite.json` (alle 12 Bausteine, `menue: 'haupt'`): `npm run build` → `out/beispiel-seite.html` existiert, Menüeintrag sichtbar, `sitemap.xml` enthält die Adresse. Datei danach löschen, Build erneut grün.
- [ ] **Step 5:** `npm test` → PASS. Commit `feat: neue Seiten aus content/seiten mit Menü, Suche und Sitemap`.

---

### Task 8: Cloudflare-Projekt einrichten (unter Davids Konto) – **Haltepunkt**

Teilweise Klickarbeit im Dashboard. Der ausführende Agent bereitet vor und fragt David nach jedem Dashboard-Schritt.

**Files:**
- Create: `docs/03-technik.md` (Abschnitt „Cloudflare“ neu, siehe Task 9)

- [ ] **Step 1:** David: in Cloudflare (Davids Konto) Worker-Projekt aus GitHub-Repo anlegen (Workers Builds): Build-Command `npm run build`, Deploy `npx wrangler deploy` für `main`, Branch-Uploads (`npx wrangler versions upload`) für andere Branches.
- [ ] **Step 2:** Secrets/Variablen setzen: `RESEND_API_KEY`, `TERMIN_TO_EMAIL`, `TERMIN_TO_EMAIL_TEST` (Davids Test-Postfach), `TURNSTILE_SECRET_KEY`; Build-Variablen `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_CF_BEACON_TOKEN`, `SITE_URL`. `LIVE_HOST` erst beim Domain-Umzug (Task 11).
- [ ] **Step 3:** Cloudflare Access für Preview-URLs aktivieren (E-Mail-Code; erlaubt: David, Alexander).
- [ ] **Step 4:** `umbau-cloudflare` nach `staging` mergen und pushen → Preview-URL von `staging` öffnet erst nach Access-Login; Seite und Weiterleitungen funktionieren; Testanfrage kommt im Test-Postfach an (Laden-Mail **nicht** im Laden-Postfach). `curl -I <preview-url>` ohne Login → Access-Anmeldung, kein Inhalt.
- [ ] **Step 5:** Kein Push auf `main` in diesem Task. Den echten Rollback-Test macht Task 11, Punkt 7, nach Davids Freigabe des ersten Live-Gangs.

---

### Task 9: Befehle für Claude Code, Regeln und Anleitungen

**Files:**
- Create: `.claude/skills/neue-seite/SKILL.md`, `.claude/skills/neue-aktion/SKILL.md`, `.claude/skills/urlaub-eintragen/SKILL.md`, `.claude/skills/foto-tauschen/SKILL.md`, `.claude/skills/live-schalten/SKILL.md`, `.claude/skills/rueckgaengig/SKILL.md`, `docs/05-beispielsaetze.md`
- Modify: `CLAUDE.md`, `docs/01-zugaenge.md`, `docs/02-pflege-per-vibe-coding.md`, `docs/03-technik.md`, `README.md`

- [ ] **Step 1:** Skills (jeweils `name`, `description` in Alexanders Worten, damit sie auf natürliche Sätze anspringen), Kern-Inhalt:
  - `neue-seite`: Musterbuch-Nummern erfragen, `content/seiten/<adresse>.json` nach Schema aus `lib/bausteine/typen.ts` anlegen, fehlende Fakten erfragen, `npm run build`, Ablauf staging.
  - `neue-aktion`, `urlaub-eintragen`, `foto-tauschen`: wie in `CLAUDE.md` „Wo steht was?“.
  - `live-schalten`: nur nach wörtlicher Freigabe; Merge `staging`→`main`, Push, Rückmeldung mit Live-Adresse.
  - `rueckgaengig`: (1) `npx wrangler rollback` mit Bestätigung des Zielstands, (2) fehlerhafte Commits auf `staging` per `git revert` (nicht den Merge-Commit), Build, Push; Alexander erklären, dass der Fehler erst mit dem nächsten Live-Gang auch aus `main` verschwindet.
- [ ] **Step 2:** `CLAUDE.md`: Netlify → Cloudflare (Testversion = Preview-URL hinter Login); Tabelle um `content/seiten/` ergänzen; Regel „Neue Seiten nur aus Bausteinen, fehlt einer → David fragen“; „Nicht ohne David“-Liste: `next.config.ts`, `wrangler.jsonc`, `public/_headers`, `public/_redirects`, `worker/`, `package.json`, `.github/`, `lib/`, `scripts/`, Impressum, Datenschutz, Gesundheitsaussagen, neue Dienste/Kosten; Bunny-Hinweis bei Videos entfernen („Videos: David fragen“); Bilder-Abschnitt an Task 2 anpassen.
- [ ] **Step 3:** `docs/02-…` um „Neue Seite bauen“, „Musterbuch“, „Notfallknopf“ ergänzen; `docs/05-beispielsaetze.md` mit 12–15 Sätzen; `docs/01-zugaenge.md` auf GitHub/Cloudflare/Resend/Alfahosting (Registrar + Postfach) umschreiben; `docs/03-technik.md` Stack, Struktur, Befehle, offene Punkte aktualisieren.
- [ ] **Step 4:** Probe: frische Claude-Code-Sitzung im Repo, Satz „Ich möchte eine neue Seite für unsere Sportbrillen, mit Bühne, Text mit Bild und Termin-Aufforderung“ → Skill springt an, legt gültige Datei an, Build grün. Datei danach verwerfen.
- [ ] **Step 5:** Commit `docs: Befehle, Regeln und Anleitungen für Cloudflare und Baukasten`.

---

### Task 10: Datenschutzerklärung – Entwurf – **Haltepunkt (Freigabe David)**

**Files:**
- Modify: `app/datenschutz/page.tsx`, ggf. `app/impressum/page.tsx` (nur Hinweise, keine Änderung ohne Freigabe)

- [ ] **Step 1:** Entwurf schreiben, der abdeckt: Verantwortlicher (aus `content/stammdaten.json`), Hosting/CDN Cloudflare (inkl. Drittlandübermittlung USA, Data Privacy Framework), Server-Logs, Cloudflare Turnstile, Cloudflare Web Analytics (ohne Cookies), Terminformular (Zweck, Rechtsgrundlage, Einwilligung, Speicherdauer), Resend als Auftragsverarbeiter, E-Mail-Kontakt, Rechte der Betroffenen, Aufsichtsbehörde NRW. Nicht genannte Fakten als `[PLATZHALTER]`. Oben sichtbar: „Entwurf – nicht freigegeben“.
- [ ] **Step 2:** Impressum gegen Pflichtangaben prüfen, fehlende Punkte als Liste an David (nicht ändern).
- [ ] **Step 3:** Commit auf `umbau-cloudflare`, Merge nach `staging`, **David um Freigabe bitten und warten**. Nach Freigabe Entwurfs-Hinweis entfernen, Commit `docs: Datenschutzerklärung freigegeben`.

---

### Task 11: Übergabe-Checkliste (Ausführung durch David mit Alexander)

**Files:**
- Create: `docs/04-uebergabe-checkliste.md`

- [ ] **Step 1:** Checkliste schreiben, Reihenfolge mit Haltepunkten:
  1. Voraussetzung: Task 10 freigegeben.
  2. Bei Alfahosting: Postfach-Ort und Erlaubnis für Nameserver-Wechsel klären; **alle** DNS-Einträge exportieren (MX, SPF, DKIM, sonstige TXT).
  3. Cloudflare-Konto auf Alexander; David als Administrator einladen.
  4. GitHub-Repo auf Alexanders Konto übertragen, David Admin; Remote auf Davids Rechner anpassen; Worker-Projekt im Konto von Alexander neu mit dem Repo verbinden, Secrets/Variablen neu setzen, Access neu einrichten.
  5. Zone `weitmarer-brillenstudio.de` in Alexanders Cloudflare anlegen, DNS-Einträge 1:1 übernehmen, Resend-Domain verifizieren; Nameserver bei Alfahosting umstellen; Mail-Empfang und -Versand testen (`dig MX`, Testmail an `info@`).
  6. Custom Domains `www.` und Apex am Worker; Weiterleitung Apex → `www`; `LIVE_HOST=www.weitmarer-brillenstudio.de` setzen; `workers.dev`-Adresse für Production abschalten.
  7. Erster Live-Gang nach Davids Freigabe; Rollback einmal echt testen und zurückrollen.
  8. Netlify-Site `wbs-staging` löschen; Netlify aus `docs/01-zugaenge.md` streichen.
  9. Alexanders Rechner: Claude Code, Git + SSH-Schlüssel/`gh auth login`, Repo klonen, `npm install`, `npx wrangler login`, Testsatz „Was steht gerade bei den Öffnungszeiten?“.
- [ ] **Step 2:** Commit `docs: Übergabe-Checkliste`.
