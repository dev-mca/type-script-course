# Spickzettel: Java → TypeScript

> Zum Nachschlagen neben der IDE. Die Verweise (L3 usw.) zeigen, in welcher Lektion das Thema erklärt wird.

## Grundlagen

| Java | TypeScript | |
|------|------------|---|
| `int x = 5;` | `let x = 5;` (Typ wird hergeleitet) | L1 |
| `final int x = 5;` | `const x = 5;` | L1 |
| `int`, `long`, `double` | `number` (immer Gleitkomma) | L1 |
| `BigInteger` | `bigint` (`10n`) | L1 |
| `char` | – (ein String der Länge 1) | L1 |
| `String s = "a" + b;` | `` const s = `a${b}`; `` | L1 |
| `s.length()` | `s.length` (Eigenschaft) | L1 |
| `a.equals(b)` (Strings) | `a === b` | L1 |
| `a == b` (Referenzen) | `a === b` (Objekte: auch Referenz) | L1 |
| – | **nie** `==` verwenden | L1 |
| `null` | `null` **und** `undefined` | L1 |
| `Objects.requireNonNullElse(x, d)` | `x ?? d` | L1 |
| `x != null ? x.y : null` | `x?.y` | L1, L4 |
| `(int) 3.7` | `Math.trunc(3.7)` | L1 |
| `Integer.parseInt("42")` | `Number("42")` oder `parseInt("42", 10)` | L1 |
| `System.out.println(x)` | `console.log(x)` | L1 |

## Typen

| Java | TypeScript | |
|------|------------|---|
| `Object` | `unknown` (nicht `any`!) | L2 |
| `class Point { int x, y; }` (nur Daten) | `type Point = { x: number; y: number };` | L2 |
| `record Point(int x, int y)` | `type Point = { readonly x: number; readonly y: number };` | L2 |
| `Optional<String>` | `string \| undefined` | L2 |
| `enum Size { S, M, L }` | `type Size = "S" \| "M" \| "L";` | L2 |
| `Map<String, Integer>` (fest) | `Record<string, number>` | L2 |
| `(Dog) animal` (geprüft) | `animal as Dog` (**ungeprüft!**) – besser Narrowing | L2, L5 |
| `x instanceof Dog` | `x instanceof Dog` (nur Klassen) / Type Guards | L5 |
| `sealed interface` + `record` + `switch` | Discriminated Union + `switch` | L5 |
| nominale Typisierung | **strukturelle** Typisierung | L2 |

## Funktionen

| Java | TypeScript | |
|------|------------|---|
| `int add(int a, int b)` | `function add(a: number, b: number): number` | L3 |
| `x -> x * 2` | `(x) => x * 2` | L3 |
| `Function<A, B>` | `(a: A) => B` | L3 |
| `Supplier<T>` / `Consumer<T>` / `Runnable` | `() => T` / `(t: T) => void` / `() => void` | L3 |
| `Predicate<T>` | `(t: T) => boolean` | L3 |
| `f.apply(x)` | `f(x)` | L3 |
| `int... nums` | `...nums: number[]` | L3 |
| Methoden überladen | optionale Parameter, Defaults, Unions | L3 |
| Lambda nur mit «effectively final» | Closures dürfen Variablen verändern | L3 |

## Klassen und Interfaces

| Java | TypeScript | |
|------|------------|---|
| `private int x;` | `#x: number;` (echt privat) oder `private x: number;` | L4 |
| Konstruktor + Feldzuweisung | Parameter Properties: `constructor(private x: number) {}` | L4 |
| `getX()` | `get x(): number { … }` | L4 |
| `@Override` | `override` (bei uns Pflicht) | L4 |
| `implements Comparable<T>` | `implements …` optional – Form zählt | L2, L4 |
| `this.x` (optional) | `this.x` (**Pflicht**) | L4 |
| `equals`/`hashCode`/`toString` | gibt es nicht zum Überschreiben | L4 |
| `obj.clone()` (flach) | `{ ...obj }` | L4 |
| Setter aufrufen | neues Objekt: `{ ...user, name: "Neu" }` | L4 |

## Collections und Streams

| Java | TypeScript | |
|------|------------|---|
| `List<T>` / `ArrayList<T>` | `T[]` | L6 |
| `List.of(1, 2)` | `[1, 2]` | L6 |
| `list.get(0)` | `list[0]` (Typ: `T \| undefined`) | L2, L6 |
| `list.size()` | `list.length` | L6 |
| `list.add(x)` | `list.push(x)` | L6 |
| `HashMap<K, V>` | `Map<K, V>` | L6 |
| `HashSet<T>` | `Set<T>` | L6 |
| `.stream().map(f).collect(toList())` | `.map(f)` | L6 |
| `.filter(p)` / `.findFirst()` | `.filter(p)` / `.find(p)` | L6 |
| `.reduce(0, Integer::sum)` | `.reduce((a, b) => a + b, 0)` | L6 |
| `.anyMatch` / `.allMatch` | `.some` / `.every` | L6 |
| `.sorted(c)` | `.toSorted(c)` (⚠️ `sort` verändert das Original) | L6 |
| `Collectors.groupingBy` | `Object.groupBy` / `Map.groupBy` | L6 |
| `.distinct()` | `[...new Set(list)]` | L6 |
| `Iterable<T>` + `Iterator<T>` | `*[Symbol.iterator]() { yield … }` | L7 |

## Generics

| Java | TypeScript | |
|------|------------|---|
| `<T> T first(List<T> l)` | `function first<T>(l: T[]): T \| undefined` | L7 |
| `<T extends Comparable<T>>` | `<T extends { … }>` (strukturell) | L7 |
| `? extends T` / `? super T` | meist unnötig; `readonly T[]` für «nur lesen» | L7 |
| – | `<K extends keyof T>` und `T[K]` | L7 |
| `List<int>` geht nicht | `Array<number>` geht | L7 |

## Fehler

| Java | TypeScript | |
|------|------------|---|
| `throws IOException` | gibt es nicht | L5 |
| `catch (IOException e)` | `catch (e)` – `e` ist `unknown`, dann `instanceof` | L5 |
| `class MyEx extends Exception` | `class MyError extends Error` (+ `this.name = …`) | L5 |
| `Optional`/`Either` für Fehler | `Result<T, E>`-Union | L5, L7 |

## Asynchron

| Java | TypeScript | |
|------|------------|---|
| `CompletableFuture<T>` | `Promise<T>` | L8 |
| `.thenApply(f)` / `.thenCompose(f)` | `.then(f)` | L8 |
| `.get()` / `.join()` | `await` | L8 |
| `CompletableFuture.allOf(…)` | `Promise.all([…])` | L8 |
| `Thread.sleep(ms)` | `await new Promise((r) => setTimeout(r, ms))` | L8 |
| mehrere Threads | ein Thread + Event Loop | L8 |
| `HttpClient` | `fetch` | L8 |

## Projekt und Werkzeuge

| Java | TypeScript | |
|------|------------|---|
| JVM | Node.js (Server) / Browser | L1 |
| Maven / Gradle | npm | L1, L9 |
| `pom.xml` | `package.json` | L9 |
| `~/.m2` | `node_modules/` (pro Projekt) | L1 |
| `javac` | `tsc` | L1 |
| `java Main` | `npx tsx main.ts` | L1 |
| `package ch.example.salon;` + `import …;` | ES-Module: `import { x } from "./datei";` | L9 |
| `public` (Klasse) | `export` | L9 |
| JUnit `assertEquals(a, b)` | Vitest `expect(b).toEqual(a)` | L1 |
| `assertThrows(…)` | `expect(() => …).toThrow()` | L1 |
| Mockito `mock()` / `verify()` | `vi.fn()` / `expect(fn).toHaveBeenCalledWith(…)` | L3 |
| Spring `@RestController` | Hono-Routen | L11 |
| Bean Validation (`@NotNull`) | Zod-Schemas | L11 |
| JavaFX / Swing | React (im Browser) | L12 |

## Die häufigsten Stolperfallen für Java-Entwickler

1. **`==` statt `===`.** Immer `===`.
2. **`sort()` auf Zahlen ohne Vergleichsfunktion** sortiert als Strings: `[10, 9].sort()` → `[10, 9]`.
3. **`||` statt `??` für Standardwerte** – `0` und `""` werden sonst ersetzt.
4. **`for...in` statt `for...of`** über Arrays – liefert Indizes als Strings.
5. **`this` geht verloren**, wenn man eine Methode als Callback übergibt → Arrow Function verwenden.
6. **Vergessenes `await`** – die Funktion läuft weiter, Fehler gehen verloren.
7. **`as` für Daten von aussen** – prüft nichts. Validieren (Narrowing, Zod)!
8. **Objekte verändern statt ersetzen** – vor allem in React ein Fehler.
9. **`fetch` wirft bei 404/500 nicht** – `response.ok` prüfen.
10. **Typen existieren zur Laufzeit nicht** – kein `instanceof Interface`, kein `new T()`.
