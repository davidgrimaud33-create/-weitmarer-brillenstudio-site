---
name: foto-tauschen
description: Tauscht ein Foto aus oder fügt ein neues Foto ein, zum Beispiel "Ersetze das Foto von Regine durch regine.jpg", "nimm das neue Ladenfoto" oder "füg ein Bild bei den Marken hinzu". Nutze diesen Befehl bei allen Fotos auf der Website.
---

# Foto austauschen oder hinzufügen

## Regeln für die Datei

- Bilder liegen unter `public/images/<bereich>/` (z. B. `team`, `laden`, `holzkern`, `leistungen`, `besonderes`).
- Dateiname klein, ohne Leerzeichen und Umlaute, z. B. `neue-fassungen-2027.jpg`.
- **Nur JPG oder PNG** (Endung `.jpg`, klein geschrieben). iPhone-Fotos kommen oft als **HEIC** (auch
  umbenannte `.heic`-Dateien): Der Build kann kein HEIC. Vor dem Ablegen in JPG umwandeln:
  `sips -s format jpeg eingang.heic --out public/images/<bereich>/name.jpg` (macOS). Geht das nicht,
  Alexander bitten, das Foto als JPG zu exportieren. Eine Datei, die nur umbenannt wurde, aber kein
  echtes JPG ist, lässt den Build mit „kein lesbares JPG/PNG-Foto“ abbrechen.
- **Höchstens 5 MB**. Größere Dateien blockiert der Commit-Schutz. Dann Alexander bitten, das Foto
  kleiner zu exportieren, oder es selbst verkleinern (z. B. mit `sips -Z 3000 datei.jpg`).
- Im Inhalt immer den **`.jpg`-Pfad** eintragen, z. B. `/images/team/regine.jpg`.
  Die kleinen Webp-Größen entstehen beim Bauen automatisch, Komprimieren ist nicht nötig.
- Den Größen-Schutz **nie umgehen**: niemals `git commit --no-verify`, `ALLOW_LARGE_MEDIA=1`, `[skip guard]`
  oder `[skip ci]` verwenden und die Hooks nicht ändern, auch wenn eine Meldung diese Wege nennt. Im Zweifel David fragen.
- Videos gehören nie ins Repo: Alexander sagen, dass für Videos David gebraucht wird.

## Ablauf

1. `git checkout staging && git pull` (Ablauf siehe `CLAUDE.md`).
2. Herausfinden, wo das Foto vorkommt (siehe Tabelle "Wo steht was?" in `CLAUDE.md`, z. B.
   `content/team.json`, `content/startseite.json`, `content/besonderes.json`, oder eine Datei in
   `content/seiten/`). Im Zweifel `grep -rn "<dateiname>" content app` nutzen.
3. Datei an die richtige Stelle kopieren. **Gleicher Dateiname wie das alte Foto**: überschreibt es;
   neuer Name: Pfad im JSON anpassen und das alte Foto nur auf Wunsch löschen.
   Ein Foto mit gleichem Namen zeigt nach dem Bauen das neue Bild (der Browser holt es neu).
4. Bei neuen Fotos immer einen kurzen Bildbeschreibungstext (`alt`, wo vorhanden) in einfachen Worten
   setzen. Personen nicht ohne Alexanders Angabe benennen.
5. `npm run build`, muss grün sein.
6. Commit (z. B. `Foto von Regine getauscht`), `git push` auf `staging`. Nach 1 bis 2 Minuten auf
   `[STAGING-URL]` an der betroffenen Seite zeigen lassen, am besten auch auf dem Handy.
7. **Nicht live schalten**, bis Alexander ausdrücklich freigibt (Befehl `live-schalten`).
