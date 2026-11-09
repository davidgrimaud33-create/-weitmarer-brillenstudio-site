---
name: neue-aktion
description: Trägt eine neue Aktion oder ein Angebot ein, zum Beispiel "Neue Aktion: Gleitsichtbrille komplett ab 299 Euro im März", "wir haben ab Montag ein Sonnenbrillen-Angebot" oder "nimm die Aktion XY raus". Nutze diesen Befehl für eigene Aktionen des Ladens unter „Service & Preise“. Für die Monatsangebote aus dem Angebots-PDF (Seite /angebote) gibt es den Befehl `angebote-aktualisieren`.
---

# Aktion eintragen oder ändern

Aktionen stehen in `content/aktionen.json` und erscheinen automatisch nur zwischen Start und Ende.

## Ablauf

1. `git checkout staging && git pull` (Ablauf siehe `CLAUDE.md`).
2. Frage nach, was fehlt: **Titel**, **Text mit Preis und Bedingungen**, **Startdatum**, **Enddatum**,
   und ob die Aktion **auch auf der Startseite** erscheinen soll (`aufStartseite`).
   Preise, Daten und Bedingungen niemals erfinden. Ist etwas unklar, Platzhalter in eckigen Klammern
   (`[PREIS]`) setzen und Alexander darauf hinweisen.
3. Neuen Eintrag in die Liste `aktionen` einfügen, genau nach dem Muster der vorhandenen Einträge.
   Datum immer `JJJJ-MM-TT` (z. B. `2027-03-01`). Start und Ende gelten einschließlich.
   Abgelaufene Aktionen müssen nicht gelöscht werden, sie verschwinden von selbst.
   Soll eine Aktion früher weg, Enddatum auf gestern setzen oder den Eintrag entfernen.
4. Komma- und Anführungszeichen-Fehler vermeiden. Danach `npm run build`, muss grün sein.
5. Commit mit deutscher Nachricht (z. B. `Aktion Gleitsichtbrille März eingetragen`), `git push` auf
   `staging`. Nach 1 bis 2 Minuten auf `[STAGING-URL]` (Seite Service und Preise, ggf. Startseite)
   zeigen lassen.
6. **Nicht live schalten**, bis Alexander ausdrücklich freigibt (siehe Befehl `live-schalten`).
