---
name: angebote-aktualisieren
description: Aktualisiert die Monatsangebote auf der Seite /angebote aus dem monatlichen Angebots-PDF, zum Beispiel "Hier ist das neue Angebots-PDF für Dezember", "trag die Angebote aus dem Prospekt ein", "die Monatsangebote sind abgelaufen" oder "nimm das Gleitsicht-Angebot raus". Nutze diesen Befehl für alles rund um die Monatsangebote zu Fassungen, Gläsern und Kontaktlinsen.
---

# Monatsangebote aktualisieren

Die Monatsangebote stehen in **`content/angebote.json`** und erscheinen auf `/angebote` und als Band oben
auf der Startseite. Nach `gueltigBis` verschwinden sie von selbst („Neue Angebote folgen in Kürze“).

Ablauf wie immer: erst `staging`, live erst nach Alexanders Freigabe (siehe `CLAUDE.md`).

## 1. PDF entgegennehmen und lesen

1. Alexander gibt dir das PDF (Pfad oder Datei). Lies es vollständig.
2. Liste ihm in einfachen Sätzen auf, was du gefunden hast – pro Angebot: Kategorie, Titel, Preis oder
   Rabatt, Bedingungen, Gültigkeit. **Nichts erfinden.** Was im PDF unklar ist, als Frage stellen.
3. Höchstens **9 Angebote**. Sind es mehr, frag Alexander, welche auf die Website sollen.
4. **Erst wenn Alexander die Liste bestätigt hat**, die Datei ändern.

## 2. `content/angebote.json` ausfüllen

```json
{
  "entwurf": false,
  "monat": "Dezember 2026",
  "ueberschrift": "Dezember-Preise",
  "gueltigAb": "2026-12-01",
  "gueltigBis": "2026-12-31",
  "hinweis": "Alle Preise inkl. MwSt. Solange der Vorrat reicht.",
  "pdf": "/angebote/2026-12.pdf",
  "angebote": [
    { "kategorie": "fassungen", "titel": "…", "text": "…", "wert": "−30 %", "wertArt": "rabatt",
      "bild": "/images/laden/fassungswand.jpg", "bildAlt": "Fassungswand im Laden" },
    { "kategorie": "glaeser", "titel": "…", "text": "…", "wert": "299 €", "wertVorsatz": "ab", "wertArt": "preis" },
    { "kategorie": "kontaktlinsen", "titel": "…", "text": "…", "wert": "3+1", "wertArt": "aktion" }
  ]
}
```

- `kategorie`: `fassungen`, `glaeser` oder `kontaktlinsen`.
- `wertArt` bestimmt die Grafik: `rabatt` = roter Stern (z. B. „−30 %“), `preis` = Preisschild
  (z. B. „299 €“, mit `"wertVorsatz": "ab"`), `aktion` = große rote Schrift (z. B. „3+1“, „2. Paar gratis“).
- `wert` kurz halten (höchstens etwa 8 Zeichen), Details gehören in `text`.
- **Foto** optional. Nur Fotos, die es in `public/images/` schon gibt (vorher mit `ls` prüfen), dann ist
  `bildAlt` Pflicht. Ohne Foto wird das Angebot als breites Band gezeigt. Neue Fotos: Befehl `foto-tauschen`.
- **PDF zum Herunterladen** (optional): Datei als `public/angebote/JJJJ-MM.pdf` ablegen (klein geschrieben,
  höchstens 5 MB) und unter `"pdf"` eintragen. Nur, wenn Alexander das PDF veröffentlichen darf –
  im Zweifel fragen (Hersteller-Prospekte sind oft urheberrechtlich geschützt).
- `"entwurf": false` setzen, sobald es echte Angebote sind. Mit `true` lässt sich nichts live schalten.
- Datumsformat immer `JJJJ-MM-TT`. `gueltigBis` = letzter Tag, an dem das Angebot gilt.
- Alte Monats-PDFs in `public/angebote/` löschen, wenn sie nicht mehr verlinkt sind.

## 3. Prüfen und zeigen

1. `npm run build` – Fehler nennen Datei, Angebots-Nummer und Feld. Beheben, nicht umgehen.
2. Commit („Monatsangebote Dezember 2026“) und Push auf `staging`.
3. Alexander bitten, `/angebote` und die Startseite auf der Testversion `[STAGING-URL]` anzusehen,
   am besten auch am Handy. Live erst nach „passt, live schalten“ (Befehl `live-schalten`).

## Angebote früher beenden

„Nimm das Angebot X raus“ → Eintrag aus `angebote` löschen. Sollen alle sofort weg:
`gueltigBis` auf gestern setzen. Danach wie oben bauen, Testversion, Freigabe.
