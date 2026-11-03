# Lektion 1 – Erste Schritte: Von Java zu TypeScript

> ⏱ **ca. 2–3 Stunden** · Voraussetzung: Setup aus dem Haupt-[README](../../README.md) erledigt · Schwierigkeit: ●○○○○

## Darum geht's

Du kannst programmieren. In dieser Lektion lernst du nicht, was eine Schleife ist, sondern **wo TypeScript anders tickt als Java**: wie ein TS-Programm überhaupt läuft, warum es nur *einen* Zahlentyp gibt, warum `==` gefährlich ist und was «truthy» bedeutet. Diese Kleinigkeiten verursachen am Anfang die meisten Bugs.

**Nach dieser Lektion kannst du:**

- erklären, wie aus TypeScript lauffähiges JavaScript wird
- TS-Dateien mit `tsx` ausführen und Tests mit Vitest laufen lassen
- die wichtigsten Fallen bei Zahlen, Gleichheit und Wahrheitswerten vermeiden

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Vorhersage-Quiz (Abschnitt 1) | 10 min |
| 2 | 📖 Lesen | Abschnitte 2–3 in diesem README | 20 min |
| 3 | 🌐 Doku | «TypeScript for Java/C# Programmers» | 25 min |
| 4 | ▶️ Ausprobieren | `beispiele/` ausführen und verändern | 20 min |
| 5 | 🔧 Experiment | TypeScript selbst kompilieren (Abschnitt 4) | 15 min |
| 6 | 📖 Lesen | Abschnitte 5–8 | 25 min |
| 7 | ✍️ Üben | Aufgaben 1–4 | 60 min |
| 8 | ✅ Abschluss | Selbstcheck + Fortschritt eintragen | 10 min |

---

## 1. 🧠 Aufwärmen: Was gibt das aus?

Schreib deine Vermutung auf, **bevor** du die Lösung aufklappst. Falsch raten ist erwünscht – genau dann lernst du am meisten.

```ts
console.log(7 / 2);
console.log(0.1 + 0.2 === 0.3);
console.log("5" == 5);
console.log("5" === 5);
console.log([] == false);
console.log(typeof null);
console.log("3" + 4);
console.log("3" * 4);
```

<details>
<summary>Auflösung</summary>

```text
3.5        ← keine Ganzzahldivision! Es gibt nur "number" (wie double in Java)
false      ← 0.30000000000000004, genau wie bei double in Java
true       ← == wandelt Typen um ("coercion")
false      ← === vergleicht ohne Umwandlung
true       ← [] wird zu "" wird zu 0, false wird zu 0 … darum: niemals ==
object     ← ein berühmter, historischer Fehler in JavaScript
34         ← + mit einem String = String-Verkettung (wie in Java)
12         ← * wandelt den String in eine Zahl um (in Java ein Compilerfehler)
```

TypeScript hätte dir übrigens bei `"5" == 5` und `"3" * 4` einen Fehler gemeldet. Der Typchecker schützt dich vor vielen dieser Fallen – aber nicht vor allen.
</details>

---

## 2. Was ist TypeScript eigentlich?

**TypeScript = JavaScript + Typen.** Jedes gültige JavaScript ist (fast) gültiges TypeScript. TypeScript fügt nur eine Typ-Schicht hinzu, die **vor** dem Ausführen geprüft und dann **komplett entfernt** wird.

```text
   Java                                    TypeScript
   ────                                    ──────────
   Hello.java                              hello.ts
      │  javac (prüft + übersetzt)            │  tsc prüft Typen
      ▼                                       │  Typen werden entfernt
   Hello.class (Bytecode)                     ▼
      │                                    hello.js (normales JavaScript)
      ▼                                       │
   JVM führt aus                              ▼
                                           Node.js / Browser führt aus
```

Das hat eine wichtige Konsequenz: **Zur Laufzeit gibt es keine Typen mehr.** Du kennst das ein bisschen von Java-Generics (Type Erasure: `List<String>` wird zur Laufzeit zu `List`). In TypeScript wird *alles* entfernt – Interfaces, Typ-Annotationen, Generics. Du kannst also zur Laufzeit nicht fragen «ist dieses Objekt ein `User`?». Darauf kommen wir in Lektion 5 und 11 zurück.

> 💡 **TypeScript 6 vs. 7:** Seit Juli 2026 gibt es TypeScript 7, einen in Go neu geschriebenen, rund 10× schnelleren Compiler. Die *Sprache* ist dieselbe. Wir verwenden in diesem Kurs TypeScript 6, weil IntelliJ und einige Tools die neue Version noch nicht vollständig unterstützen. Alles, was du hier lernst, gilt für beide.

### Die Werkzeuge – übersetzt in Java-Begriffe

| Java | TypeScript-Welt | Wozu |
|------|-----------------|------|
| JVM | **Node.js** | Laufzeitumgebung ausserhalb des Browsers |
| Maven / Gradle | **npm** | Pakete installieren, Skripte ausführen |
| `pom.xml` / `build.gradle` | **`package.json`** | Projektbeschreibung, Abhängigkeiten, Skripte |
| `~/.m2/repository` | **`node_modules/`** | heruntergeladene Pakete (hier: pro Projekt!) |
| `javac` | **`tsc`** | Typen prüfen (und optional nach JS übersetzen) |
| `java Main` | **`tsx datei.ts`** | TS-Datei direkt ausführen |
| JUnit | **Vitest** | Tests schreiben und ausführen |
| `main`-Methode | *gibt es nicht* | Code auf oberster Ebene wird einfach ausgeführt |

Schau dir jetzt kurz die Dateien `package.json`, `tsconfig.base.json` und `vitest.config.ts` im Hauptordner an. Du musst noch nicht alles verstehen – nur einen Eindruck bekommen. In Lektion 9 gehen wir jede Option durch.

---

## 3. Dein erstes Programm

In Java brauchst du eine Klasse und eine `main`-Methode. In TypeScript schreibst du einfach los:

```ts
// hallo.ts
const name = "Melih";
console.log(`Hallo ${name}!`); // Template-String mit Backticks
```

Ausführen im Terminal (aus dem Hauptordner):

```bash
npx tsx lektionen/l01-erste-schritte/beispiele/01-hallo.ts
```

Oder in IntelliJ: Rechtsklick auf die Datei → **Run '01-hallo.ts'** (funktioniert, wenn du die Run-Konfiguration aus dem Haupt-README eingerichtet hast).

### Variablen: `const` und `let`

```ts
const pi = 3.14159;   // wie final in Java – kann nicht neu zugewiesen werden
let counter = 0;      // veränderbar
counter++;

// var  ← alter Stil, NICHT verwenden (seltsame Gültigkeitsbereiche)
```

**Faustregel:** Immer `const`. Nur wenn du neu zuweisen musst, `let`.

Achtung, genau wie `final` in Java: `const` heisst nur «die Variable zeigt immer auf dasselbe». Der Inhalt eines Objekts oder Arrays kann trotzdem verändert werden:

```ts
const list = [1, 2, 3];
list.push(4);      // erlaubt!
// list = [5];     // Fehler: neu zuweisen geht nicht
```

> 🌐 **Jetzt in der Doku lesen (25 min):** [TypeScript for Java/C# Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
> Dieser Artikel ist **für dich geschrieben**. Lies ihn ganz. Nicht alles wird sofort Sinn ergeben – markiere dir, was dich überrascht, und vergleiche am Ende der Lektion.

---

## 4. 🔧 Experiment: Sieh dir an, was der Compiler erzeugt

Im Ordner `kompilieren/` liegt eine kleine TS-Datei. Übersetze sie in JavaScript:

```bash
npx tsc -p lektionen/l01-erste-schritte/kompilieren
```

Danach liegt eine Datei in `kompilieren/out/demo.js`. Öffne beide Dateien nebeneinander (in IntelliJ: Rechtsklick auf den Tab → *Split Right*).

**Aufträge:**

1. Was ist mit dem `interface` passiert?
2. Was ist mit den Typ-Annotationen (`: number`, `: string`) passiert?
3. Das `enum` sieht im JavaScript seltsam aus. Was ist daraus geworden? (Ein Grund, warum viele Teams lieber Union-Typen verwenden – mehr dazu in Lektion 2.)
4. Baue absichtlich einen Typfehler ein (z. B. `const x: number = "hallo";`) und kompiliere nochmals. Wird trotzdem eine JS-Datei erzeugt? *(Ja, standardmässig schon! Mit der Option `noEmitOnError` lässt sich das abschalten.)*

> Im eigentlichen Kurs kompilieren wir nie selbst nach JavaScript. `tsx`, Vitest und Vite erledigen das im Hintergrund, und `tsc` benutzen wir nur zum Prüfen (`noEmit`). Aber es ist wichtig, dass du einmal gesehen hast, was passiert.

---

## 5. Zahlen: Es gibt nur `number`

Java hat `int`, `long`, `float`, `double`, `byte`, `short`. JavaScript hat **einen** Zahlentyp: `number`, eine 64-Bit-Gleitkommazahl (entspricht Java-`double`).

```ts
7 / 2;                    // 3.5 – keine Ganzzahldivision
Math.trunc(7 / 2);        // 3  – Nachkommastellen abschneiden (wie (int) in Java)
Math.floor(-7 / 2);       // -4 – abrunden (anders als trunc bei negativen Zahlen!)
7 % 3;                    // 1  – Modulo wie in Java
Number.isInteger(5.0);    // true – 5.0 und 5 sind dieselbe Zahl
Number.MAX_SAFE_INTEGER;  // 9007199254740991 – bis hier sind Ganzzahlen exakt
10n ** 30n;               // bigint – für wirklich grosse Ganzzahlen (selten nötig)
```

Besondere Werte: `NaN` («Not a Number», z. B. `Number("abc")`) und `Infinity` (z. B. `1 / 0` – **kein** Fehler wie in Java!).

```ts
NaN === NaN;              // false (!) – darum:
Number.isNaN(Number("abc")); // true
```

**Geld nie als Kommazahl speichern!** `0.1 + 0.2` ist nicht `0.3`. Profis rechnen in Rappen (Ganzzahlen) und formatieren erst bei der Ausgabe. Das übst du in Aufgabe 1.

## 6. Gleichheit: Immer `===`

| Ausdruck | Ergebnis | Warum |
|----------|----------|-------|
| `5 === 5` | `true` | gleicher Wert, gleicher Typ |
| `"5" === 5` | `false` | verschiedene Typen |
| `"5" == 5` | `true` | `==` wandelt um → **nie verwenden** |
| `{ a: 1 } === { a: 1 }` | `false` | Objekte: Referenzvergleich (wie `==` in Java) |
| `"abc" === "abc"` | `true` | Strings werden nach Wert verglichen (anders als `==` in Java!) |

Es gibt **kein `equals()`**. Objekte nach Inhalt zu vergleichen musst du selbst bauen (oder in Tests `expect(a).toEqual(b)` verwenden).

## 7. `null`, `undefined`, truthy und falsy

JavaScript hat **zwei** «Nichts»-Werte:

- `undefined` – «hier wurde nie etwas zugewiesen» (nicht gesetzte Variable, fehlendes Objektfeld, fehlender Rückgabewert)
- `null` – «hier ist absichtlich nichts»

In der Praxis verwendet man in TypeScript meistens `undefined`. Du musst aber beide kennen.

### Truthy und falsy

In Java muss in einem `if` ein `boolean` stehen. In JavaScript darf dort **alles** stehen. Folgende Werte gelten als **falsy** (verhalten sich wie `false`):

```text
false   0   -0   0n   ""   null   undefined   NaN
```

**Alles andere ist truthy** – auch `"0"`, `"false"`, `[]` und `{}`!

```ts
const name = "";
if (name) {
  console.log("Name vorhanden");   // wird NICHT ausgegeben
}
```

Das ist praktisch, aber gefährlich, wenn `0` oder `""` gültige Werte sind:

```ts
function showCount(count: number | undefined) {
  const shown = count || 10;  // ❌ bei count = 0 kommt 10 heraus!
  const correct = count ?? 10; // ✅ ?? ersetzt nur null und undefined
}
```

Merke: **`??` (nullish coalescing) statt `||` für Standardwerte.**

> 🌐 **Doku (10 min):** MDN-Glossar [Truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) und [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), danach [Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)

## 8. Strings und Schleifen

Strings funktionieren fast wie in Java, sind ebenfalls unveränderlich, und es gibt **keinen `char`-Typ** – ein einzelnes Zeichen ist einfach ein String der Länge 1.

```ts
const s = "TypeScript";
s.length;              // 10 (Eigenschaft, keine Methode!)
s.at(-1);              // "t" – negativer Index zählt von hinten
s.includes("Script");  // true
s.toUpperCase();       // "TYPESCRIPT"
s.split("");           // ["T","y","p",…]
"  hi  ".trim();       // "hi"
"7".padStart(3, "0");  // "007"
`Summe: ${1 + 2}`;     // "Summe: 3" – Template-String
```

Schleifen und `if`/`switch` sind wie in Java. Neu ist die Unterscheidung:

```ts
const letters = ["a", "b", "c"];
for (const letter of letters) { }   // ✅ for...of = Java for-each, liefert WERTE
for (const i in letters) { }        // ⚠️ for...in liefert SCHLÜSSEL als Strings ("0","1","2")
```

**Faustregel:** Für Arrays und Strings immer `for...of`. `for...in` brauchst du praktisch nie.

> 🔍 **Recherche-Auftrag (5 min):** Finde auf [MDN String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) heraus, was der Unterschied zwischen `replace` und `replaceAll` ist. Du brauchst es in Aufgabe 2.

---

## 9. ✍️ Übungen

Die Aufgaben liegen in `uebungen/`. Jede Datei enthält Funktionen mit `throw new Error("TODO …")`. Deine Aufgabe: die Funktion so implementieren, dass die Tests in der zugehörigen `.test.ts`-Datei grün werden.

**Tests im Watch-Modus starten** (laufen bei jedem Speichern automatisch neu):

```bash
npm run test:watch -- l01
```

Oder in IntelliJ: Testdatei öffnen und auf das grüne ▶️ neben `describe` klicken.

| Nr | Datei | Thema | Schwierigkeit |
|----|-------|-------|---------------|
| 1 | `01-zahlen.ts` | Ganzzahldivision, Runden, Geld in Rappen | ★☆☆ |
| 2 | `02-strings.ts` | String-Methoden, Template-Strings | ★☆☆ |
| 3 | `03-truthy-nullish.ts` | `null`/`undefined`, `??` vs. `\|\|` | ★★☆ |
| 4 | `04-schleifen.ts` | `for...of`, Kontrollstrukturen | ★☆☆ |

**Tipps:**

- Lies zuerst die Tests! Sie sind die Spezifikation – genau wie in der Prog-Übung mit JUnit.
- Wenn du nicht weiterkommst: zuerst 15 Minuten selbst suchen (Doku, MDN), dann den Hinweis im Kommentar lesen, erst dann `loesungen/` anschauen.
- Die Lösung ist eine *mögliche* Lösung. Vergleiche danach deine Variante – welche ist lesbarer?

---

## 10. ✅ Selbstcheck

Beantworte die Fragen aus dem Kopf, dann aufklappen.

<details>
<summary>1. Warum kannst du zur Laufzeit nicht prüfen, ob ein Objekt ein bestimmtes Interface erfüllt?</summary>

Weil TypeScript alle Typen beim Übersetzen entfernt. Zur Laufzeit läuft reines JavaScript, das Interfaces nicht kennt.
</details>

<details>
<summary>2. Was ergibt <code>Math.trunc(-7 / 2)</code> und was <code>Math.floor(-7 / 2)</code>?</summary>

`-3` und `-4`. `trunc` schneidet ab (Richtung 0, wie Java-Integer-Division), `floor` rundet ab (Richtung minus unendlich).
</details>

<details>
<summary>3. Was ist der Unterschied zwischen <code>a || b</code> und <code>a ?? b</code>?</summary>

`||` nimmt `b`, wenn `a` **falsy** ist (also auch bei `0`, `""`, `false`). `??` nimmt `b` nur, wenn `a` `null` oder `undefined` ist.
</details>

<details>
<summary>4. Warum ist <code>for (const x in array)</code> meistens falsch?</summary>

`for...in` liefert die Schlüssel (Indizes als Strings), nicht die Werte. Für Werte nimmt man `for...of`.
</details>

<details>
<summary>5. Welches Werkzeug ist das Pendant zu Maven, welches zu JUnit?</summary>

npm (mit `package.json`) und Vitest.
</details>

## 11. Weiterführend (optional)

- [TypeScript Playground](https://www.typescriptlang.org/play) – TS im Browser ausprobieren und rechts das erzeugte JavaScript sehen. Ideal für schnelle Experimente.
- [MDN: Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types) – solide Übersicht über die JavaScript-Grundlagen.
- [javascript.info](https://javascript.info/) – sehr gutes, kostenloses JS-Lehrbuch. Kapitel 2 («JavaScript Fundamentals») als Ergänzung zu dieser Lektion.

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l01` sind grün
- [ ] Ich habe `kompilieren/` ausprobiert und verstanden, was mit Typen passiert
- [ ] Selbstcheck ohne Nachschauen beantwortet
- [ ] `FORTSCHRITT.md` aktualisiert und committet (`git commit -am "Lektion 1 fertig"`)

➡️ Weiter mit [Lektion 2 – Das Typsystem](../l02-typsystem/README.md)
