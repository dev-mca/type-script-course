# Lektion 3 – Funktionen, Callbacks und Closures

> ⏱ **ca. 3–4 Stunden** · Voraussetzung: Lektion 2 · Schwierigkeit: ●●●○○

## Darum geht's

In Java leben Funktionen immer in einer Klasse, und Lambdas brauchen ein *funktionales Interface* (`Function<T, R>`, `Runnable`, `Consumer<T>` …). In TypeScript sind **Funktionen ganz normale Werte**: Du kannst sie in Variablen speichern, als Argument übergeben, zurückgeben und in Objekte packen – ohne Interface drumherum.

Das ist der Kern des «Scripting-Denkens», das sich von Java am meisten unterscheidet. Wenn du diese Lektion verstanden hast, wirst du Code in React, Node.js und überall sonst viel leichter lesen.

**Nach dieser Lektion kannst du:**

- Funktionen mit optionalen, Default- und Rest-Parametern schreiben
- Funktionstypen ausdrücken und Callbacks typsicher übergeben
- Higher-Order Functions schreiben (Funktionen, die Funktionen annehmen oder zurückgeben)
- erklären, was eine Closure ist, und sie gezielt einsetzen

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Java-Lambda übersetzen (Abschnitt 1) | 10 min |
| 2 | 📖 Lesen | Abschnitte 2–4 | 25 min |
| 3 | ▶️ Ausprobieren | `beispiele/01-funktionen-als-werte.ts` | 15 min |
| 4 | ✍️ Üben | Aufgaben 1–2 | 40 min |
| 5 | 📖 Lesen | Abschnitt 5 (Closures) | 20 min |
| 6 | 🌐 Doku | MDN «Closures» | 20 min |
| 7 | ▶️ Ausprobieren | `beispiele/02-closures.ts` | 15 min |
| 8 | ✍️ Üben | Aufgaben 3–4 | 60 min |
| 9 | 📖 Lesen | Abschnitt 6 (`this`) + Selbstcheck | 20 min |

---

## 1. 🧠 Aufwärmen

So sieht ein Callback in Java aus:

```java
public static List<Integer> applyToAll(List<Integer> numbers, Function<Integer, Integer> f) {
    List<Integer> result = new ArrayList<>();
    for (Integer n : numbers) result.add(f.apply(n));
    return result;
}
applyToAll(List.of(1, 2, 3), x -> x * 2);
```

Überlege kurz: Was davon brauchst du in TypeScript vermutlich *nicht*? Dann lies weiter.

<details>
<summary>Die TypeScript-Version</summary>

```ts
function applyToAll(numbers: number[], f: (n: number) => number): number[] {
  const result: number[] = [];
  for (const n of numbers) result.push(f(n));   // kein .apply() – einfach aufrufen
  return result;
}
applyToAll([1, 2, 3], (x) => x * 2);
```

Keine Klasse, kein `Function`-Interface, kein `.apply()`, kein Boxing (`Integer`). Der Parametertyp `(n: number) => number` beschreibt direkt die Form der Funktion.
</details>

---

## 2. Drei Arten, eine Funktion zu schreiben

```ts
// 1. Function Declaration – klassisch, wird «gehoisted» (ist schon vor der Definition aufrufbar)
function add(a: number, b: number): number {
  return a + b;
}

// 2. Arrow Function – der moderne Standard für kurze Funktionen und Callbacks
const multiply = (a: number, b: number): number => a * b;    // ein Ausdruck → kein return nötig
const divide = (a: number, b: number): number => {           // mit Block → return nötig
  if (b === 0) throw new Error("Division durch 0");
  return a / b;
};

// 3. Function Expression – siehst du in älterem Code
const subtract = function (a: number, b: number): number {
  return a - b;
};
```

**Wann was?** Viele Teams verwenden `function` für benannte, exportierte Funktionen und Arrow Functions für Callbacks und kurze Helfer. Beides ist völlig in Ordnung.

> ⚠️ **Stolperfalle:** Gibt eine Arrow Function ein Objekt zurück, braucht es Klammern:
> `const makeUser = (name: string) => ({ name });` – ohne `( )` würde `{` als Funktionsblock gelesen.

## 3. Parameter: optional, Default und Rest

```ts
function greet(name: string, greeting = "Hallo"): string {   // Default-Wert
  return `${greeting} ${name}`;
}
greet("Ada");             // "Hallo Ada"
greet("Ada", "Grüezi");   // "Grüezi Ada"

function formatName(first: string, last?: string): string {   // optional → string | undefined
  return last ? `${first} ${last}` : first;
}

function sum(...numbers: number[]): number {   // Rest-Parameter = varargs in Java (int... numbers)
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}
sum(1, 2, 3);           // 6
sum(...[4, 5, 6]);      // 15 – Spread: Array auf Argumente verteilen
```

**Überladen wie in Java gibt es nicht.** Es kann nur *eine* Implementierung pro Name geben. Statt mehrerer Varianten verwendet man optionale Parameter, Default-Werte oder Union-Typen (`id: string | number`). TypeScript kennt zwar «Overload-Signaturen», die braucht man aber selten (Lektion 10).

> 💡 **Objekt-Parameter statt vieler Argumente:** Ab etwa drei Parametern übergibt man in TypeScript gerne ein Objekt. So ist jeder Aufruf selbsterklärend:
> ```ts
> function createUser({ name, age, admin = false }: { name: string; age: number; admin?: boolean }) { … }
> createUser({ name: "Melih", age: 25 });
> ```
> Das `{ name, age, admin = false }` ist *Destructuring* – mehr dazu in Lektion 4.

## 4. Funktionen sind Werte

### Funktionstypen

```ts
type Operation = (a: number, b: number) => number;

const plus: Operation = (a, b) => a + b;   // a und b werden aus dem Typ hergeleitet!
const ops: Record<string, Operation> = { plus, minus: (a, b) => a - b };
ops["plus"]?.(2, 3);  // 5 – ?.() ruft nur auf, wenn die Funktion existiert
```

### Higher-Order Functions

Eine Funktion, die eine Funktion **annimmt** oder **zurückgibt**:

```ts
// nimmt eine Funktion an
function repeat(times: number, action: (i: number) => void): void {
  for (let i = 0; i < times; i++) action(i);
}
repeat(3, (i) => console.log(`Durchgang ${i}`));

// gibt eine Funktion zurück
function multiplier(factor: number): (n: number) => number {
  return (n) => n * factor;
}
const double = multiplier(2);
double(21);   // 42
```

### Übersetzungstabelle Java → TypeScript

| Java | TypeScript |
|------|------------|
| `Function<T, R>` | `(value: T) => R` |
| `BiFunction<A, B, R>` | `(a: A, b: B) => R` |
| `Consumer<T>` | `(value: T) => void` |
| `Supplier<T>` | `() => T` |
| `Predicate<T>` | `(value: T) => boolean` |
| `Runnable` | `() => void` |
| `f.apply(x)`, `c.accept(x)`, `r.run()` | `f(x)`, `c(x)`, `r()` |
| `Integer::parseInt` (Methodenreferenz) | `Number` oder `(s) => parseInt(s, 10)` |

> 💡 **`void` bei Callbacks:** Ist ein Callback als `() => void` typisiert, darfst du trotzdem eine Funktion übergeben, die etwas zurückgibt – der Wert wird einfach ignoriert. Darum funktioniert z. B. `[1, 2].forEach((n) => list.push(n))`, obwohl `push` eine Zahl zurückgibt.

---

## 5. Closures – Funktionen mit Gedächtnis

Eine **Closure** ist eine Funktion, die sich an die Variablen aus ihrer Umgebung erinnert – auch nachdem diese Umgebung längst «vorbei» ist.

```ts
function createCounter() {
  let count = 0;                 // lokale Variable von createCounter
  return () => {
    count++;                     // die zurückgegebene Funktion «sieht» count weiterhin
    return count;
  };
}

const counterA = createCounter();
const counterB = createCounter();
counterA();  // 1
counterA();  // 2
counterB();  // 1  ← jeder Aufruf von createCounter hat sein eigenes count
```

Das Faszinierende: `count` ist von aussen **nicht erreichbar**. Es ist so privat wie ein `private`-Feld in Java – nur ohne Klasse. Genau so wurden in JavaScript jahrelang «private» Daten umgesetzt, und viele Bibliotheken (auch React mit seinen Hooks) basieren auf diesem Prinzip.

### Der Unterschied zu Java-Lambdas

In Java darf ein Lambda nur auf *effectively final* Variablen zugreifen:

```java
int count = 0;
Runnable r = () -> count++;   // ❌ Compilerfehler in Java
```

In JavaScript/TypeScript ist das erlaubt. Die Closure greift auf **die Variable selbst** zu, nicht auf eine Kopie des Werts. Das ist mächtig, aber auch eine Fehlerquelle:

```ts
let message = "Hallo";
const say = () => console.log(message);
message = "Tschüss";
say();   // "Tschüss" – nicht "Hallo"!
```

> 🌐 **Jetzt in der Doku lesen (20 min):** [MDN: Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) – bis einschliesslich «Emulating private methods with closures». Den Abschnitt über `var` in Schleifen kannst du überfliegen (wir verwenden kein `var`).

---

## 6. `this` – nur ganz kurz

In Java ist `this` immer das aktuelle Objekt. In JavaScript hängt `this` in normalen Funktionen davon ab, **wie** die Funktion aufgerufen wird. Das führt zu einem klassischen Fehler:

```ts
class Timer {
  seconds = 0;
  tick() { this.seconds++; }
}
const timer = new Timer();
const fn = timer.tick;
fn();   // 💥 TypeError: this ist undefined – die Methode wurde vom Objekt «abgelöst»
```

**Arrow Functions haben kein eigenes `this`** – sie übernehmen es aus der Umgebung. Darum gilt:

- Übergibst du eine Methode als Callback, wickle sie in eine Arrow Function: `button.onClick(() => timer.tick())`
- Oder definiere die Methode als Arrow-Function-Feld: `tick = () => { this.seconds++; };`

Mehr brauchst du im Moment nicht zu wissen. Wenn dir irgendwo «`this` is undefined» begegnet, weisst du jetzt, wo du suchen musst.

> 🌐 **Doku (Nachschlagen):** [Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) – lies die Abschnitte «Function Type Expressions», «Optional Parameters» und «Rest Parameters and Arguments».

---

## 7. ✍️ Übungen

```bash
npm run test:watch -- l03
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-parameter.ts` | Default-, optionale und Rest-Parameter | ★☆☆ |
| 2 | `02-higher-order.ts` | Funktionen als Argumente und Rückgabewerte | ★★☆ |
| 3 | `03-closures.ts` | Counter, `once`, `memoize` | ★★☆ |
| 4 | `04-event-bus.ts` | Callbacks registrieren, aufrufen und abmelden | ★★★ |

In den Tests von Aufgabe 3 und 4 siehst du `vi.fn()`. Das ist eine **Mock-Funktion** (wie bei Mockito): Sie merkt sich, wie oft und womit sie aufgerufen wurde. So kann der Test prüfen, dass dein Code eine Funktion z. B. *nur einmal* aufruft.

> 🔍 **Recherche-Auftrag:** Schau in der [Vitest-Doku zu `vi.fn`](https://vitest.dev/api/vi.html#vi-fn) nach, was `toHaveBeenCalledWith` prüft. Du siehst es in den Tests von Aufgabe 4.

---

## 8. ✅ Selbstcheck

<details>
<summary>1. Wie schreibst du den Typ «Funktion, die einen String nimmt und eine Zahl zurückgibt»?</summary>

`(s: string) => number` – der Parametername ist nur Dokumentation.
</details>

<details>
<summary>2. Was ist eine Closure?</summary>

Eine Funktion, die Zugriff auf Variablen aus ihrem Entstehungs-Gültigkeitsbereich behält – auch nachdem die äussere Funktion beendet ist.
</details>

<details>
<summary>3. Was gibt dieser Code aus? <code>const fs = []; for (let i = 0; i < 3; i++) fs.push(() => i); console.log(fs.map(f => f()));</code></summary>

`[0, 1, 2]`. Mit `let` bekommt jeder Schleifendurchlauf eine eigene Variable `i`. Mit dem alten `var` wäre es `[3, 3, 3]` – einer der Gründe, warum man `var` nicht mehr verwendet.
</details>

<details>
<summary>4. Warum verliert <code>const fn = obj.method; fn();</code> sein <code>this</code>?</summary>

Weil `this` in normalen Funktionen beim Aufruf bestimmt wird. `fn()` wird ohne Objekt davor aufgerufen, also ist `this` `undefined`. Lösung: `() => obj.method()` oder Arrow-Function-Felder.
</details>

<details>
<summary>5. Wie viele Implementierungen einer Funktion mit demselben Namen kann es in TypeScript geben?</summary>

Genau eine. Statt Überladen verwendet man optionale Parameter, Defaults oder Union-Typen.
</details>

## 9. Weiterführend (optional)

- [javascript.info: Variable scope, closure](https://javascript.info/closure) – sehr anschauliche Erklärung mit Diagrammen, wie Closures intern funktionieren («Lexical Environment»)
- [MDN: Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) – alle Unterschiede zu normalen Funktionen

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l03` sind grün
- [ ] Ich kann einem Kollegen erklären, was `createCounter` macht und warum `count` privat ist
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 4 – Objekte und Klassen](../l04-objekte-klassen/README.md)
