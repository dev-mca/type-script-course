# Lektion 7 – Generics

> ⏱ **ca. 4 Stunden** · Voraussetzung: Lektion 6 (und idealerweise Projekt A) · Schwierigkeit: ●●●●○

## Darum geht's

Generics kennst du aus Java: `List<String>`, `Map<K, V>`, `<T extends Comparable<T>>`. Die gute Nachricht: In TypeScript funktionieren sie **sehr ähnlich** – und an den Stellen, wo sie anders sind, sind sie meistens **einfacher**. Es gibt keine Wildcards (`? extends`, `? super`), kein Boxing (`Integer` vs. `int`) und viel mehr Typ-Inferenz.

Neu ist der Operator `keyof`, mit dem Generics über die *Schlüssel* eines Objekts sprechen können. Das ist in Java nicht möglich und eines der Werkzeuge, mit denen TypeScript-Bibliotheken so präzise Typen liefern.

**Nach dieser Lektion kannst du:**

- generische Funktionen, Typen und Klassen schreiben
- Typparameter mit `extends` einschränken – auch mit `keyof`
- erklären, warum TypeScript keine Wildcards braucht
- eigene generische Datenstrukturen bauen (Stack, Cache, Result)

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Java → TS übersetzen (Abschnitt 1) | 10 min |
| 2 | 📖 Lesen | Abschnitte 2–4 | 30 min |
| 3 | 🌐 Doku | Handbook «Generics» (ganz) | 35 min |
| 4 | ✍️ Üben | Aufgabe 1 | 45 min |
| 5 | 📖 Lesen | Abschnitte 5–6 | 20 min |
| 6 | ✍️ Üben | Aufgaben 2–3 | 60 min |
| 7 | ✍️ Üben | Aufgaben 4–5 | 45 min |
| 8 | ✅ Abschluss | Selbstcheck | 10 min |

---

## 1. 🧠 Aufwärmen

Übersetze im Kopf nach TypeScript:

```java
public static <T extends Comparable<T>> T max(List<T> items) {
    T best = items.get(0);
    for (T item : items) if (item.compareTo(best) > 0) best = item;
    return best;
}
```

<details>
<summary>Eine mögliche TypeScript-Version</summary>

```ts
function max<T>(items: T[], compare: (a: T, b: T) => number): T | undefined {
  let best = items[0];
  for (const item of items) {
    if (best === undefined || compare(item, best) > 0) best = item;
  }
  return best;
}

max([3, 1, 4], (a, b) => a - b);                       // 4
max(["Bern", "Aarau"], (a, b) => a.localeCompare(b));  // "Bern"
```

Unterschiede: Statt eines `Comparable`-Interfaces übergibt man in TypeScript meist eine **Vergleichsfunktion** (wie ein `Comparator`). Und statt bei leerer Liste eine Exception zu werfen, liefert die Funktion `undefined` – das zwingt der Rückgabetyp `T | undefined` den Aufrufer zu behandeln.
</details>

---

## 2. Generische Funktionen

```ts
function first<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);        // T = number → n: number | undefined
const s = first(["a", "b"]);       // T = string
const x = first<string>([]);       // T explizit angeben (selten nötig)
```

TypeScript leitet `T` fast immer aus den Argumenten her. Explizit (`first<string>(...)`) musst du `T` nur angeben, wenn es nichts herzuleiten gibt.

Bei Arrow Functions sieht die Syntax so aus:

```ts
const last = <T>(items: readonly T[]): T | undefined => items.at(-1);
```

### Mehrere Typparameter

```ts
function zip<A, B>(as: readonly A[], bs: readonly B[]): [A, B][] {
  const length = Math.min(as.length, bs.length);
  return Array.from({ length }, (_, i) => [as[i]!, bs[i]!]);
}
zip([1, 2], ["a", "b"]);   // [[1, "a"], [2, "b"]] – Typ: [number, string][]
```

> 💡 Das `!` nach `as[i]` ist der *Non-null-Assertion-Operator*: «Ich weiss, dass das nicht `undefined` ist.» Wegen `noUncheckedIndexedAccess` ist `as[i]` sonst `A | undefined`. Hier ist es sicher, weil `i` immer kleiner als die Länge ist. Verwende `!` sparsam – es ist eine Behauptung ohne Prüfung, wie `as`.

## 3. Einschränkungen mit `extends`

```ts
// T muss eine length-Eigenschaft haben (strukturell!)
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("Hallo", "Welt");     // ✅ string hat length
longest([1, 2], [1, 2, 3]);   // ✅ Arrays haben length
longest(10, 20);              // ❌ number hat kein length
```

Das entspricht `<T extends Comparable<T>>` in Java – mit einem Unterschied: Weil TypeScript strukturell ist, muss `T` kein bestimmtes Interface *implementieren*, sondern nur die **passende Form haben**.

### `keyof` – Generics über Objektschlüssel

`keyof T` ist die Union aller Schlüssel von `T`:

```ts
type User = { name: string; age: number };
type UserKey = keyof User;   // "name" | "age"
```

Kombiniert mit Generics entsteht etwas, das Java nicht kann – eine Funktion, die den **Typ des Werts kennt, der zu einem Schlüssel gehört**:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Melih", age: 25 };
getProperty(user, "name");    // Typ: string
getProperty(user, "age");     // Typ: number
getProperty(user, "email");   // ❌ "email" ist kein Schlüssel von user
```

`T[K]` heisst *Indexed Access Type*: «der Typ des Felds `K` in `T`». IntelliJ bietet bei `getProperty(user, "` sogar die erlaubten Schlüssel zur Autovervollständigung an.

> 🌐 **Jetzt in der Doku lesen (35 min):** [Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) – ganz. Danach [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) (kurz).

> ✍️ **Jetzt Aufgabe 1** (`uebungen/01-funktionen.ts`).

---

## 4. Warum TypeScript keine Wildcards braucht

In Java ist `List<Integer>` **kein** `List<Number>`, obwohl `Integer` ein `Number` ist (Generics sind *invariant*). Darum gibt es Wildcards:

```java
double sum(List<? extends Number> numbers) { … }   // PECS: Producer Extends
void fill(List<? super Integer> target) { … }       // Consumer Super
```

TypeScript vergleicht Typen **strukturell** und ermittelt die Varianz automatisch aus der Verwendung. Meistens schreibst du einfach:

```ts
function sum(numbers: readonly number[]): number { … }
```

Der Trick ist `readonly`: Ein `readonly Dog[]` darf überall dort übergeben werden, wo ein `readonly Animal[]` erwartet wird, weil die Funktion nichts *hineinschreiben* kann. Das ist genau der «Producer»-Fall aus PECS – aber ohne neue Syntax.

> ⚠️ **Ehrlicher Hinweis:** Bei veränderbaren Arrays ist TypeScript absichtlich «zu nachgiebig»: Ein `Dog[]` darf auch an einen `Animal[]`-Parameter übergeben werden, obwohl die Funktion dann eine `Cat` hineinlegen könnte. Das ist eine bewusste Designentscheidung zugunsten der Bequemlichkeit. Mit `readonly` in Parametern bist du auf der sicheren Seite.

## 5. Generische Typen und Klassen

```ts
// Generische Typ-Aliase
type Box<T> = { value: T };
type Pair<A, B = A> = [A, B];             // B hat einen Default
type ApiResponse<T> = { data: T; fetchedAt: string };

// Generische Interfaces
interface Repository<T, Id = string> {
  findById(id: Id): T | undefined;
  save(entity: T): void;
}

// Generische Klassen
class Queue<T> {
  #items: T[] = [];
  enqueue(item: T): void { this.#items.push(item); }
  dequeue(): T | undefined { return this.#items.shift(); }
  get size(): number { return this.#items.length; }
}

const q = new Queue<number>();   // bei leerem Konstruktor muss T angegeben werden
```

### Iterierbar machen: `Symbol.iterator` und Generatoren

Damit `for...of` mit deiner Klasse funktioniert (wie `Iterable<T>` in Java), implementierst du die Methode `[Symbol.iterator]`. Am einfachsten geht das mit einer **Generator-Funktion** (`function*` bzw. `*methode()`), die mit `yield` Werte nacheinander liefert:

```ts
class Range implements Iterable<number> {
  constructor(private from: number, private to: number) {}

  *[Symbol.iterator](): Iterator<number> {
    for (let i = this.from; i <= this.to; i++) {
      yield i;   // pausiert hier und liefert i an die for...of-Schleife
    }
  }
}

for (const n of new Range(1, 3)) console.log(n);   // 1, 2, 3
[...new Range(1, 5)];                              // [1, 2, 3, 4, 5]
```

Das ersetzt die ganze `Iterator`-Klasse mit `hasNext()` und `next()`, die du in Java schreiben müsstest. Probier es in `beispiele/02-iterable.ts` aus.

## 6. Generics in Java und TypeScript – Zusammenfassung

| | Java | TypeScript |
|---|---|---|
| Syntax | `<T>`, `<T extends X>` | gleich |
| Primitive als Typargument | ❌ (`List<int>` geht nicht) | ✅ (`Array<number>`) |
| Wildcards | `? extends`, `? super` | nicht nötig (strukturell; `readonly` für Sicherheit) |
| Typ-Inferenz | eingeschränkt (Diamond, `var`) | sehr umfangreich |
| Typ zur Laufzeit | Type Erasure | Type Erasure (sogar vollständig) |
| `new T()` | ❌ | ❌ (gleicher Grund – T existiert zur Laufzeit nicht) |
| Über Schlüssel abstrahieren | ❌ | ✅ `keyof`, `T[K]` |
| Default-Typparameter | ❌ | ✅ `<T = string>` |

**Faustregel gegen Übertreibung:** Ein Typparameter sollte **mindestens zweimal** vorkommen (z. B. im Parameter und im Rückgabetyp). Kommt `T` nur einmal vor, brauchst du kein Generic – dann reicht `unknown` oder ein konkreter Typ.

---

## 7. ✍️ Übungen

```bash
npm run test:watch -- l07
```

| Nr | Datei | Thema | Prüfung | ★ |
|----|-------|-------|---------|---|
| 1 | `01-funktionen.ts` | generische Hilfsfunktionen, `keyof` | Tests | ★★☆ |
| 2 | `02-stack.ts` | generische Klasse + Iterable | Tests | ★★☆ |
| 3 | `03-result.ts` | generischer `Result<T, E>` mit Helfern | Tests | ★★★ |
| 4 | `04-ttl-cache.ts` | `Map<K, V>`, injizierte Uhr | Tests | ★★☆ |
| 5 | `05-typen.ts` | generische Typen | **Compiler** | ★★☆ |

Aufgabe 5 funktioniert wie die Typ-Aufgabe in Lektion 2: fertig, wenn keine roten Markierungen mehr da sind (`npx tsc --noEmit -p lektionen/l07-generics`). Neu ist `Expect<Equal<A, B>>`: Die Fehlermeldung *«Type 'false' does not satisfy the constraint 'true'»* heisst, dass dein Typ noch nicht **exakt** dem erwarteten entspricht.

Aufgabe 1 hat zudem absichtlich unvollständige Signaturen (`unknown`). Deine Aufgabe ist dort auch, die generische Signatur zu schreiben – solange die Testdatei rote Stellen hat, stimmt sie noch nicht.

> 🔍 **Recherche-Auftrag:** TypeScript hat die Schlüsselwörter `in` und `out` für Typparameter (z. B. `interface Producer<out T>`). Finde in den Release Notes heraus, wofür sie da sind ([TypeScript 4.7: Optional Variance Annotations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)). Vergleiche mit `? extends` / `? super` in Java.

---

## 8. ✅ Selbstcheck

<details>
<summary>1. Was bedeutet <code>&lt;K extends keyof T&gt;</code>?</summary>

`K` muss einer der Schlüssel von `T` sein (bzw. eine Union davon). So kann eine Funktion nur mit gültigen Feldnamen aufgerufen werden.
</details>

<details>
<summary>2. Was ist <code>T[K]</code>?</summary>

Ein *Indexed Access Type*: der Typ des Felds `K` im Typ `T`. Bei `{ name: string }["name"]` ist das `string`.
</details>

<details>
<summary>3. Warum kann man in TypeScript nicht <code>new T()</code> schreiben?</summary>

Weil Typen zur Laufzeit nicht existieren. Man übergibt stattdessen eine Factory-Funktion (`create: () => T`) oder den Konstruktor als Wert.
</details>

<details>
<summary>4. Wie macht man eine eigene Klasse mit <code>for...of</code> iterierbar?</summary>

Man implementiert `[Symbol.iterator]()`, am einfachsten als Generator: `*[Symbol.iterator]() { yield … }`.
</details>

<details>
<summary>5. Ist <code>function log&lt;T&gt;(value: T): void</code> ein sinnvolles Generic?</summary>

Nein – `T` kommt nur einmal vor. `function log(value: unknown): void` ist gleichwertig und einfacher.
</details>

## 9. Weiterführend (optional)

- [MDN: Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) und [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [Total TypeScript Essentials, Kapitel «Generics»](https://www.totaltypescript.com/books/total-typescript-essentials)

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l07` sind grün
- [ ] `npx tsc --noEmit -p lektionen/l07-generics` ohne Fehler
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 8 – Asynchrones Programmieren](../l08-async/README.md)
