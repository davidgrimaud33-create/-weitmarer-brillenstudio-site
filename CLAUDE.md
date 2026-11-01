@AGENTS.md

# Weitmarer Brillenstudio – Regeln für Änderungen per Claude Code

Diese Website gehört dem Weitmarer Brillenstudio (Inhaber Alexander Jäh, Bochum).
Alexander pflegt sie selbst per Vibe-Coding. Betreut wird sie von David Grimaud (DeepMetis).
Sprich mit Alexander auf Deutsch, in einfachen, ausformulierten Sätzen, ohne Fachkürzel.

## Der wichtigste Ablauf: erst Staging, dann live

1. Jede Änderung passiert auf dem Branch **`staging`** – nie direkt auf `main`.
   Vor dem Arbeiten: `git checkout staging && git pull`.
2. Änderung machen, dann `npm run build` – muss ohne Fehler durchlaufen.
3. Commit mit verständlicher deutscher Nachricht und `git push`.
   Netlify baut daraufhin die **Staging-Seite** neu (1–2 Minuten). Alexander prüft dort.
4. Erst wenn Alexander ausdrücklich sagt „passt, live schalten“:
   `git checkout main && git pull && git merge staging && git push` → Production-Seite wird neu gebaut.
5. Danach zurück auf `staging` wechseln.

Niemals ohne ausdrückliche Freigabe auf `main` pushen. Niemals `git push --force`.

## Wo steht was? (Inhalte ändern = fast immer nur JSON)

| Was Alexander ändern will | Datei |
|---|---|
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
Uhrzeiten immer `HH:MM`. Nach jeder JSON-Änderung `npm run build` – ein Tippfehler fällt dort auf.

## Bilder

- Neue Fotos nach `public/images/<bereich>/` legen, Dateiname klein, ohne Leerzeichen und Umlaute
  (z. B. `neue-fassungen-2027.jpg`). Höchstens 5 MB – größere Dateien blockiert der Commit-Schutz.
- WebP-Versionen entstehen automatisch per GitHub Action nach dem Push. Im Code immer den
  `.jpg`-Pfad eintragen; die Seite tauscht selbst gegen WebP.
- Videos nie ins Repo – Videos kommen auf Bunny Stream (David fragen).

## Was NICHT ohne David geändert wird

- `next.config.ts`, `netlify.toml`, `package.json`, `.github/`, `lib/`, `app/api/`
- Impressum und Datenschutz (rechtlich relevant)
- Gesundheitsaussagen auf der Seite Augengesundheit (Heilmittelwerbegesetz – vorher prüfen lassen)
- Alles, was neue Dienste, Tracking oder Kosten mit sich bringt

## Fakten

Keine Preise, Zahlen, Namen, Daten oder Versprechen erfinden. Fehlt eine Angabe, Alexander fragen
oder einen Platzhalter in eckigen Klammern setzen, z. B. `[PREIS]`.

## Technik in einem Satz

Next.js 16 + Tailwind 4, Inhalte als JSON in `content/`, Hosting auf Netlify (zwei Sites: Production
aus `main`, Staging aus `staging`), Bilder optional über Bunny.net, Terminanfragen per Resend,
Statistik/Automatisierung auf eigenem Hetzner-Server. Details: `docs/03-technik.md`.
