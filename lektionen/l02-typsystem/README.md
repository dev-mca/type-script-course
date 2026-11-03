# Lektion 2 – Das Typsystem

> ⏱ **ca. 3–4 Stunden** · Voraussetzung: Lektion 1 · Schwierigkeit: ●●○○○

## Darum geht's

Das Typsystem von TypeScript sieht auf den ersten Blick aus wie das von Java – ist aber grundlegend anders gebaut. In Java zählt, **wie ein Typ heisst** (nominale Typisierung). In TypeScript zählt, **welche Form ein Wert hat** (strukturelle Typisierung). Wenn du das einmal verinnerlicht hast, ergeben viele Dinge plötzlich Sinn.

**Nach dieser Lektion kannst du:**

- Daten mit `type` und `interface` modellieren (Objekte, Arrays, Tupel, optionale Felder)
- erklären, was strukturelle Typisierung ist und warum sie anders als in Java funktioniert
- `any`, `unknown` und `never` unterscheiden und richtig einsetzen
- Literal-Typen als typsichere Alternative zu Enums verwenden

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Compiler-Quiz `beispiele/02-strukturell-quiz.ts` | 15 min |
| 2 | 📖 Lesen | Abschnitte 1–4 | 30 min |
| 3 | 🌐 Doku | Handbook «Everyday Types» | 30 min |
| 4 | ▶️ Ausprobieren | `beispiele/01-inferenz.ts` mit Typ-Info in IntelliJ | 15 min |
| 5 | 📖 Lesen | Abschnitte 5–8 | 30 min |
| 6 | ✍️ Üben | Aufgaben 1–4 | 75 min |
| 7 | 🔍 Recherche | Auftrag in Abschnitt 9 | 10 min |
| 8 | ✅ Abschluss | Selbstcheck | 10 min |

---

## 1. Typ-Annotationen und Inferenz

```ts
let count: number = 5;     // explizite Annotation
let count2 = 5;            // Inferenz: TypeScript erkennt selbst "number"
const greeting = "Hallo";  // Typ ist sogar "Hallo" (Literal-Typ, siehe Abschnitt 6)
```

Anders als in Java (`var` kam erst spät) leitet TypeScript Typen fast überall selbst her. **Die Faustregel professioneller Teams:**

- **Annotiere Funktionsparameter immer** – sie können nicht hergeleitet werden.
- **Annotiere Rückgabetypen** bei exportierten Funktionen – das ist Dokumentation und verhindert, dass sich der Typ versehentlich ändert.
- **Lass lokale Variablen herleiten** – `const total: number = a + b` ist überflüssig.

```ts
export function netPrice(gross: number, vatRate: number): number {
  const vat = gross * vatRate;   // number – hergeleitet
  return gross - vat;
}
```

> 💡 **IntelliJ-Tipp:** Setz den Cursor auf eine Variable und drück **Ctrl+Shift+P** (*Type Info*). IntelliJ zeigt dir den hergeleiteten Typ. Alternativ: mit gedrückter **Ctrl**-Taste über den Namen fahren. Probier das jetzt in `beispiele/01-inferenz.ts` aus.

## 2. Arrays, Tupel und Objekte

```ts
// Arrays – zwei gleichwertige Schreibweisen
const scores: number[] = [1, 2, 3];
const names: Array<string> = ["Ada", "Linus"];
const fixed: readonly number[] = [1, 2]; // kein push, kein Zuweisen von fixed[0]

// Tupel – Array mit fester Länge und festem Typ pro Position
const point: [number, number] = [3, 4];
const entry: [name: string, age: number] = ["Melih", 25]; // mit Labels (nur Doku)

// Objekttypen – direkt hingeschrieben
const product: { name: string; price: number } = { name: "Kamm", price: 500 };
```

Java hat keine Tupel; du würdest dafür einen `record` schreiben. In TypeScript sind Tupel praktisch für kleine, lokale Rückgabewerte (z. B. `[min, max]`). Für alles, was eine Bedeutung hat, nimmt man besser ein Objekt mit Namen.

## 3. Eigene Typen: `type` und `interface`

Statt Objekttypen jedes Mal auszuschreiben, gibst du ihnen einen Namen:

```ts
type Product = {
  readonly id: number;   // readonly: nach dem Erstellen nicht mehr änderbar
  name: string;
  price: number;
  description?: string;  // optional: darf fehlen (ist dann undefined)
};

interface Customer {
  id: number;
  name: string;
  favoriteProducts: Product[];
}
```

**`type` oder `interface`?** Für Objekte sind beide fast gleichwertig. Unterschiede:

| | `interface` | `type` |
|---|---|---|
| Objektformen | ✅ | ✅ |
| Unions (`A \| B`), Tupel, Primitive | ❌ | ✅ |
| Erweitern | `interface B extends A` | `type B = A & { … }` |
| Nachträglich ergänzbar (Declaration Merging) | ✅ | ❌ |

**Empfehlung für diesen Kurs:** `type` als Standard, `interface` wenn du bewusst eine «Schnittstelle» beschreibst, die Klassen implementieren (Lektion 4). Viele Teams machen es genau umgekehrt – wichtig ist nur, dass ein Projekt konsistent ist.

Wichtig für Java-Leute: **Ein Interface erzeugt keinen Code.** Es existiert nur für den Compiler (du hast das in Lektion 1 beim Kompilieren gesehen). Du kannst also nirgends `instanceof Customer` schreiben.

## 4. Strukturelle Typisierung – der grosse Unterschied zu Java

In Java ist ein Objekt nur dann ein `Comparable`, wenn seine Klasse `implements Comparable` hinschreibt. In TypeScript reicht es, **die richtige Form zu haben**:

```ts
type HasName = { name: string };

function greet(thing: HasName): string {
  return `Hallo ${thing.name}`;
}

const dog = { name: "Bello", breed: "Labrador" };
class Robot { name = "R2D2"; }

greet(dog);          // ✅ dog hat ein name-Feld vom Typ string
greet(new Robot());  // ✅ Robot auch – obwohl nirgends "implements HasName" steht
greet({ name: "Ada", age: 36 }); // ❌ Fehler! Siehe unten
```

Die letzte Zeile ist eine Ausnahme: Bei einem **Objektliteral direkt im Aufruf** prüft TypeScript zusätzlich auf überflüssige Eigenschaften (*excess property check*). Die Idee: Wenn du ein Objekt extra für diesen Aufruf hinschreibst, ist `age` wahrscheinlich ein Tippfehler. Über eine Variable (wie `dog`) ist es erlaubt.

```text
Java (nominal):       "Bist du ein HasName?"         → Schau auf den Klassennamen
TypeScript (strukturell): "Hast du ein name: string?"  → Schau auf die Form
```

Man nennt das auch «Duck Typing»: *Wenn es aussieht wie eine Ente und quakt wie eine Ente, ist es eine Ente.* TypeScript macht das – im Gegensatz zu Python – aber zur Compile-Zeit.

> 🌐 **Jetzt in der Doku lesen (30 min):** [Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) – ganz. Und danach kurz den Anfang von [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) (bis «Comparing two functions»).

---

## 5. `any`, `unknown`, `never`, `void`

| Typ | Bedeutung | Java-Vergleich | Wann verwenden |
|-----|-----------|----------------|----------------|
| `any` | «Schalte die Typprüfung aus» | gibt es nicht | **praktisch nie** – Notausgang |
| `unknown` | «Kann alles sein – prüf es, bevor du es benutzt» | `Object` (mit Pflicht zum Prüfen) | Daten von aussen: JSON, Benutzereingaben, `catch (e)` |
| `never` | «Kann nie vorkommen» | – | Funktionen, die immer werfen; Vollständigkeitsprüfung (Lektion 5) |
| `void` | «Gibt nichts Brauchbares zurück» | `void` | Rückgabetyp von Funktionen ohne `return` |

```ts
const a: any = JSON.parse('"hallo"');
a.toFixed(2);         // kein Compilerfehler – aber Absturz zur Laufzeit!

const u: unknown = JSON.parse('"hallo"');
u.toFixed(2);         // ❌ Compilerfehler: 'u' is of type 'unknown'
if (typeof u === "number") {
  u.toFixed(2);       // ✅ hier weiss TypeScript, dass u eine Zahl ist
}
```

`any` ist ansteckend: Alles, was du mit einem `any` machst, ist wieder `any`. Ein einziges `any` kann die Typsicherheit eines ganzen Programmteils zerstören. **Wenn du «irgendwas» meinst, schreib `unknown`.**

## 6. Literal-Typen: Die bessere Alternative zu Enums

Ein Typ kann auch ein **konkreter Wert** sein:

```ts
type Size = "S" | "M" | "L" | "XL";   // genau einer dieser vier Strings
type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

let size: Size = "M";    // ✅
size = "XXL";            // ❌ Type '"XXL"' is not assignable to type 'Size'
```

Das `|` liest man als «oder» (ein *Union-Typ*, mehr dazu in Lektion 5). In IntelliJ bekommst du für `size = "` sogar Autovervollständigung mit allen erlaubten Werten.

TypeScript hat zwar auch `enum`, aber Literal-Unions sind meistens die bessere Wahl: Sie erzeugen keinen Laufzeitcode (du hast in Lektion 1 gesehen, was aus einem `enum` wird), funktionieren direkt mit JSON-Daten, und Node.js kann sie ohne Umweg ausführen.

### `as const`

```ts
const SIZES = ["S", "M", "L"];            // Typ: string[]
const SIZES2 = ["S", "M", "L"] as const;  // Typ: readonly ["S", "M", "L"]
```

`as const` sagt: «Nimm die Werte wörtlich und mach alles readonly.» Damit kannst du Typen *aus Werten* herleiten – das vertiefen wir in Lektion 10.

## 7. `null` und `undefined` im Typsystem

Mit `strict: true` (ist bei uns an) gehören `null` und `undefined` **nicht** automatisch zu jedem Typ – anders als in Java, wo jede Referenz `null` sein kann.

```ts
let name: string = null;            // ❌ Fehler
let maybeName: string | null = null; // ✅ ausdrücklich erlaubt

type User = {
  nickname?: string;          // darf fehlen → Typ beim Lesen: string | undefined
  middleName: string | null;  // muss vorhanden sein, darf aber null sein
};
```

Das ist im Prinzip das, was Java mit `Optional` zu lösen versucht – aber direkt im Typsystem und ohne Wrapper-Objekt.

## 8. Index-Signaturen und `Record`

Für Objekte, die als «Wörterbuch» dienen (beliebige Schlüssel, gleicher Werttyp):

```ts
const prices: Record<string, number> = { Haarschnitt: 4500, Bart: 2500 };
// gleichbedeutend mit: { [product: string]: number }

prices["Färben"] = 8000;   // neue Schlüssel sind erlaubt

const p = prices["Kamm"];  // Typ: number | undefined  ← dank noUncheckedIndexedAccess!
```

Wir haben in `tsconfig.base.json` die Option `noUncheckedIndexedAccess` eingeschaltet. Sie sorgt dafür, dass ein Zugriff über einen beliebigen Schlüssel (oder Array-Index) `… | undefined` liefert – denn der Schlüssel könnte ja fehlen. Das ist strenger als der Standard, verhindert aber genau die Fehler, die in Java eine `NullPointerException` auslösen würden.

> Vergleich: `Record<string, number>` ≈ `Map<String, Integer>` in Java. TypeScript hat auch eine echte `Map` – wann man welche nimmt, lernst du in Lektion 6.

### Type Assertions (`as`)

```ts
const input = document.getElementById("name") as HTMLInputElement;
```

`as` sieht aus wie ein Cast in Java, ist aber **gefährlicher**: Es findet **keine Laufzeitprüfung** statt. Du sagst dem Compiler nur «vertrau mir». Wenn du falsch liegst, merkt es niemand – bis es knallt. Verwende `as` nur, wenn du wirklich mehr weisst als der Compiler, und bevorzuge Prüfungen wie `typeof`.

---

## 9. ✍️ Übungen

```bash
npm run test:watch -- l02
```

| Nr | Datei | Thema | Wie geprüft? | ★ |
|----|-------|-------|--------------|---|
| 1 | `01-typen-modellieren.ts` | `type`, optionale Felder, `readonly`, Tupel, `Record` | **Compiler** | ★☆☆ |
| 2 | `02-unknown.ts` | `unknown` sicher prüfen | Tests | ★★☆ |
| 3 | `03-records.ts` | Wörterbücher, `noUncheckedIndexedAccess` | Tests | ★★☆ |
| 4 | `04-literal-und-tupel.ts` | Literal-Typen, `as const`, Tupel | Tests | ★★☆ |

### Neu: Typ-Aufgaben, die der Compiler prüft

Aufgabe 1 hat keine Tests. Stattdessen stehen unten in der Datei Zeilen, die **kompilieren müssen**, und Zeilen mit `// @ts-expect-error`, die einen **Fehler erzeugen müssen**. Am Anfang ist die Datei voller roter Markierungen.

- Steht da *«Unused '@ts-expect-error' directive»*, ist dein Typ **zu locker** (er erlaubt etwas, das verboten sein sollte).
- Ist eine Zeile *ohne* `@ts-expect-error` rot, ist dein Typ **zu streng** oder falsch.
- **Gelöst ist die Aufgabe, wenn die Datei keine roten Markierungen mehr hat.**

Im Terminal prüfst du das mit:

```bash
npx tsc --noEmit -p lektionen/l02-typsystem
```

### 🔍 Recherche-Auftrag

Finde in der [tsconfig-Referenz](https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess) heraus, was `noUncheckedIndexedAccess` genau macht. Schalte es danach testweise im `tsconfig.base.json` aus (`false`) und schau, welche Stellen in `loesungen/03-records.ts` nicht mehr gewarnt würden. Danach wieder einschalten!

---

## 10. ✅ Selbstcheck

<details>
<summary>1. Was bedeutet «strukturelle Typisierung»? Gib ein Beispiel, das in TS kompiliert, in Java aber nicht.</summary>

Typen sind kompatibel, wenn ihre *Form* passt – der Name spielt keine Rolle. Beispiel: Eine Klasse `Robot { name = "R2" }` kann an eine Funktion übergeben werden, die `{ name: string }` erwartet, ohne dass `Robot` irgendein Interface implementiert.
</details>

<details>
<summary>2. Warum ist <code>unknown</code> besser als <code>any</code>?</summary>

Bei `unknown` musst du den Typ prüfen, bevor du etwas damit machst. `any` schaltet die Prüfung komplett ab und «steckt» alle Werte an, die daraus entstehen.
</details>

<details>
<summary>3. Was ist der Unterschied zwischen <code>nickname?: string</code> und <code>nickname: string | undefined</code>?</summary>

Bei `?` darf das Feld **ganz fehlen**. Bei `string | undefined` muss das Feld vorhanden sein (aber der Wert darf `undefined` sein). Beim Lesen ist der Typ in beiden Fällen `string | undefined`.
</details>

<details>
<summary>4. Warum liefert <code>prices["Kamm"]</code> bei uns <code>number | undefined</code>?</summary>

Weil `noUncheckedIndexedAccess` aktiv ist: Bei einem beliebigen Schlüssel kann TypeScript nicht wissen, ob er existiert.
</details>

<details>
<summary>5. Warum sind Literal-Unions oft besser als Enums?</summary>

Sie erzeugen keinen Laufzeitcode, passen direkt zu JSON-Strings, bieten trotzdem Autovervollständigung und Prüfung, und funktionieren mit Node.js' eingebauter TypeScript-Unterstützung.
</details>

## 11. Weiterführend (optional)

- [Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) – Abschnitte «Property Modifiers» und «Extending Types» (vertiefen wir in Lektion 4)
- [Total TypeScript Essentials](https://www.totaltypescript.com/books/total-typescript-essentials) – kostenloses Online-Buch, Kapitel 4 («Essential Types and Annotations»)

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l02` sind grün
- [ ] `npx tsc --noEmit -p lektionen/l02-typsystem` zeigt keine Fehler
- [ ] Ich kann strukturelle Typisierung in zwei Sätzen erklären
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 3 – Funktionen](../l03-funktionen/README.md)
