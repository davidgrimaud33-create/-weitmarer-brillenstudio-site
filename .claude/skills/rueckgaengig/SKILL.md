---
name: rueckgaengig
description: Macht die letzte Änderung rückgängig, wenn Alexander sagt "Mach die letzte Änderung rückgängig", "das war falsch, bitte zurück" oder "auf der Seite ist etwas kaputt". Der Notfallknopf für die Live-Seite und die Testversion.
---

# Letzte Änderung rückgängig machen (Notfallknopf)

Erst klären: **Wo ist der Fehler?**

- Nur auf der **Testversion**: nur Teil B (Git auf `staging`). Die Live-Seite ist nicht betroffen.
- Auf der **Live-Seite**: erst Teil A (sofort zurückrollen), danach Teil B.

Bleibe ruhig und kurz in den Erklärungen. Alexander braucht keine Fachbegriffe.

## Teil A: Live-Seite sofort zurücksetzen (Sekunden, kein Neubauen)

Der Befehl `npx wrangler rollback` stellt die vorherige Version der Live-Seite wieder her.
Dieser Schritt ist ausdrücklich vom Notfallknopf gedeckt und braucht keine zweite Freigabe,
aber **Alexander muss vorher sehen, wohin es zurückgeht, und bestätigen**:

1. Liste der letzten Versionen anzeigen:
   ```
   npx wrangler deployments list
   ```
   (zeigt die 10 letzten Veröffentlichungen mit Datum und Version-ID; die oberste ist die aktuelle).
   Falls nötig zusätzlich `npx wrangler versions list`.
2. Die **vorherige** Version (die direkt unter der aktuellen) heraussuchen. Alexander sagen:
   "Die Live-Seite geht dann zurück auf den Stand vom [DATUM, UHRZEIT] (Version [ID]). Das ist der
   Stand vor Ihrer letzten Änderung. Soll ich das tun?" Auf ein klares Ja warten.
3. Zurückrollen, mit Begründung:
   ```
   npx wrangler rollback <VERSION-ID> --message "Notfall: letzte Änderung rückgängig" --yes
   ```
4. Mit `npx wrangler deployments list` prüfen, dass die gewünschte Version jetzt aktiv ist, und
   Alexander bitten, die Live-Seite ([LIVE-URL]) zu öffnen und zu prüfen.
5. Funktioniert `wrangler` nicht (nicht angemeldet, Fehlermeldung): Alexander sagen, dass David den
   Rollback im Cloudflare-Dashboard machen muss, und mit Teil B trotzdem weitermachen.

Wichtig: Der Rollback ändert **nur die Live-Seite, nicht den Code in Git**. Ohne Teil B käme der Fehler
beim nächsten Live-Gang zurück.

## Teil B: Fehler im Git auf `staging` rückgängig machen

1. `git checkout staging && git pull`
2. Die letzten Commits ansehen: `git log --oneline -10`. Den oder die fehlerhaften Commits benennen und
   Alexander zeigen, was zurückgenommen wird. **Nie einen Merge-Commit zurücknehmen** (die Zeilen
   mit "Merge" nicht anfassen), nur die eigentlichen Änderungs-Commits.
3. Zurücknehmen, neuester zuerst: `git revert --no-edit <COMMIT>` (bei mehreren nacheinander).
   Gibt es Konflikte, nicht raten: `git revert --abort` und David Bescheid geben.
4. `npm run build` muss grün sein.
5. `git push` (auf `staging`). Die Testversion baut neu (1 bis 2 Minuten). Prüfen lassen.
6. Alexander erklären, in einfachen Worten: "Die Live-Seite ist schon zurückgesetzt. Der Fehler ist aber
   noch im Hauptbestand. Er verschwindet dort erst mit dem nächsten Live-Gang, also wenn Sie das
   nächste Mal 'passt, live schalten' sagen. Bis dahin zeigt die Live-Seite den alten,
   richtigen Stand." Nichts auf `main` schieben, das macht erst der Befehl `live-schalten` mit Freigabe.

Niemals `git push --force`, niemals `git reset --hard` auf gemeinsame Branches.
