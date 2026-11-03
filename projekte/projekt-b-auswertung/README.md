# Projekt B – Buchungsauswertung für den Barbershop

> ⏱ **ca. 8–10 Stunden** (über 2 Wochen verteilt) · Nach Lektion 9 · Schwierigkeit: ●●●●○

## Worum geht's

Der Barbershop exportiert seine Buchungen jeden Monat aus verschiedenen Systemen – mal als CSV, mal als JSON. Die Daten sind nicht sauber: falsche Daten, Tippfehler, fehlende Felder. Die Inhaberin möchte trotzdem wissen: Wie viel Umsatz? Welcher Barber? Welche Services laufen? Wie viele Kunden erscheinen nicht?

Du baust ein **Kommandozeilen-Programm**, das alle Export-Dateien eines Ordners einliest, **jeden Eintrag prüft**, fehlerhafte meldet (statt abzustürzen), die gültigen auswertet und einen Bericht als Text oder JSON ausgibt.

**Was du hier anwendest:** `unknown` prüfen (L2, L5), Unions und `Result`-artige Rückgaben (L5), Arrays/Maps/Gruppieren (L6), Generics für Hilfsfunktionen (L7), `async`/`await` und `Promise.all` (L8), Module, `fs/promises`, `parseArgs` (L9).

Im Unterschied zu Projekt A ist die **Struktur deines Codes weitgehend dir überlassen**. Vorgegeben sind nur die Typen und die Funktionen, die die Abnahmetests aufrufen.

## Aufbau

```text
projekt-b-auswertung/
├── daten/                    ✅ Beispieldaten (enthalten absichtlich Fehler!)
│   ├── services.json
│   ├── buchungen-2026-09.csv
│   ├── buchungen-2026-10.csv
│   ├── buchungen-2026-11.json
│   └── notizen.txt           ← soll ignoriert werden
├── src/
│   ├── typen.ts              ✅ vorgegeben – lies zuerst den Typ Report!
│   ├── index.ts              ✅ vorgegeben – öffentliche Schnittstelle
│   ├── laden.ts              ✍️ DU: Dateien lesen und prüfen
│   ├── analyse.ts            ✍️ DU: Auswertung (reine Funktion)
│   ├── bericht.ts            ✍️ DU: Text-/JSON-Ausgabe
│   ├── cli.ts                ✍️ DU: das Programm
│   └── …                     ✍️ DU: eigene Module, z. B. validierung.ts
└── tests/
    ├── abnahme.test.ts       ✅ vorgegeben (nicht verändern)
    └── eigene.test.ts        ✍️ DU: mindestens 8 eigene Tests
```

Öffne die Dateien in `daten/` und schau dir an, was dich erwartet. Findest du die 6 fehlerhaften Einträge selbst?

## Meilensteine

```bash
npm run test:watch -- projekt-b -t M1
```

| # | Was | Tests | Zeit |
|---|-----|-------|------|
| **M1** | `loadServices` – JSON-Datei lesen und Einträge prüfen | `-t M1` | 45 min |
| **M2** | `parseBookingCsv` und `parseBookingJson` – die Validierung | `-t M2` | 2–3 h |
| **M3** | `loadAllBookings` – alle Dateien parallel laden, zusammenführen, sortieren | `-t M3` | 60 min |
| **M4** | `analyze` – der Report | `-t M4` | 2 h |
| **M5** | `renderText`, `renderJson`, `renderErrors` | `-t M5` | 45 min |
| **M6** | `cli.ts` – das Programm; eigene Tests; Aufräumen | – | 90 min |

## Design-Tipps

<details>
<summary>M2: CSV und JSON teilen sich die Prüfregeln – wie vermeide ich doppelten Code?</summary>

Beide Parser bringen ihre Daten zuerst in **dieselbe Zwischenform**, z. B. ein `Partial<Record<Feldname, string>>` (Feldname = `"id" | "date" | …`). Dann prüft eine gemeinsame Funktion `validateRecord(record, knownServiceIds)` die Regeln 2–6 und liefert entweder eine `Booking` oder eine Fehlermeldung. So gibt es die Regeln nur einmal.

Für das Ergebnis von `validateRecord` bietet sich eine Union an – z. B. `Booking | string` oder ein `Result<Booking, string>` aus Lektion 7.
</details>

<details>
<summary>M2: Wie prüfe ich, ob ein Datum echt ist (2026-09-31 gibt es nicht)?</summary>

Erst das Format mit einem regulären Ausdruck prüfen (`/^(\d{4})-(\d{2})-(\d{2})$/`), dann mit `new Date(Date.UTC(jahr, monat - 1, tag))` ein Datum bauen und schauen, ob Jahr, Monat und Tag gleich geblieben sind. JavaScript macht aus dem 31. September stillschweigend den 1. Oktober – genau daran erkennst du ungültige Daten.
</details>

<details>
<summary>M2: Wie komme ich an die Spaltenreihenfolge?</summary>

Die Kopfzeile in ein Array von Feldnamen übersetzen (mit einer Lookup-Tabelle `{ datum: "date", zeit: "time", kunde: "customer", … }`). Dann weisst du für jede Spalte `i`, welches Feld sie enthält.
</details>

<details>
<summary>M3: In welcher Reihenfolge laden?</summary>

Zuerst `services.json` (die IDs brauchst du für die Prüfung), dann **alle** Buchungsdateien gleichzeitig mit `Promise.all(files.map(async (file) => …))`.
</details>

<details>
<summary>M4: Der Report hat so viele Felder …</summary>

Eine Hilfsfunktion, die du mehrfach brauchst: «summiere/zähle pro Schlüssel». Mit Generics (Lektion 7):

```ts
function sumBy<T>(items: readonly T[], key: (item: T) => string, value: (item: T) => number): Map<string, number>
```

Damit sind Umsatz pro Monat, pro Barber, pro Service und Anzahl pro Wochentag jeweils ein Einzeiler.
</details>

## Anforderungen an das Programm (M6)

Das Programm wird so aufgerufen (aus dem Hauptordner):

```bash
npm run projekt-b -- --input projekte/projekt-b-auswertung/daten
npm run projekt-b -- -i projekte/projekt-b-auswertung/daten -f json -o projekte/projekt-b-auswertung/ausgabe/report.json
```

Die genauen Anforderungen (Optionen, Fehlerverhalten, Exit-Code) stehen als Kommentar in `src/cli.ts`.

**Manuelle Abnahme** – prüfe selbst:

- [ ] Textbericht wird übersichtlich ausgegeben, die 6 Datenfehler erscheinen separat auf stderr
- [ ] `--format json --out …` schreibt eine Datei und legt den Ordner `ausgabe/` an
- [ ] Unbekannte Option, fehlendes `--input` oder ein nicht existierender Ordner → verständliche Meldung, Exit-Code 1 (prüfen mit `echo $?` direkt nach dem Aufruf)
- [ ] `--help` erklärt die Optionen

## Anforderungen an deinen Code

- [ ] Alle Abnahmetests grün, mindestens 8 eigene Tests
- [ ] `npx tsc --noEmit -p projekte/projekt-b-auswertung` ohne Fehler
- [ ] Kein `any`; jedes `as` mit Kommentar begründet
- [ ] `analyze` ist eine reine Funktion (keine Dateizugriffe, kein `console.log`)
- [ ] Code ist auf sinnvolle Module verteilt, keine Datei länger als ~150 Zeilen
- [ ] Code mit `npm run format` formatiert

## Bonus

- ⭐ Ein Abschnitt «Auslastung pro Barber»: gebuchte Minuten pro Tag (Dauer aus den Services)
- ⭐ Option `--month 2026-10`, um nur einen Monat auszuwerten
- ⭐⭐ Option `--watch`: Bericht neu erstellen, sobald sich eine Datei im Ordner ändert ([`fs.watch`](https://nodejs.org/api/fs.html#fspromiseswatchfilename-options))
- ⭐⭐ Ein HTML-Bericht (`--format html`) mit einer einfachen Tabelle

## Review

Schick mir nach M3 einen Zwischenstand und am Schluss das fertige Projekt (siehe [`REVIEW.md`](../../REVIEW.md)). Diesmal schaue ich zusätzlich auf:

- **Fehlerbehandlung** – erwartbare Fehler (Datenfehler) vs. echte Fehler (Datei fehlt)
- **Modulstruktur** – sinnvolle Aufteilung, klare Abhängigkeiten
- **Async** – wird wirklich parallel geladen? Gibt es vergessene `await`?

Danach geht es weiter mit [Lektion 10 – Fortgeschrittene Typen](../../lektionen/l10-fortgeschrittene-typen/README.md).
