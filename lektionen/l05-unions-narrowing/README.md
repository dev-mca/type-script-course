# Lektion 5 – Union Types und Narrowing

> ⏱ **ca. 3–4 Stunden** · Voraussetzung: Lektion 4 · Schwierigkeit: ●●●○○

## Darum geht's

Das ist eine der wichtigsten Lektionen des Kurses. **Union Types** (`A | B`) und **Narrowing** (den Typ durch Prüfungen eingrenzen) sind das Herz von TypeScript. Mit **Discriminated Unions** modellierst du Zustände so präzise, dass ungültige Kombinationen gar nicht erst kompilieren.

Du kennst das Prinzip schon aus Java 21: `sealed interface` + `record` + Pattern Matching im `switch`. In TypeScript ist das Muster leichter zu schreiben und wird **überall** verwendet – in React-State, API-Antworten, Redux-Actions, Fehlerbehandlung.

**Nach dieser Lektion kannst du:**

- Werte mit `typeof`, `in`, `instanceof` und Gleichheit eingrenzen
- Zustände mit Discriminated Unions modellieren und vollständig behandeln (`never`-Check)
- eigene Type Guards (`x is Foo`) schreiben
- Fehler in TypeScript richtig behandeln und das `Result`-Muster einsetzen

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Java-Code lesen (Abschnitt 1) | 10 min |
| 2 | 📖 Lesen | Abschnitte 2–3 | 20 min |
| 3 | 🌐 Doku | Handbook «Narrowing» (ganz!) | 40 min |
| 4 | ✍️ Üben | Aufgabe 1 | 25 min |
| 5 | 📖 Lesen | Abschnitte 4–5 | 25 min |
| 6 | ✍️ Üben | Aufgaben 2–3 + Compiler-Experiment | 60 min |
| 7 | 📖 Lesen | Abschnitt 6 (Fehler) | 15 min |
| 8 | ✍️ Üben | Aufgabe 4 | 30 min |
| 9 | ✅ Abschluss | Selbstcheck | 10 min |

---

## 1. 🧠 Aufwärmen: Das kennst du aus Java

```java
sealed interface Payment permits Cash, Card, Twint {}
record Cash(int amount) implements Payment {}
record Card(int amount, String last4) implements Payment {}
record Twint(int amount, String phone) implements Payment {}

String describe(Payment p) {
    return switch (p) {
        case Cash c  -> "Bar: " + c.amount();
        case Card c  -> "Karte ****" + c.last4();
        case Twint t -> "TWINT " + t.phone();
    };   // kein default nötig – der Compiler weiss, dass alle Fälle abgedeckt sind
}
```

Überlege: Wie viele Dateien/Typen sind das in Java? Und was passiert, wenn jemand `record Crypto(...)` hinzufügt?

<details>
<summary>Die TypeScript-Version</summary>

```ts
type Payment =
  | { kind: "cash"; amount: number }
  | { kind: "card"; amount: number; last4: string }
  | { kind: "twint"; amount: number; phone: string };

function describe(p: Payment): string {
  switch (p.kind) {
    case "cash":  return `Bar: ${p.amount}`;
    case "card":  return `Karte ****${p.last4}`;   // hier weiss TS: p hat last4
    case "twint": return `TWINT ${p.phone}`;
  }
}
```

Ein einziger Typ, drei Zeilen. Kommt eine neue Variante dazu, meldet der Compiler jede Stelle, die sie nicht behandelt (siehe Abschnitt 5). Genau wie bei `sealed` in Java.
</details>

---

## 2. Union Types

```ts
type Id = string | number;

function printId(id: Id) {
  console.log(id.toUpperCase());   // ❌ Property 'toUpperCase' does not exist on type 'number'
}
```

Bei einem Union-Typ darfst du nur verwenden, was **alle** Varianten gemeinsam haben. Um eine bestimmte Variante zu nutzen, musst du sie zuerst **eingrenzen** (*narrowing*).

## 3. Narrowing – den Typ eingrenzen

TypeScript verfolgt, welche Prüfungen du gemacht hast, und grenzt den Typ in jedem Zweig ein. Das nennt man *Control Flow Analysis*.

```ts
function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());   // hier: string
  } else {
    console.log(id.toFixed(0));      // hier: number
  }
}
```

### Die Werkzeuge

| Prüfung | Grenzt ein auf | Beispiel |
|---------|---------------|----------|
| `typeof x === "string"` | Primitive (`string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`) | `typeof x === "number"` |
| Truthiness `if (x)` | entfernt `null`, `undefined` (und `""`, `0` …!) | `if (user) user.name` |
| Gleichheit `===` | Literal-Typen, `null` | `if (status === "done")` |
| `"prop" in x` | Objekte mit dieser Eigenschaft | `if ("radius" in shape)` |
| `x instanceof Klasse` | Klasseninstanzen (`Date`, `Error`, eigene Klassen) | `if (e instanceof Error)` |
| `Array.isArray(x)` | Arrays | `if (Array.isArray(x))` |
| Eigener Type Guard | was du definierst | siehe unten |

### Frühes Return – der lesbarste Stil

```ts
function getLength(value: string | null | undefined): number {
  if (value == null) return 0;   // Ausnahme: "== null" prüft null UND undefined (einzige sinnvolle Nutzung von ==)
  return value.length;           // ab hier: string
}
```

> 💡 Manche Teams erlauben `x == null` als einzige Ausnahme zur «nie `==`»-Regel, weil es genau `null` und `undefined` abdeckt. In diesem Kurs schreiben wir es aber meistens explizit aus.

### Eigene Type Guards

Manchmal ist die Prüfung zu komplex für ein `typeof`. Dann schreibst du eine Funktion mit dem Rückgabetyp `x is Typ`:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) animal.swim();   // TS vertraut deinem Type Guard
  else animal.fly();
}
```

**Achtung:** TypeScript prüft nicht, ob dein Type Guard *stimmt*. Wenn du `return true` schreibst, glaubt der Compiler dir. Ein Type Guard ist ein Versprechen.

> 🌐 **Jetzt in der Doku lesen (40 min):** [Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) – **ganz**. Das ist das wichtigste Kapitel des Handbooks. Probier die Beispiele direkt im [Playground](https://www.typescriptlang.org/play) aus.

> ✍️ **Jetzt Aufgabe 1** (`uebungen/01-narrowing.ts`).

---

## 4. Discriminated Unions

Eine *Discriminated Union* (auch *Tagged Union*) ist eine Union von Objekttypen, die alle ein gemeinsames Feld mit einem **Literal-Typ** haben – den *Diskriminator* (oft `kind`, `type` oder `status`).

```ts
type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: LoadState): string {
  switch (state.status) {
    case "idle":    return "Noch nichts geladen";
    case "loading": return "Lädt …";
    case "success": return `${state.data.length} Einträge`;   // data existiert nur hier
    case "error":   return `Fehler: ${state.message}`;         // message existiert nur hier
  }
}
```

### Warum das so mächtig ist: Unmögliche Zustände unmöglich machen

Vergleiche mit dem «Java-Stil» mit lauter optionalen Feldern:

```ts
// ❌ Schlecht: Was bedeutet { loading: true, data: [...], error: "x" }?
type BadState = { loading: boolean; data?: string[]; error?: string };
```

Dieser Typ erlaubt 8 Kombinationen, von denen die meisten keinen Sinn ergeben. Die Discriminated Union erlaubt **genau die 4 gültigen**. Du kannst nicht vergessen, einen Fehler zu behandeln, und du kannst nicht auf `data` zugreifen, bevor geprüft ist, dass es da ist.

## 5. Vollständigkeit prüfen mit `never`

Was passiert, wenn jemand später `{ status: "cancelled" }` zur Union hinzufügt? Damit der Compiler alle `switch`-Stellen meldet, verwendet man diesen Trick:

```ts
function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}

function render(state: LoadState): string {
  switch (state.status) {
    case "idle":    return "…";
    case "loading": return "…";
    case "success": return "…";
    case "error":   return "…";
    default:        return assertNever(state);   // state ist hier "never" – wenn alle Fälle behandelt sind
  }
}
```

Sind alle Fälle behandelt, ist `state` im `default`-Zweig vom Typ `never` (es kann nichts mehr übrig sein). Fehlt ein Fall, ist `state` z. B. `{ status: "cancelled" }` – und das passt nicht auf den Parameter `never`. **Compilerfehler genau an der richtigen Stelle.** Zusätzlich wirft die Funktion zur Laufzeit, falls doch einmal ungültige Daten (z. B. aus JSON) ankommen.

> 🔧 **Compiler-Experiment (nach Aufgabe 2):** Füge in `uebungen/02-formen-union.ts` die Variante `{ kind: "square"; side: number }` zur Union hinzu. Speichere – und schau, welche Stellen IntelliJ jetzt rot markiert. Implementiere die neuen Fälle, bis wieder alles grün ist. (Die Tests kennen `square` nicht, sie bleiben trotzdem grün.)

---

## 6. Fehlerbehandlung

### Exceptions in JavaScript

```ts
try {
  riskyOperation();
} catch (error) {          // error ist vom Typ unknown!
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unbekannter Fehler", error);
  }
} finally {
  cleanup();
}
```

Unterschiede zu Java:

- **Keine checked exceptions.** Es gibt kein `throws` in der Signatur. Du siehst einer Funktion nicht an, ob sie wirft.
- **Man kann alles werfen**: `throw "Hilfe"` oder `throw 42` ist erlaubt (aber schlechter Stil). Darum ist `error` im `catch` vom Typ `unknown`.
- **Nur ein `catch`-Block.** Statt `catch (IOException e) … catch (SQLException e)` prüfst du mit `instanceof` im Block.

### Eigene Fehlerklassen

```ts
class ValidationError extends Error {
  constructor(readonly field: string, message: string) {
    super(message);
    this.name = "ValidationError";   // sonst heisst er in Logs nur "Error"
  }
}
```

### Das `Result`-Muster

Weil man Exceptions in TypeScript nicht in der Signatur sieht, verwenden viele Teams für **erwartbare** Fehler (ungültige Eingabe, nicht gefunden …) einen Rückgabewert statt einer Exception:

```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parseAge(input: string): Result<number> {
  const age = Number(input);
  if (!Number.isInteger(age) || age < 0) return { ok: false, error: `Ungültiges Alter: ${input}` };
  return { ok: true, value: age };
}

const result = parseAge("42");
if (result.ok) {
  console.log(result.value + 1);   // value nur hier verfügbar
} else {
  console.log(result.error);       // error nur hier verfügbar
}
```

Das ist wieder eine Discriminated Union (Diskriminator: `ok`). Der Aufrufer **muss** sich mit dem Fehlerfall befassen, bevor er an den Wert kommt. Faustregel: **Exceptions für Programmierfehler und Unvorhergesehenes, `Result` für erwartbare Fehler.**

---

## 7. ✍️ Übungen

```bash
npm run test:watch -- l05
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-narrowing.ts` | `typeof`, `in`, `instanceof`, Type Guards | ★★☆ |
| 2 | `02-formen-union.ts` | Discriminated Union, `assertNever` | ★★☆ |
| 3 | `03-bestellung.ts` | Zustandsmaschine mit Discriminated Unions + `Result` | ★★★ |
| 4 | `04-fehler.ts` | `unknown` im catch, eigene Fehlerklasse, `Result` | ★★☆ |

> 🔍 **Recherche-Auftrag:** Neben Type Guards gibt es *Assertion Functions*. Sie sind am besten in den [TypeScript 3.7 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) erklärt. Finde heraus, was der Rückgabetyp `asserts value is string` bedeutet und wie er sich von `value is string` unterscheidet. Wann würdest du welchen verwenden?

---

## 8. ✅ Selbstcheck

<details>
<summary>1. Was ist ein Diskriminator, und welche Eigenschaft muss sein Typ haben?</summary>

Ein gemeinsames Feld aller Varianten einer Union (z. B. `kind`), dessen Typ in jeder Variante ein anderer **Literal-Typ** ist (`"circle"`, `"rectangle"` …). Anhand dieses Feldes kann TypeScript die Variante eingrenzen.
</details>

<details>
<summary>2. Wie funktioniert der <code>assertNever</code>-Trick?</summary>

Im `default`-Zweig ist der Wert vom Typ `never`, wenn alle Fälle behandelt wurden. Fehlt ein Fall, hat der Wert einen anderen Typ, der nicht an einen `never`-Parameter übergeben werden kann → Compilerfehler.
</details>

<details>
<summary>3. Warum ist <code>error</code> im <code>catch</code> vom Typ <code>unknown</code>?</summary>

Weil in JavaScript jeder beliebige Wert geworfen werden kann – nicht nur `Error`-Objekte.
</details>

<details>
<summary>4. Was ist das Risiko bei einem eigenen Type Guard?</summary>

TypeScript prüft nicht, ob die Implementierung korrekt ist. Liefert der Guard fälschlich `true`, «glaubt» der Compiler einen falschen Typ.
</details>

<details>
<summary>5. Warum ist <code>{ status: "error"; message: string } | { status: "success"; data: T }</code> besser als <code>{ data?: T; error?: string }</code>?</summary>

Die Union erlaubt nur gültige Kombinationen und erzwingt, dass man den Status prüft, bevor man auf `data` oder `message` zugreift. Der zweite Typ erlaubt unsinnige Zustände (beides gesetzt oder keins).
</details>

## 9. Weiterführend (optional)

- [Handbook: Everyday Types – Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) zur Wiederholung
- [Total TypeScript Essentials, Kapitel «Unions, Literals and Narrowing»](https://www.totaltypescript.com/books/total-typescript-essentials)
- Vergleich: [JEP 441 – Pattern Matching for switch](https://openjdk.org/jeps/441) – damit du siehst, wie nah Java und TypeScript sich hier gekommen sind

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l05` sind grün
- [ ] Compiler-Experiment mit `square` gemacht
- [ ] Ich kann den `assertNever`-Trick erklären
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 6 – Arrays und Collections](../l06-arrays-collections/README.md)
