# Lektion 8 – Asynchrones Programmieren

> ⏱ **ca. 5 Stunden** · Voraussetzung: Lektion 7 · Schwierigkeit: ●●●●○

## Darum geht's

Das ist der **grösste Umdenk-Punkt** gegenüber Java. In Java blockiert ein Datenbankaufruf einfach den Thread, und wenn du Parallelität willst, startest du weitere Threads. JavaScript hat **nur einen Thread**. Trotzdem kann ein Node.js-Server Tausende Anfragen gleichzeitig bedienen – weil er nie wartet, sondern sich «zurückrufen» lässt, wenn ein Ergebnis da ist.

Das Werkzeug dafür ist das **Promise** – und `async`/`await` macht den Code so lesbar, als wäre er synchron. Jeder Netzwerkaufruf, jeder Dateizugriff, jede Datenbankabfrage in TypeScript ist asynchron. Ohne diese Lektion kommst du im Backend und im Frontend nicht weit.

**Nach dieser Lektion kannst du:**

- erklären, wie die Event Loop funktioniert und warum JavaScript trotz einem Thread nicht blockiert
- mit Promises und `async`/`await` arbeiten – inklusive Fehlerbehandlung
- Aufgaben gezielt **parallel** oder **nacheinander** ausführen
- Timeouts, Wiederholungen und begrenzte Parallelität umsetzen
- mit `fetch` HTTP-Anfragen machen und die Antwort typsicher verarbeiten

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Event-Loop-Quiz `beispiele/01-event-loop-quiz.ts` | 15 min |
| 2 | 📖 Lesen | Abschnitte 2–3 | 25 min |
| 3 | 🌐 Doku | javascript.info «Event loop» | 25 min |
| 4 | 📖 Lesen | Abschnitte 4–5 | 30 min |
| 5 | 🌐 Doku | MDN «Using promises» | 30 min |
| 6 | ✍️ Üben | Aufgaben 1–2 | 60 min |
| 7 | 📖 Lesen | Abschnitte 6–7 | 20 min |
| 8 | ✍️ Üben | Aufgaben 3–4 | 75 min |
| 9 | ✅ Abschluss | Selbstcheck | 15 min |

---

## 1. 🧠 Aufwärmen

Öffne `beispiele/01-event-loop-quiz.ts`, lies den Code und schreib dir auf, **in welcher Reihenfolge** die Ausgaben erscheinen. Dann ausführen:

```bash
npx tsx lektionen/l08-async/beispiele/01-event-loop-quiz.ts
```

Wenn deine Vermutung falsch war: perfekt. Lies Abschnitt 2 und versuch es nochmals zu erklären.

---

## 2. Ein Thread, eine Event Loop

```text
   ┌───────────────────────────┐
   │        Call Stack         │  ← hier läuft dein Code, immer nur EINE Sache
   └─────────────┬─────────────┘
                 │ leer?
                 ▼
   ┌───────────────────────────┐
   │   Microtask-Queue         │  ← Promise-Callbacks (.then, nach await)
   │   (wird ZUERST geleert)   │
   └─────────────┬─────────────┘
                 │ leer?
                 ▼
   ┌───────────────────────────┐
   │   Task-Queue              │  ← setTimeout, I/O fertig, Netzwerk-Antwort …
   └───────────────────────────┘

   Im Hintergrund (Betriebssystem / libuv): Timer, Netzwerk, Dateien
```

1. Dein Code läuft von oben nach unten auf dem **Call Stack**.
2. Rufst du etwas Langsames auf (`setTimeout`, `fetch`, Datei lesen), wird es **im Hintergrund** erledigt. Dein Code läuft sofort weiter.
3. Ist das Ergebnis da, kommt ein Callback in eine **Queue**.
4. Wenn der Call Stack leer ist, holt die **Event Loop** den nächsten Callback und führt ihn aus. Microtasks (Promises) haben Vorrang vor Tasks (Timer).

**Die wichtigste Konsequenz:** Rechnest du in JavaScript lange (z. B. eine Schleife über 10 Milliarden Elemente), ist **alles** blockiert – keine anderen Anfragen, keine Timer, im Browser keine Klicks. Warten ist kein Problem, Rechnen schon.

### Vergleich mit Java

| | Java (klassisch) | JavaScript / Node.js |
|---|---|---|
| Parallelität | mehrere Threads | ein Thread + Event Loop |
| Warten auf I/O | blockiert den Thread | blockiert nie – Callback später |
| Gleichzeitige Anfragen | Thread pro Anfrage (Thread-Pool) | alle im selben Thread, verschachtelt |
| Race Conditions | ja (synchronized, Locks …) | kaum – Code wird nie mitten in einer Funktion unterbrochen (nur bei `await`) |
| Rechenintensives | gut verteilbar auf Kerne | blockiert – dafür gibt es *Worker Threads* |

> 🌐 **Jetzt in der Doku lesen (25 min):** [javascript.info: Event loop: microtasks and macrotasks](https://javascript.info/event-loop) – mit schönen Diagrammen. Danach das Quiz von Abschnitt 1 nochmals erklären.

## 3. Von Callbacks zu Promises

Früher (und in alten Node-APIs) bekamst du das Ergebnis über einen **Callback**:

```ts
readFile("config.json", (error, data) => {
  if (error) { … }
  parse(data, (error, config) => {
    if (error) { … }
    connect(config, (error, db) => { … });   // «Callback Hell» 😵
  });
});
```

Ein **Promise** ist ein Objekt, das ein *zukünftiges* Ergebnis repräsentiert – wie `CompletableFuture<T>` in Java. Es ist in einem von drei Zuständen:

```text
            ┌──▶ fulfilled (mit Wert)    → .then(value => …)
 pending ───┤
            └──▶ rejected (mit Fehler)   → .catch(error => …)
```

```ts
const promise: Promise<string> = fetchUserName(42);
promise
  .then((name) => name.toUpperCase())    // wie thenApply
  .then((upper) => console.log(upper))   // wie thenAccept
  .catch((error) => console.error(error)) // wie exceptionally
  .finally(() => console.log("fertig"));
```

Ein Promise selbst bauen (z. B. um alten Callback-Code einzupacken):

```ts
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

---

## 4. `async` / `await`

`async`/`await` ist «syntaktischer Zucker» über Promises. Der Code liest sich wie synchroner Java-Code:

```ts
async function loadDashboard(): Promise<string> {
  try {
    const user = await fetchUser(42);           // wartet, ohne den Thread zu blockieren
    const bookings = await fetchBookings(user.id);
    return `${user.name}: ${bookings.length} Termine`;
  } catch (error) {
    return "Konnte nicht laden";
  }
}
```

**Regeln:**

- Eine `async`-Funktion gibt **immer** ein Promise zurück. `return "x"` wird zu `Promise<string>`.
- `await` geht nur in `async`-Funktionen – und auf oberster Ebene eines ES-Moduls (*Top-Level Await*).
- `await` «pausiert» nur die **aktuelle Funktion**. Alles andere läuft weiter.
- Ein `throw` in einer `async`-Funktion wird zu einem *rejected* Promise. Ein rejected Promise wird bei `await` zu einem `throw`. Darum funktioniert `try`/`catch` ganz normal.

### ⚠️ Die häufigsten Fehler

```ts
// 1. await vergessen – fetchUser liefert ein Promise, kein User!
const user = fetchUser(42);
console.log(user.name);        // TS-Fehler: Property 'name' does not exist on type 'Promise<User>'

// 2. Fehler eines nicht abgewarteten Promise gehen verloren («floating promise»)
saveToDatabase(data);          // kein await → Fehler wird nirgends gefangen
// → in Node.js beendet ein unbehandelter Fehler sogar den Prozess!

// 3. await in forEach funktioniert nicht wie erwartet
items.forEach(async (item) => { await save(item); });   // wartet NICHT
for (const item of items) { await save(item); }          // ✅ wartet auf jedes
```

Fehler 1 fängt TypeScript ab. Für Fehler 2 gibt es die ESLint-Regel `@typescript-eslint/no-floating-promises` (Lektion 9).

## 5. Nacheinander oder parallel?

```ts
// Nacheinander: 3 × 1 s = 3 s
const a = await load("a");
const b = await load("b");
const c = await load("c");

// Parallel: alle starten sofort, ~1 s
const [a2, b2, c2] = await Promise.all([load("a"), load("b"), load("c")]);
```

Der Trick: `load("a")` **startet** die Arbeit sofort und liefert ein Promise. Erst `await` wartet. Wenn du die Promises zuerst alle erzeugst und dann gemeinsam abwartest, laufen sie gleichzeitig.

| Funktion | Ergebnis | Bei Fehlern | Java-Pendant |
|----------|----------|-------------|--------------|
| `Promise.all(ps)` | alle Werte (gleiche Reihenfolge) | bricht beim **ersten** Fehler ab | `CompletableFuture.allOf` |
| `Promise.allSettled(ps)` | `{ status, value \| reason }` für jedes | sammelt alle, wirft nie | – |
| `Promise.race(ps)` | das **erste fertige** (Erfolg oder Fehler) | erster Fehler gewinnt, wenn er zuerst kommt | – |
| `Promise.any(ps)` | der **erste Erfolg** | nur wenn **alle** scheitern (`AggregateError`) | `anyOf` (ähnlich) |

**Faustregel:** Unabhängige Aufgaben → `Promise.all`. Wenn ein Schritt das Ergebnis des vorherigen braucht → nacheinander mit `await`.

> 🌐 **Jetzt in der Doku lesen (30 min):** [MDN: Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) – bis einschliesslich «Composition». Den Abschnitt über «Timing» überspringst du – das hast du in Abschnitt 2 schon gelernt.

> ✍️ **Jetzt Aufgaben 1 und 2.**

---

## 6. Timeouts und Abbruch

Promises lassen sich nicht «von aussen» abbrechen. Dafür gibt es den `AbortController`, den `fetch` und viele Node-APIs verstehen:

```ts
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);          // nach 5 s abbrechen
const response = await fetch(url, { signal: controller.signal });

// Kurzform:
const response2 = await fetch(url, { signal: AbortSignal.timeout(5000) });
```

## 7. `fetch` – HTTP-Anfragen

`fetch` ist in Node.js (ab 18) und in jedem Browser eingebaut:

```ts
const response = await fetch("https://api.example.com/services");

if (!response.ok) {                              // ⚠️ fetch wirft NICHT bei 404 oder 500!
  throw new Error(`HTTP ${response.status}`);
}

const data: unknown = await response.json();     // json() liefert Promise<any> – wir machen unknown daraus
```

Drei wichtige Punkte:

1. `fetch` wirft nur bei **Netzwerkfehlern** (Server nicht erreichbar). Ein `404` oder `500` ist aus Sicht von `fetch` eine gültige Antwort. Du musst `response.ok` selbst prüfen.
2. `response.json()` ist ebenfalls asynchron (der Body wird gestreamt).
3. Was vom Server kommt, ist **ungeprüft**. Typisiere es als `unknown` und prüfe es (Lektion 2 und 5) – oder verwende eine Validierungsbibliothek wie Zod (Lektion 11).

```ts
// POST mit JSON
await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ serviceId: "s1", start: "2026-11-20T10:00" }),
});
```

### Testbar bleiben: Abhängigkeiten injizieren

In den Aufgaben übergibst du `fetch` und `sleep` als Parameter (mit Default). So können die Tests eine **falsche** Version einschleusen – ohne echtes Netzwerk und ohne echtes Warten. Das ist dasselbe Prinzip wie die Uhr im Cache aus Lektion 7 und wie Mocking mit Mockito in Java.

---

## 8. ✍️ Übungen

```bash
npm run test:watch -- l08
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-promises.ts` | Promises erzeugen, Callbacks einpacken | ★★☆ |
| 2 | `02-parallel.ts` | `Promise.all`, `allSettled`, `any`, nacheinander vs. parallel | ★★☆ |
| 3 | `03-retry-timeout.ts` | Wiederholen mit Backoff, Timeout, begrenzte Parallelität | ★★★ |
| 4 | `04-fetch.ts` | `fetch`, HTTP-Fehler, unbekannte JSON-Daten prüfen | ★★☆ |

**Hinweis:** In `async`-Tests prüft man mit `await expect(promise).rejects.toThrow(...)`, ob ein Promise fehlschlägt. Das `await` davor ist wichtig – ohne wartet der Test nicht.

> 🔍 **Recherche-Auftrag:** Was ist `Promise.withResolvers()`? Wann ist es praktischer als `new Promise((resolve, reject) => …)`? ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers))

---

## 9. ✅ Selbstcheck

<details>
<summary>1. Was wird zuerst ausgeführt: ein <code>setTimeout(fn, 0)</code> oder ein <code>Promise.resolve().then(fn)</code>?</summary>

Das Promise. Promise-Callbacks sind Microtasks, die geleert werden, bevor die Event Loop den nächsten Task (Timer) holt.
</details>

<details>
<summary>2. Warum blockiert <code>await sleep(1000)</code> den Server nicht, eine Schleife mit 10 Milliarden Durchläufen aber schon?</summary>

`await` gibt die Kontrolle an die Event Loop zurück, die in der Zwischenzeit anderes erledigt. Eine Schleife belegt den einzigen Thread, bis sie fertig ist.
</details>

<details>
<summary>3. Wie lädst du drei unabhängige Ressourcen gleichzeitig?</summary>

`const [a, b, c] = await Promise.all([loadA(), loadB(), loadC()]);`
</details>

<details>
<summary>4. Wirft <code>fetch</code> bei einem 404?</summary>

Nein. Nur bei Netzwerkfehlern. Den HTTP-Status musst du selbst über `response.ok` bzw. `response.status` prüfen.
</details>

<details>
<summary>5. Was ist falsch an <code>items.forEach(async (i) => await save(i))</code>?</summary>

`forEach` wartet nicht auf die zurückgegebenen Promises. Die Saves laufen unkontrolliert parallel, und der Code danach läuft weiter, bevor sie fertig sind. Fehler gehen verloren. Lösung: `for...of` mit `await` oder `Promise.all(items.map(save))`.
</details>

## 10. Weiterführend (optional)

- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Node.js: The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) – detaillierter, Node-spezifisch
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [javascript.info: Promises, async/await](https://javascript.info/async) – ganzes Kapitel mit Übungen

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l08` sind grün
- [ ] Ich kann das Event-Loop-Quiz erklären, ohne es auszuführen
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 9 – Module, npm und Tooling](../l09-module-tooling/README.md)
