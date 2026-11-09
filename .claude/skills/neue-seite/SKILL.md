---
name: neue-seite
description: Legt eine neue Seite für die Website an, zum Beispiel "Ich möchte eine neue Seite für unsere Sportbrillen", "mach eine Seite über Kinderbrillen" oder "neue Seite wie Baustein 1, 3 und 9". Nutze diesen Befehl, sobald Alexander eine ganz neue Seite haben möchte. Neue Seiten werden nur aus den fertigen Bausteinen gebaut.
---

# Neue Seite anlegen

Neue Seiten bestehen **nur aus den fertigen Bausteinen** (Musterbuch). Du schreibst keinen eigenen
Design-Code und legst keine neue `app/<seite>/page.tsx` an. Fehlt ein passender Baustein, sage
Alexander einfach, dass dafür David gebraucht wird, und höre auf.

## Schritt 1: Branch vorbereiten

`git checkout staging && git pull` (Ablauf siehe `CLAUDE.md`, Abschnitt "erst Staging, dann live").

## Schritt 2: Wünsche klären

Frage in einfachen Sätzen nach, was du noch nicht weißt. Immer nur das Nötige, nicht alles auf einmal:

1. **Worum geht es auf der Seite?** (Titel und ein Satz Beschreibung für Google)
2. **Welche Bausteine?** Alexander kann Nummern aus dem Musterbuch nennen. Das Musterbuch ist die
   versteckte Seite `/musterbuch` (auf der Testversion: `[STAGING-URL]/musterbuch`). Die Nummer ist die
   Position in `lib/bausteine/musterbuch.ts` (1 Bühne, 2 Text, 3 Text mit Bild, 4 Karten, 5 Galerie,
   6 Zitat, 7 Häufige Fragen, 8 Hinweis, 9 Aufforderung mit Knopf, 10 Marken,
   11 Öffnungszeiten und Anfahrt, 12 Aktionen). Nennt er stattdessen Worte ("mit Bühne, Text mit Bild
   und Termin-Aufforderung"), ordne sie den Bausteinen zu und wiederhole kurz, was du verstanden hast.
   Eine Bühne gibt es höchstens **einmal pro Seite**.
3. **Wo soll die Seite im Menü erscheinen?** `haupt` (Hauptmenü), `fusszeile` (nur ganz unten) oder
   `versteckt` (nur über direkten Link). Wenn Alexander es nicht sagt: `versteckt` vorschlagen.
4. **Welche Texte, Fotos, Knöpfe?** Fehlt ein Fakt (Text, Preis, Name, Datum, Foto), frage nach.
   Erfinde nichts. Wenn Alexander es später liefern will, setze einen Platzhalter in eckigen
   Klammern, z. B. `[TEXT FOLGT]` oder `[PREIS]`.
5. **Adresse der Seite** (Dateiname): nur Kleinbuchstaben, Ziffern und Bindestriche, ohne Umlaute,
   z. B. `sportbrillen`. Daraus wird `/sportbrillen`.

## Schritt 3: Datei anlegen

Lege `content/seiten/<adresse>.json` an. Die genauen Felder jedes Bausteins stehen in
`lib/bausteine/typen.ts`, ein gültiges Beispiel je Baustein in `lib/bausteine/beispiele.ts`.
Grundform:

```json
{
  "titel": "Sportbrillen",
  "beschreibung": "Ein Satz für Google, was auf der Seite steht.",
  "menue": "versteckt",
  "stichworte": "sport, sportbrille, radfahren",
  "bausteine": [
    { "typ": "buehne", "titel": "…", "unterzeile": "…", "bild": "/images/…jpg", "knopf": { "text": "Termin vereinbaren", "link": "/termin" } }
  ]
}
```

Regeln:
- Die Adresse steht **nur im Dateinamen**, nicht in der Datei.
- Knopf-Links zeigen auf bestehende Seiten, z. B. `/termin`.
- Fotos liegen unter `public/images/<bereich>/`, im JSON steht der `.jpg`-Pfad (siehe `foto-tauschen`).
  Bei der **Bühne** ist das Bild freiwillig: noch kein Foto, dann `bild` einfach weglassen.
  Bei **Text mit Bild**, **Galerie** und **Karten** mit Bild muss ein Pfad stehen, der mit `/images/` beginnt.
  Liefert Alexander das Foto erst später, nimm vorläufig ein vorhandenes Foto aus `public/images/`
  (Datei muss existieren) und schreibe `[FOTO FOLGT]` in `bildAlt`, damit die Stelle beim Suchen nach
  eckigen Klammern auffällt. Sag Alexander ausdrücklich, dass das Foto nur ein Platzhalter ist,
  und gib die Seite nicht live, bevor es ersetzt ist.
- Adressen, die es schon gibt (z. B. `termin`, `sehhilfen`, alte Weiterleitungen), sind gesperrt.
- Gesundheitsaussagen (Wirkung, Heilung) nur nach Rücksprache mit David.

## Schritt 4: Prüfen

`npm run build` muss grün durchlaufen. Meldet der Build einen Fehler, steht darin der Dateiname und
das Feld. Behebe ihn und baue erneut. Zeige Alexander nie eine Fehlermeldung roh, sondern erkläre sie in
einem Satz. Eckige Klammern mit `grep -n "\[" content/seiten/<adresse>.json` aufzählen und Alexander
sagen, was noch fehlt.

## Schritt 5: Staging

Commit mit deutscher Nachricht (z. B. `Neue Seite Sportbrillen`), `git push` auf `staging`.
Nach 1 bis 2 Minuten ist die Seite auf der Testversion: `[STAGING-URL]/<adresse>`. Nenne Alexander
diesen Link und bitte ihn, sie auch auf dem Handy anzusehen. **Nicht live schalten**, das passiert
erst mit dem Befehl `live-schalten` nach seiner ausdrücklichen Freigabe.
