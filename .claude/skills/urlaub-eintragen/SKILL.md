---
name: urlaub-eintragen
description: Trägt Urlaub, Betriebsferien, Feiertage oder geänderte Öffnungszeiten ein, zum Beispiel "Wir haben vom 23. Dezember bis 2. Januar Betriebsurlaub", "am Freitag schließen wir schon um 14 Uhr" oder "am Samstag ist ausnahmsweise geöffnet". Nutze diesen Befehl für alles rund um Öffnungszeiten und Ausnahmen.
---

# Urlaub, Feiertag oder geänderte Zeiten eintragen

Alles steht in `content/oeffnungszeiten.json`.

- `regulaer` sind die normalen Wochenzeiten (Tage 0 = Sonntag bis 6 = Samstag).
- `ausnahmen` überschreiben einzelne Tage. Jeder Tag ist ein eigener Eintrag:
  `{ "datum": "2026-12-24", "zeiten": [], "grund": "Heiligabend" }`.
  Leere `zeiten` heißt geschlossen. Verkürzt geöffnet: `"zeiten": [["09:00", "14:00"]]`.
  Vergangene Ausnahmen werden automatisch ignoriert.

## Ablauf

1. `git checkout staging && git pull` (Ablauf siehe `CLAUDE.md`).
2. Datum und Zeiten klären: Von wann bis wann? Ganz geschlossen oder verkürzt? Grund für die
   Anzeige (z. B. "Betriebsurlaub")? Fehlt etwas, nachfragen, nichts raten.
3. Für einen Zeitraum **für jeden Tag einen Eintrag** anlegen (auch für Sonn- und Feiertage in
   dem Zeitraum, damit die Anzeige stimmt). Datum `JJJJ-MM-TT`, Uhrzeiten `HH:MM`.
   Danach die Einträge nach Datum sortiert lassen.
4. Wöchentliche Zeiten dauerhaft ändern? Dann `regulaer` anpassen, aber vorher mit Alexander bestätigen,
   dass es dauerhaft gelten soll.
5. `npm run build`, muss grün sein.
6. Commit (z. B. `Betriebsurlaub 23.12. bis 02.01. eingetragen`), `git push` auf `staging`. Auf der
   Testversion `[STAGING-URL]/termin` zeigen lassen (dort stehen Öffnungszeiten und Hinweis).
7. **Nicht live schalten**, bis Alexander ausdrücklich freigibt (Befehl `live-schalten`).
