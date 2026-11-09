@AGENTS.md

# Weitmarer Brillenstudio – Regeln für Änderungen per Claude Code

Diese Website gehört dem Weitmarer Brillenstudio (Inhaber Alexander Jäh, Bochum).
Alexander pflegt sie selbst per Vibe-Coding. Betreut wird sie von David Grimaud (DeepMetis).
Sprich mit Alexander auf Deutsch, in einfachen, ausformulierten Sätzen, ohne Fachkürzel.

## Fertige Befehle (Skills in `.claude/skills/`)

Für die häufigen Aufgaben gibt es Schritt-für-Schritt-Befehle. Nutze sie, sobald Alexanders Satz passt:
`neue-seite`, `neue-aktion`, `urlaub-eintragen`, `foto-tauschen`, `live-schalten`, `rueckgaengig`.

## Der wichtigste Ablauf: erst Staging, dann live

1. Jede Änderung passiert auf dem Branch **`staging`** – nie direkt auf `main`.
   Vor dem Arbeiten: `git checkout staging && git pull`.
2. Änderung machen, dann `npm run build` – muss ohne Fehler durchlaufen.
3. Commit mit verständlicher deutscher Nachricht und `git push`.
   Cloudflare baut daraufhin die **Testversion** neu (1–2 Minuten). Sie liegt unter `[STAGING-URL]`
   und ist durch einen Login (Cloudflare Access) geschützt. Alexander prüft dort, am besten auch am Handy.
4. Erst wenn Alexander ausdrücklich sagt „passt, live schalten“ (oder etwas klar Gleichbedeutendes):
   `git checkout main && git pull && git merge staging && git push` → die Live-Seite (`[LIVE-URL]`)
   wird neu gebaut. Genauer Ablauf: Befehl `live-schalten`.
5. Danach zurück auf `staging` wechseln.

Niemals ohne ausdrückliche Freigabe auf `main` pushen. Niemals `git push --force`.

Die Terminanfrage auf der Testversion geht an ein Test-Postfach, nie an den Laden. Alexander sollte sie
dort ruhig ausprobieren.

## Wenn etwas schiefgeht

„Mach die letzte Änderung rückgängig“ → Befehl `rueckgaengig`: erst die Live-Seite per Rollback auf die
vorherige Version zurücksetzen (Alexander vorher den Zielstand zeigen und bestätigen lassen), dann die
fehlerhaften Commits auf `staging` per `git revert` zurücknehmen (nie den Merge-Commit). Bei Fehlern nur
auf der Testversion genügt der Git-Teil.

## Wo steht was? (Inhalte ändern = fast immer nur JSON)

| Was Alexander ändern will | Datei |
|---|---|
| Neue Seite (aus Bausteinen) | `content/seiten/<adresse>.json` (Befehl `neue-seite`) |
| Öffnungszeiten, Feiertage, Urlaub | `content/oeffnungszeiten.json` → `regulaer` bzw. `ausnahmen` |
| Aktionen / Angebote | `content/aktionen.json` (Start- und Enddatum, verschwinden automatisch) |
| Team, Fotos, Schwerpunkte | `content/team.json` + Fotos in `public/images/team/` |
| Marken | `content/marken.json` |
| Garantien, RELAX24 | `content/garantien.json` |
| Startseite (Hero-Text, Hero-Bild, Zitat, Bewertungen, Anliegen) | `content/startseite.json` |
| Augenscreening, Visualtraining, FAQ | `content/augengesundheit.json` |
| Adresse, Telefon, E-Mail, Parkhinweis | `content/stammdaten.json` |
| Holzkern-Uhren (Texte, Fotos) und Irisfotografie (Link, Text) | `content/besonderes.json` + Fotos in `public/images/holzkern/` |
| Texte, die nicht in JSON stehen | in `app/<seite>/page.tsx` (vorsichtig, nur Text ändern) |

Regeln für JSON: Anführungszeichen und Kommas nicht kaputt machen. Datumsformat immer `JJJJ-MM-TT`,
Uhrzeiten immer `HH:MM`. Nach jeder JSON-Änderung `npm run build` – ein Tippfehler fällt dort auf
(der Fehler nennt Dateiname und Feld).

## Neue Seiten: nur aus Bausteinen

- Neue Seiten entstehen **nur** als `content/seiten/<adresse>.json` aus den fertigen Bausteinen
  (Schema: `lib/bausteine/typen.ts`, Beispiele: `lib/bausteine/beispiele.ts`).
- Das **Musterbuch** unter `/musterbuch` (versteckt, nicht in Google) zeigt jeden Baustein mit Nummer und Name.
  Die Reihenfolge steht in `lib/bausteine/musterbuch.ts`; Alexander darf sagen „wie Baustein 1, 3 und 9“.
- **Fehlt ein passender Baustein: David fragen.** Keinen eigenen Design-Code, keine neue
  `app/<seite>/page.tsx` und keine neuen Komponenten schreiben.
- Adresse der Seite: nur Kleinbuchstaben, Ziffern, Bindestriche. Bestehende Adressen (Seiten, alte
  Weiterleitungen) sind gesperrt, der Build meldet das. Pro Seite höchstens eine Bühne.
- Menü, Suche und Sitemap übernehmen neue Seiten automatisch (Einstellung `menue`: `haupt`,
  `fusszeile` oder `versteckt`).

## Bilder

- Neue Fotos nach `public/images/<bereich>/` legen, Dateiname klein, ohne Leerzeichen und Umlaute
  (z. B. `neue-fassungen-2027.jpg`). Höchstens 5 MB – größere Dateien blockiert der Commit-Schutz.
- Die kleinen WebP-Größen entstehen beim Bauen automatisch (`scripts/bildgroessen.mjs`). Im Code immer
  den `.jpg`-Pfad eintragen; ein Foto mit gleichem Dateinamen ersetzt das alte.
- Videos: nie ins Repo – David fragen.

## Was NICHT ohne David geändert wird

- `next.config.ts`, `wrangler.jsonc`, `public/_headers`, `public/_redirects`, `worker/`,
  `package.json`, `.github/`, `lib/`, `scripts/`
- Impressum und Datenschutz (rechtlich relevant)
- Gesundheitsaussagen auf der Seite Augengesundheit (Heilmittelwerbegesetz – vorher prüfen lassen)
- Alles, was neue Dienste, Tracking oder Kosten mit sich bringt

Soll Alexander etwas, das dort liegt: freundlich sagen, dass dafür David gebraucht wird, und nichts ändern.

## Fakten

Keine Preise, Zahlen, Namen, Daten oder Versprechen erfinden. Fehlt eine Angabe, Alexander fragen
oder einen Platzhalter in eckigen Klammern setzen, z. B. `[PREIS]`.

## Technik in einem Satz

Next.js 16 (statischer Export) + Tailwind 4, Inhalte als JSON in `content/`, Hosting bei Cloudflare
(ein Worker liefert die Seite und nimmt Terminanfragen unter `/api/termin` an; `main` = Live-Seite,
`staging` = Testversion hinter Login), Terminmails über Resend, Statistik per Cloudflare Web Analytics
(ohne Cookies). Details: `docs/03-technik.md`.
