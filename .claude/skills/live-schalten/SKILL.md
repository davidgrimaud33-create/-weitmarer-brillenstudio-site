---
name: live-schalten
description: Schaltet die geprüften Änderungen von der Testversion auf die echte Live-Seite, wenn Alexander sagt "passt, live schalten", "ja, bitte online stellen" oder etwas Gleichbedeutendes. Nutze diesen Befehl nur nach dieser ausdrücklichen Freigabe.
---

# Live schalten

**Nur nach wörtlicher Freigabe.** Alexander muss ausdrücklich sagen "passt, live schalten" oder etwas
klar Gleichbedeutendes ("ja, stell es online"). Antworten wie "sieht gut aus", "ok", "mal sehen" oder
Schweigen sind **keine** Freigabe. Dann nachfragen: "Soll ich das jetzt auf die echte Seite stellen?"
Eine Freigabe gilt nur für die Änderungen, die er gerade auf der Testversion gesehen hat. Hat sich seitdem
etwas geändert, zeige ihm das und frage neu.

## Ablauf

1. Prüfen, dass auf `staging` alles eingecheckt und gepusht ist: `git checkout staging && git pull`,
   `git status` muss sauber sein. Danach `npm run build` (muss grün sein) und `npm test`.
2. Alexander in einem Satz sagen, was live geht (`git log main..staging --oneline` zeigt es).
3. Mergen und pushen:
   ```
   git checkout main && git pull
   git merge staging
   git push
   ```
   Niemals `--force`. Gibt es Merge-Konflikte: **nicht selbst auflösen**, sondern Alexander sagen,
   dass David helfen muss, und `git merge --abort` ausführen.
4. **Sofort zurück auf `staging`:** `git checkout staging`.
5. Rückmeldung an Alexander: Die Änderung ist in 1 bis 2 Minuten auf der Live-Seite
   ([LIVE-URL]) sichtbar. Bitte kurz dort nachsehen. Wenn etwas nicht stimmt, genügt der Satz
   "Mach die letzte Änderung rückgängig" (Befehl `rueckgaengig`).
