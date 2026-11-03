# Lektion 4 – Objekte und Klassen

> ⏱ **ca. 4 Stunden** · Voraussetzung: Lektion 3 · Schwierigkeit: ●●●○○

## Darum geht's

Objekte sind in JavaScript allgegenwärtig – aber anders als in Java brauchst du dafür meistens **keine Klasse**. Ein Objekt ist einfach `{ name: "Melih" }`. Dazu kommen drei Werkzeuge, die du in modernem TypeScript-Code ständig siehst: **Destructuring**, **Spread** und **Optional Chaining**.

Im zweiten Teil geht es um Klassen. Die kennst du aus Java, und vieles ist gleich. Die Unterschiede sind aber wichtig: `private` funktioniert anders, Interfaces sind strukturell, und `instanceof` geht nur mit Klassen.

**Nach dieser Lektion kannst du:**

- Objekte und Arrays mit Destructuring zerlegen und mit Spread unveränderlich aktualisieren
- Klassen mit Konstruktor, Zugriffsmodifikatoren, Gettern, Vererbung und `abstract` schreiben
- zwischen `private` (TypeScript) und `#privat` (JavaScript) unterscheiden
- entscheiden, wann eine Klasse sinnvoll ist und wann ein einfaches Objekt reicht

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Vorhersage (Abschnitt 1) | 10 min |
| 2 | 📖 Lesen | Abschnitte 2–4 | 25 min |
| 3 | 🌐 Doku | MDN Destructuring + Spread | 20 min |
| 4 | ✍️ Üben | Aufgabe 1 | 40 min |
| 5 | 📖 Lesen | Abschnitte 5–7 (Klassen) | 30 min |
| 6 | 🌐 Doku | Handbook «Classes» (Auszüge) | 25 min |
| 7 | ▶️ Ausprobieren | `beispiele/02-private-vs-hash.ts` | 10 min |
| 8 | ✍️ Üben | Aufgaben 2–4 | 80 min |
| 9 | ✅ Abschluss | Abschnitt 8 + Selbstcheck | 15 min |

---

## 1. 🧠 Aufwärmen

```ts
const original = { name: "Melih", address: { city: "Aarau" } };
const copy = { ...original };
copy.name = "Can";
copy.address.city = "Baden";
console.log(original.name, original.address.city);
```

Was wird ausgegeben?

<details>
<summary>Auflösung</summary>

`Melih Baden`. Der Spread-Operator `{ ...original }` macht eine **flache** Kopie: `name` wird kopiert, aber `address` ist ein Objekt, und davon wird nur die **Referenz** kopiert. Beide Objekte teilen sich dasselbe `address`. Genau wie bei einer flachen Kopie in Java (`clone()` ohne Deep Copy). Wie man es richtig macht, siehst du in Abschnitt 4.
</details>

---

## 2. Objektliterale

```ts
const name = "Melih";
const age = 25;

const user = { name, age };        // Kurzform für { name: name, age: age }
const key = "favoriteColor";
const prefs = { [key]: "blau" };   // berechneter Schlüssel → { favoriteColor: "blau" }

const service = {
  title: "Haarschnitt",
  price: 4500,
  describe() {                     // Methode – Kurzform für describe: function () { … }
    return `${this.title} (${this.price / 100} CHF)`;
  },
};
```

In Java bräuchtest du für `user` mindestens eine Klasse oder einen `record`. In TypeScript beschreibst du die Form bei Bedarf mit einem `type` (Lektion 2) – und erzeugst Objekte einfach mit `{ … }`.

## 3. Destructuring – Werte herausziehen

```ts
const user = { name: "Melih", age: 25, address: { city: "Aarau", zip: "5000" } };

// Objekt-Destructuring
const { name, age } = user;                    // zwei Variablen auf einmal
const { name: userName } = user;               // umbenennen: Variable heisst userName
const { email = "keine" } = user as { email?: string }; // Default, falls undefined
const { address: { city } } = user;            // verschachtelt → city = "Aarau"

// Array-Destructuring
const [first, second, ...rest] = [10, 20, 30, 40];   // first=10, second=20, rest=[30,40]
const [, , third] = [1, 2, 3];                        // Elemente überspringen
let a = 1, b = 2;
[a, b] = [b, a];                                       // Werte tauschen ohne Hilfsvariable

// In Parametern – sehr häufig!
function printUser({ name, age }: { name: string; age: number }) {
  console.log(`${name} ist ${age}`);
}
```

## 4. Spread und Rest – kopieren, zusammenführen, weglassen

```ts
const defaults = { theme: "light", language: "de", notifications: true };
const userSettings = { theme: "dark" };

// Zusammenführen: spätere Werte überschreiben frühere
const settings = { ...defaults, ...userSettings };
// → { theme: "dark", language: "de", notifications: true }

// Unveränderlich aktualisieren: neues Objekt statt Änderung
const updated = { ...settings, language: "en" };

// Rest: alles ausser …
const { notifications, ...withoutNotifications } = settings;

// Arrays
const more = [...[1, 2], 3, ...[4, 5]];   // [1, 2, 3, 4, 5]
const copy = [...more];                    // flache Kopie
```

### Unveränderlich aktualisieren – das wichtigste Muster in modernem TS

In Java änderst du ein Objekt meistens direkt (`user.setCity("Baden")`). In TypeScript-Code (besonders in React) erzeugt man stattdessen **ein neues Objekt** mit den Änderungen. Das alte bleibt unberührt. Vorteile: keine überraschenden Seiteneffekte, Änderungen sind leicht zu erkennen (`alt !== neu`), Undo ist trivial.

Wegen der flachen Kopie musst du verschachtelte Objekte **auf jeder Ebene** kopieren, die du änderst:

```ts
const moved = {
  ...user,
  address: { ...user.address, city: "Baden" },   // auch address neu erzeugen!
};
// user.address.city ist weiterhin "Aarau" ✅
```

Für echte tiefe Kopien gibt es `structuredClone(obj)` – das ist aber langsamer und meistens nicht nötig.

> 🌐 **Jetzt in der Doku lesen (20 min):**
> [MDN: Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) (Abschnitte «Syntax» und «Examples» überfliegen) und
> [MDN: Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

> ✍️ **Jetzt Aufgabe 1** (`uebungen/01-destructuring-spread.ts`), danach weiter mit den Klassen.

---

## 5. Klassen – was gleich ist wie in Java

```ts
class Service {
  // Felder mit Typ (und optional Startwert)
  title: string;
  private priceInRappen: number;
  static count = 0;

  constructor(title: string, priceInRappen: number) {
    this.title = title;
    this.priceInRappen = priceInRappen;
    Service.count++;
  }

  // Methoden – ohne "function" und ohne Rückgabetyp vor dem Namen
  formattedPrice(): string {
    return `CHF ${(this.priceInRappen / 100).toFixed(2)}`;
  }
}

const cut = new Service("Haarschnitt", 4500);
```

**`this.` ist Pflicht!** Anders als in Java kannst du in Methoden nicht einfach `title` schreiben – es muss `this.title` heissen.

### Parameter Properties – die Kurzform

Der typische Java-Boilerplate (Feld deklarieren, im Konstruktor zuweisen) lässt sich abkürzen:

```ts
class Service {
  constructor(
    public readonly title: string,       // erzeugt Feld + Zuweisung automatisch
    private priceInRappen: number,
  ) {}
}
```

Das ist praktisch, aber TypeScript-spezifische Syntax (kein reines JavaScript). Manche Teams verbieten es deshalb (Option `erasableSyntaxOnly`). Du solltest beide Schreibweisen lesen können.

### Getter und Setter

```ts
class Temperature {
  #celsius = 0;
  get fahrenheit(): number { return this.#celsius * 1.8 + 32; }
  set fahrenheit(value: number) { this.#celsius = (value - 32) / 1.8; }
}
const t = new Temperature();
t.fahrenheit = 212;          // ruft den Setter auf – sieht aus wie ein Feld!
console.log(t.fahrenheit);   // 212 – ruft den Getter auf
```

Anders als in Java (`getFahrenheit()`) verwendet man in TypeScript echte Getter/Setter mit `get`/`set`. Für den Aufrufer sehen sie aus wie Felder. **Nur einen Getter ohne Setter** zu haben ist ein elegantes Muster für «von aussen nur lesbar».

### Vererbung, `abstract`, `override`

```ts
abstract class Employee {
  constructor(protected readonly name: string) {}
  abstract monthlySalary(): number;          // muss implementiert werden
  describe(): string {                        // Template Method
    return `${this.name}: CHF ${this.monthlySalary()}`;
  }
}

class Barber extends Employee {
  constructor(name: string, private hourlyRate: number, private hours: number) {
    super(name);                              // wie in Java: zuerst super(...)
  }
  override monthlySalary(): number {          // "override" ist bei uns Pflicht (noImplicitOverride)
    return this.hourlyRate * this.hours;
  }
}
```

`override` entspricht `@Override` in Java – nur dass es bei uns dank `noImplicitOverride` **Pflicht** ist. So merkst du sofort, wenn du eine Methode versehentlich überschreibst oder dich beim Namen vertippst.

## 6. Klassen – was anders ist als in Java

### `private` vs. `#privat`

| | `private feld` | `#feld` |
|---|---|---|
| Woher | TypeScript | JavaScript (Standard) |
| Geprüft | nur vom Compiler | **zur Laufzeit** |
| Umgehbar? | Ja: `(obj as any).feld` funktioniert | Nein, wirklich privat |
| In `console.log` / JSON sichtbar? | Ja | Nein |

Beide sind in Ordnung. `private` ist verbreiteter in älterem Code und in Frameworks wie Angular; `#` ist «echter» und wird in neuem Code häufiger. Probier den Unterschied in `beispiele/02-private-vs-hash.ts` aus.

### `implements` ist optional – aber nützlich

Wegen der strukturellen Typisierung *muss* eine Klasse ein Interface nicht mit `implements` deklarieren, um dazu kompatibel zu sein. `implements` lohnt sich trotzdem: Der Compiler prüft **schon bei der Klasse**, ob alles vorhanden ist – und nicht erst irgendwo, wo du sie verwendest.

### `instanceof` nur mit Klassen

```ts
cut instanceof Service;    // ✅ Klassen existieren zur Laufzeit
cut instanceof Notifier;   // ❌ Interfaces nicht – sie werden beim Kompilieren entfernt
```

### Kein `equals`, `hashCode`, `toString`

Es gibt keine Basisklasse `Object` mit diesen Methoden, die man überschreibt. Wenn du Objekte vergleichen willst, schreibst du eine eigene Funktion. `toString()` existiert zwar, wird aber von `console.log` nicht verwendet.

> 🌐 **Jetzt in der Doku lesen (25 min):** [Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) – lies «Class Members» (bis inkl. «Getters / Setters»), «Class Heritage» (nur «implements Clauses» und «extends Clauses»), «Member Visibility» und «abstract Classes and Members». Der Rest ist Nachschlagewerk.

---

## 7. Wann eine Klasse – und wann nicht?

In Java ist alles eine Klasse. In TypeScript ist das **nicht** die Norm. Faustregeln:

| Situation | Typische Lösung |
|-----------|-----------------|
| Reine Daten (DTOs, JSON, Konfiguration) | `type` + Objektliteral |
| Logik ohne Zustand (Berechnungen, Formatieren) | Funktionen in einem Modul |
| Zustand + Verhalten, das zusammengehört (Konto, Warenkorb, Cache) | **Klasse** (oder Closure wie in L3) |
| Mehrere Implementierungen einer Schnittstelle (Strategy) | `interface` + Klassen **oder** Objekte |
| Vererbungshierarchie | sparsam – oft reichen Unions (Lektion 5) |

**Besonders wichtig:** Daten, die als JSON über das Netz kommen, sind **keine Klasseninstanzen**. `JSON.parse` liefert immer einfache Objekte – Methoden gehen verloren, und `instanceof` funktioniert nicht. Darum modelliert man Daten in TypeScript fast immer mit `type`, nicht mit `class`.

---

## 8. ✍️ Übungen

```bash
npm run test:watch -- l04
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-destructuring-spread.ts` | Destructuring, Spread, unveränderliche Updates | ★★☆ |
| 2 | `02-bankkonto.ts` | Klasse mit `#privat`, Gettern, statischer Factory | ★★☆ |
| 3 | `03-formen.ts` | `abstract`, Vererbung, Template Method | ★★☆ |
| 4 | `04-notifier.ts` | `interface` + `implements`, Klasse vs. Objektliteral | ★★☆ |

> 🔍 **Recherche-Auftrag:** Finde heraus, was `Object.freeze()` macht und warum es nur «flach» wirkt. ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)) Wie unterscheidet es sich von `readonly` in TypeScript?

---

## 9. ✅ Selbstcheck

<details>
<summary>1. Wie aktualisierst du <code>user.address.city</code>, ohne <code>user</code> zu verändern?</summary>

`const updated = { ...user, address: { ...user.address, city: "Baden" } };` – jede Ebene, die sich ändert, wird neu erzeugt.
</details>

<details>
<summary>2. Was ist der Unterschied zwischen <code>private x</code> und <code>#x</code>?</summary>

`private` prüft nur der TypeScript-Compiler; zur Laufzeit ist das Feld normal zugänglich. `#x` ist echtes JavaScript und auch zur Laufzeit privat.
</details>

<details>
<summary>3. Warum funktioniert <code>obj instanceof MyInterface</code> nicht?</summary>

Interfaces existieren nur zur Compile-Zeit und werden entfernt. Zur Laufzeit gibt es nichts, womit verglichen werden könnte.
</details>

<details>
<summary>4. Was macht <code>const { password, ...publicUser } = user;</code>?</summary>

Es zieht `password` in eine eigene Variable und sammelt alle übrigen Felder in einem neuen Objekt `publicUser`.
</details>

<details>
<summary>5. Warum modelliert man JSON-Daten mit <code>type</code> und nicht mit <code>class</code>?</summary>

`JSON.parse` erzeugt einfache Objekte, keine Klasseninstanzen. Methoden und `instanceof` würden nicht funktionieren – ein `type` beschreibt genau, was wirklich ankommt.
</details>

## 10. Weiterführend (optional)

- [Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) – «Extending Types» und «Intersection Types»
- [MDN: Private properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l04` sind grün
- [ ] Ich kann eine verschachtelte unveränderliche Aktualisierung ohne Nachschauen schreiben
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 5 – Union Types und Narrowing](../l05-unions-narrowing/README.md)
