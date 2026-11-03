# Projekt A – Terminplaner für einen Barbershop

> ⏱ **ca. 6–8 Stunden** (gern über 1–2 Wochen verteilt) · Nach Lektion 6 · Schwierigkeit: ●●●○○

## Worum geht's

Du baust das Herzstück einer Termin-App für einen Barbershop: die **Buchungslogik**. Kunden wollen einen Service (Haarschnitt, Bart, Färben) bei einem bestimmten Barber buchen. Dein Code prüft, ob das geht, verhindert Doppelbuchungen, findet freie Termine und erstellt einen Tagesplan.

Es gibt noch keine Datenbank, keinen Server und keine Oberfläche – nur reine TypeScript-Logik mit Tests. Genau so beginnt man auch in echten Projekten: Die Kernlogik muss stimmen, bevor man Server und UI darum herum baut. In Lektion 11 und 12 und im Abschlussprojekt wird daraus Schritt für Schritt eine richtige Web-App.

**Was du hier anwendest:** Typen und Unions (L2, L5), Funktionen (L3), Klassen mit privatem Zustand (L4), `Result`-Muster (L5), Array-Methoden, `Map`, Sortieren (L6).

## Was vorgegeben ist und was du baust

```text
projekt-a-terminplaner/
├── src/
│   ├── typen.ts        ✅ vorgegeben – alle Datentypen (darfst du erweitern)
│   ├── zeit.ts         ✍️ DU: Zeit-Hilfsfunktionen
│   ├── salon.ts        ✍️ DU: die Salon-Klasse (Signaturen sind vorgegeben)
│   ├── demo-daten.ts   ✅ vorgegeben – Beispieldaten
│   └── main.ts         ✅ vorgegeben – Demo-Programm (npm run projekt-a)
└── tests/
    ├── abnahme.test.ts ✅ vorgegeben – Abnahmetests (nicht verändern!)
    └── eigene.test.ts  ✍️ DU: mindestens 5 eigene Tests
```

Lies **zuerst** `src/typen.ts` und die Kommentare in `src/salon.ts`. Dort steht die genaue Spezifikation jeder Methode. Danach die Abnahmetests – sie zeigen an Beispielen, was erwartet wird.

## Meilensteine

Arbeite die Meilensteine der Reihe nach ab. Mit `-t` filterst du die Tests nach Namen:

```bash
npm run test:watch -- projekt-a -t M1
```

| # | Was | Tests | Zeit |
|---|-----|-------|------|
| **M1** | `zeit.ts`: `parseTime`, `formatTime`, `addMinutes` | `-t M1` | 45 min |
| **M2** | `Salon`-Konstruktor + `book` (ohne Überschneidungen) | `-t M2` | 90 min |
| **M3** | Überschneidungen erkennen + `cancel` | `-t M3` | 60 min |
| **M4** | `appointmentsFor` + `freeSlots` | `-t M4` | 60 min |
| **M5** | `dailyRevenue` + `daySummary` | `-t M5` | 45 min |
| **M6** | Eigene Tests, Aufräumen, Refactoring, `npm run projekt-a` | – | 60 min |

Nach jedem Meilenstein: **committen** (`git commit -am "Projekt A: M2"`). So kannst du jederzeit zurück, und ich sehe beim Review, wie du vorgegangen bist.

## Hinweise (erst lesen, wenn du feststeckst)

<details>
<summary>M1: Wie prüfe ich das Format "HH:MM"?</summary>

Mit einem regulären Ausdruck: `/^([01]\d|2[0-3]):([0-5]\d)$/`. Die Klammern bilden Gruppen, die du mit `regex.exec(text)` auslesen kannst: `match[1]` sind die Stunden, `match[2]` die Minuten.
</details>

<details>
<summary>M2: Wie speichere ich Services und Barber?</summary>

Für Services eignet sich eine `Map<string, Service>` (schnelles Nachschlagen per ID). Für Barber brauchst du die Reihenfolge (wegen `daySummary`) – ein Array reicht. Speichere Kopien in privaten `#`-Feldern, damit niemand von aussen etwas verändert.
</details>

<details>
<summary>M3: Wie prüfe ich Überschneidungen am elegantesten?</summary>

Schreib eine private Hilfsmethode, z. B. `#findConflict(barberId, date, startMinuten, endMinuten): Appointment | undefined`. Die brauchst du in `book` **und** in `freeSlots` – so steckt die Regel nur an einer Stelle.
</details>

<details>
<summary>M3: Warum vergibt man nach einem Storno nicht einfach die nächste freie Nummer?</summary>

IDs sollen eindeutig bleiben, auch wenn etwas gelöscht wurde. Sonst könnte z. B. eine Bestätigungs-SMS für «T-1» plötzlich zu einem anderen Termin gehören. Ein einfacher Zähler, der nur hochzählt, löst das.
</details>

<details>
<summary>M5: Wie formatiere ich den Betrag?</summary>

Aus Lektion 1: `(rappen / 100).toFixed(2)`. Vielleicht willst du dafür eine kleine Hilfsfunktion schreiben.
</details>

## Anforderungen an deinen Code

Damit ist das Projekt «abgenommen»:

- [ ] Alle Abnahmetests sind grün
- [ ] Mindestens 5 eigene, sinnvolle Tests in `tests/eigene.test.ts`
- [ ] `npx tsc --noEmit -p projekte/projekt-a-terminplaner` zeigt keine Fehler
- [ ] Kein `any`, kein `as` (ausser du kannst begründen, warum es sicher ist – dann mit Kommentar)
- [ ] `npm run projekt-a` gibt einen sinnvollen Tagesplan aus
- [ ] Code mit `npm run format` formatiert

## Bonus (wenn du Lust hast)

- ⭐ **Pausen:** Barber haben eine Mittagspause (z. B. 12:00–13:00), in der nicht gebucht werden kann.
- ⭐ **Wochentage:** Barber arbeiten nur an bestimmten Wochentagen.
- ⭐⭐ **Nach Lektion 8:** Ein interaktives Programm mit `node:readline/promises`, das nach Kundenname, Service und Uhrzeit fragt.
- ⭐⭐ **Nach Lektion 9:** Termine in einer JSON-Datei speichern und beim Start wieder laden.

Bonus-Funktionen dürfen die Abnahmetests nicht brechen. Ergänze für jede einen eigenen Test.

## Review

Wenn du fertig bist (oder bei einem Meilenstein nicht weiterkommst), schick mir deinen Code für ein Review. Wie das geht, steht in [`REVIEW.md`](../../REVIEW.md). Beim Review achte ich besonders auf:

1. **Korrektheit** – auch in Fällen, die die Tests nicht abdecken
2. **Lesbarkeit** – Namen, Funktionslänge, Struktur
3. **Typen** – präzise statt locker, keine unnötigen `as`/`!`
4. **Unveränderlichkeit** – wird irgendwo etwas von aussen veränderbar?
5. **Tests** – prüfen deine eigenen Tests wirklich etwas Wichtiges?

Danach geht es weiter mit [Lektion 7 – Generics](../../lektionen/l07-generics/README.md).
