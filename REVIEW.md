# Code-Reviews und Hilfe holen

Ein Review ist das Wertvollste, was du aus den Projekten herausholen kannst. Tests sagen dir, *ob* dein Code funktioniert – ein Review sagt dir, *wie gut* er ist und was erfahrene Entwickler anders machen würden.

## 1. Vorbereiten

```bash
npm test -- projekt-a                                  # Status notieren (alles grün? was nicht?)
npx tsc --noEmit -p projekte/projekt-a-terminplaner    # Typfehler?
npm run format
git add . && git commit -m "Projekt A: bereit für Review"
```

Aktualisiere `FORTSCHRITT.md` (vor allem «Offene Fragen»).

## 2. Code verpacken

**Variante A – ZIP (am einfachsten):** Erstellt ein ZIP mit allen committeten Dateien, ohne `node_modules`:

```bash
git archive --format=zip -o review.zip HEAD
```

Lade `review.zip` im Chat hoch. Wenn das ZIP zu gross ist, nur den betroffenen Ordner:

```bash
git archive --format=zip -o review.zip HEAD projekte/projekt-a-terminplaner FORTSCHRITT.md
```

**Variante B – GitHub:** Wenn dein Kurs-Repository auf GitHub liegt und GitHub mit Claude verbunden ist, reicht der Link zum Repository bzw. zum Commit.

## 3. Vorlage für die Anfrage

Kopiere diese Nachricht in einen neuen Chat und passe die markierten Stellen an:

```text
Ich arbeite an meinem TypeScript-Kurs für Java-Umsteiger (Ordnerstruktur:
lektionen/, projekte/, FORTSCHRITT.md). Im Anhang ist mein aktueller Stand.

Bitte mach ein Code-Review von: <z. B. projekte/projekt-a-terminplaner>
Stand: <z. B. M1–M5 fertig, alle Abnahmetests grün, 6 eigene Tests>

Besonders unsicher bin ich bei: <z. B. der freeSlots-Methode, ob meine Klasse zu gross ist>

Bitte prüfe:
1. Korrektheit – auch Fälle, die die Tests nicht abdecken
2. Lesbarkeit und Struktur
3. Typen – zu locker? unnötige `as`/`!`/`any`?
4. Idiomatisches TypeScript – wo schreibe ich noch «Java in TypeScript»?
5. Meine eigenen Tests – prüfen sie das Richtige?

Gib mir zuerst die drei wichtigsten Punkte, dann die Details mit Dateiname
und Zeile. Zeig Verbesserungen als kleine Code-Beispiele, aber schreib
nicht den ganzen Code für mich neu.
```

## 4. Hilfe, wenn du feststeckst

Möchtest du keinen fertigen Code, sondern nur einen Schubs in die richtige Richtung? Dann so:

```text
Ich hänge in meinem TypeScript-Kurs bei <Lektion/Aufgabe>.
Mein Code: <einfügen>
Die Fehlermeldung / der rote Test: <einfügen>
Was ich schon versucht habe: <…>

Bitte gib mir nur einen Hinweis, keine Lösung. Wenn ich danach immer noch
hänge, frage ich nach einem zweiten Hinweis.
```

Das ist oft lehrreicher als die Musterlösung – du kommst selbst drauf.

## 5. Was du von einem Review erwarten kannst

Ein gutes Review ist **konkret** (Datei, Zeile, Beispiel), **priorisiert** (das Wichtigste zuerst) und **ehrlich** – auch wenn etwas nicht gut ist. Es lobt, was gut gemacht ist, damit du weisst, was du beibehalten sollst.

Nach dem Review:

1. Die Punkte in `FORTSCHRITT.md` unter «Notizen» festhalten
2. Die wichtigsten Punkte selbst umsetzen (nicht kopieren!)
3. Committen: `git commit -am "Projekt A: Review-Feedback umgesetzt"`
