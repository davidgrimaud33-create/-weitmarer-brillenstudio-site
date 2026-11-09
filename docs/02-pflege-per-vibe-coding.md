# Ihre Website selbst pflegen – Anleitung für Alexander

Sie ändern Ihre Website, indem Sie Claude Code in einfachen Sätzen sagen, was Sie möchten.
Claude kennt die Regeln für diese Seite (Datei `CLAUDE.md`) und hält sich daran.

## So läuft jede Änderung ab

1. **Sagen, was Sie wollen**, zum Beispiel:
   - „Wir haben vom 23. Dezember bis 2. Januar Betriebsurlaub. Trag das bei den Öffnungszeiten ein.“
   - „Neue Aktion: Gleitsichtbrille komplett ab 299 Euro, gültig vom 1. bis 30. März.“
   - „Ersetze das Foto von Regine durch die Datei regine.jpg, die ich dir gegeben habe.“
2. **Claude ändert die Seite auf der Testversion (Staging)** und nennt Ihnen den Link.
3. **Sie schauen sich die Testversion an** – am besten auch auf dem Handy.
4. **Wenn alles passt**, sagen Sie: „Passt, bitte live schalten.“ Erst dann wird die echte Seite aktualisiert.
   Nach ein bis zwei Minuten ist die Änderung online.

Die Testversion finden Sie unter [STAGING-URL] (mit Anmeldung per E-Mail-Code), die echte Seite unter https://www.weitmarer-brillenstudio.de.
Claude kennt für die häufigen Aufgaben fertige Abläufe (neue Seite, Aktion, Urlaub, Foto, live schalten,
rückgängig). Sie müssen nichts davon auswendig kennen: Sagen Sie einfach, was Sie möchten.
Wenn Sie in der Testversion ein Terminformular ausprobieren, geht die Mail nur an ein Test-Postfach, nie an den Laden.

## Was Sie problemlos selbst ändern können

- Öffnungszeiten, Feiertage, Urlaub
- Aktionen und Angebote (sie verschwinden nach dem Enddatum von selbst)
- Teammitglieder, Fotos und Schwerpunkte
- Marken
- Texte auf der Startseite, Fragen und Antworten
- Fotos austauschen (höchstens 5 MB pro Bild)
- Neue Seiten aus den fertigen Bausteinen (siehe unten)

## Wann Sie lieber David fragen

- Impressum und Datenschutz
- Aussagen zu Gesundheit und Wirkung (z. B. bei TearStim) – hier gelten strenge Werberegeln
- Neue Funktionen, ein Baustein, den es noch nicht gibt, Statistik, Videos, alles was Geld kostet
- Wenn Claude meldet, dass etwas nicht funktioniert

## Gute Fragen an Claude

- „Was steht gerade bei den Öffnungszeiten?“
- „Welche Aktionen laufen gerade, und wann enden sie?“
- „Zeig mir alle Stellen, an denen noch eckige Klammern stehen.“ (das sind offene Platzhalter)

## Neue Seite bauen

Neue Seiten setzen sich aus fertigen Bausteinen zusammen, im gleichen Design wie der Rest der Seite.

1. Sagen Sie, worum es geht und was auf die Seite soll, zum Beispiel:
   „Ich möchte eine neue Seite für unsere Sportbrillen, mit Bühne, Text mit Bild und Termin-Aufforderung.“
2. Claude fragt nach dem, was fehlt: Titel, Texte, Fotos, Knöpfe, ob die Seite im Menü stehen soll.
   Fehlt Ihnen etwas, bleibt zunächst eine Stelle in [eckigen Klammern] stehen. Claude erfindet keine Preise oder Fakten.
3. Claude legt die Seite an und zeigt sie Ihnen auf der Testversion. Dort schauen Sie in Ruhe nach.
4. Erst nach Ihrem „Passt, bitte live schalten“ geht sie auf die echte Seite.

Gibt es für Ihren Wunsch keinen passenden Baustein, sagt Claude das und David hilft weiter.

## Das Musterbuch

Das Musterbuch ist eine versteckte Seite ([STAGING-URL]/musterbuch). Sie zeigt jeden Baustein einmal,
mit Nummer und Namen (1 Bühne, 2 Text, 3 Text mit Bild, 4 Karten, 5 Galerie, 6 Zitat, 7 Häufige Fragen,
8 Hinweis, 9 Aufforderung mit Knopf, 10 Marken, 11 Öffnungszeiten und Anfahrt, 12 Aktionen).
Sie können dann sagen: „Neue Seite wie Baustein 1, 3 und 9.“ Das Musterbuch ist nicht im Menü und taucht bei Google nicht auf.

## Der Notfallknopf

Ist etwas Falsches online? Sagen Sie: **„Mach die letzte Änderung rückgängig.“**

1. Claude zeigt Ihnen, auf welchen früheren Stand die Live-Seite zurückgesetzt wird, und fragt, ob das so
   richtig ist. Nach Ihrem Ja ist die Live-Seite innerhalb von Sekunden wieder im alten Zustand.
2. Danach nimmt Claude den Fehler auch aus den Dateien der Testversion heraus.
   Er verschwindet damit auch beim nächsten „Live schalten“ nicht wieder.

War der Fehler nur auf der Testversion, ist nur Schritt 2 nötig. Die Live-Seite war dann nie betroffen.

Mehr Beispielsätze: [`05-beispielsaetze.md`](05-beispielsaetze.md).
