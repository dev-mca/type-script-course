# Lektion 6 – Arrays und Collections

> ⏱ **ca. 4 Stunden** · Voraussetzung: Lektion 5 · Schwierigkeit: ●●●○○

## Darum geht's

In Java arbeitest du mit `List`, `Map`, `Set` und – für Transformationen – mit Streams (`.stream().filter().map().collect()`). In TypeScript sind die wichtigsten Werkzeuge **direkt am Array** eingebaut: `map`, `filter`, `reduce` & Co. Kein `.stream()`, kein `.collect()`. Dazu kommen `Map` und `Set`, die fast wie in Java funktionieren.

Diese Lektion ist sehr praxisnah: Du wertest einen kleinen Datensatz von Bestellungen aus – genau die Art Code, die du in einem Dashboard oder einer API ständig schreibst.

**Nach dieser Lektion kannst du:**

- Daten mit `map`, `filter`, `reduce`, `find`, `some`, `every`, `flatMap` verarbeiten
- sicher sortieren (und die Standard-Sortier-Falle vermeiden)
- Daten gruppieren und zählen – mit `Record`, `Map` und `Object.groupBy`
- entscheiden, wann `Map`/`Set` und wann ein einfaches Objekt/Array passt

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 🧠 Aufwärmen | Sortier-Quiz (Abschnitt 1) | 5 min |
| 2 | 📖 Lesen | Abschnitte 2–3 | 25 min |
| 3 | ▶️ Ausprobieren | `beispiele/01-streams-vergleich.ts` | 15 min |
| 4 | ✍️ Üben | Aufgabe 1 | 40 min |
| 5 | 📖 Lesen | Abschnitte 4–5 | 20 min |
| 6 | 🌐 Doku | MDN Array-Referenz (gezielt) | 20 min |
| 7 | ✍️ Üben | Aufgaben 2–3 | 60 min |
| 8 | 📖 Lesen | Abschnitt 6 (Map & Set) | 15 min |
| 9 | ✍️ Üben | Aufgabe 4 | 35 min |

---

## 1. 🧠 Aufwärmen

```ts
console.log([10, 9, 1, 100].sort());
console.log(["b", "a", "C"].sort());
```

<details>
<summary>Auflösung</summary>

```text
[1, 10, 100, 9]   ← !!!
["C", "a", "b"]
```

`sort()` ohne Vergleichsfunktion wandelt alles in **Strings** um und sortiert nach UTF-16-Code. `"10"` kommt vor `"9"`, und Grossbuchstaben vor Kleinbuchstaben. Ausserdem **verändert** `sort()` das Original-Array. Zwei Fallen auf einmal – mehr in Abschnitt 4.
</details>

---

## 2. Die wichtigsten Array-Methoden

```ts
const prices = [4500, 2500, 8000, 1200];

prices.map((p) => p / 100);              // [45, 25, 80, 12]        – jedes Element umwandeln
prices.filter((p) => p > 2000);          // [4500, 2500, 8000]      – Elemente auswählen
prices.find((p) => p > 5000);            // 8000                    – erstes passendes (oder undefined)
prices.findIndex((p) => p > 5000);       // 2                       – Index davon (oder -1)
prices.some((p) => p > 5000);            // true                    – mindestens eins?
prices.every((p) => p > 1000);           // true                    – alle?
prices.includes(2500);                   // true                    – enthalten? (mit ===)
prices.reduce((sum, p) => sum + p, 0);   // 16200                   – zu einem Wert zusammenfassen
prices.join(", ");                       // "4500, 2500, 8000, 1200"
prices.at(-1);                           // 1200                    – letztes Element
prices.slice(1, 3);                      // [2500, 8000]            – Ausschnitt (Kopie)

[[1, 2], [3]].flat();                    // [1, 2, 3]
["a b", "c"].flatMap((s) => s.split(" ")); // ["a", "b", "c"]       – map + flat in einem
```

### Java Streams → TypeScript

| Java | TypeScript |
|------|------------|
| `list.stream().map(f).collect(toList())` | `list.map(f)` |
| `.filter(p)` | `.filter(p)` |
| `.flatMap(x -> x.stream())` | `.flatMap((x) => x)` |
| `.reduce(0, Integer::sum)` | `.reduce((a, b) => a + b, 0)` |
| `.findFirst()` → `Optional<T>` | `.find(p)` → `T \| undefined` |
| `.anyMatch(p)` / `.allMatch(p)` | `.some(p)` / `.every(p)` |
| `.count()` | `.length` (nach `filter`) |
| `.sorted(comparator)` | `.toSorted(comparator)` |
| `.distinct()` | `[...new Set(list)]` |
| `.limit(n)` / `.skip(n)` | `.slice(0, n)` / `.slice(n)` |
| `Collectors.joining(", ")` | `.join(", ")` |
| `Collectors.groupingBy(f)` | `Object.groupBy(list, f)` oder `Map.groupBy(list, f)` |
| `IntStream.range(0, n)` | `Array.from({ length: n }, (_, i) => i)` |

### Ein wichtiger Unterschied: eager statt lazy

Java-Streams sind *lazy*: Erst die Terminal-Operation (`collect`) löst die Verarbeitung aus. Array-Methoden in JavaScript sind **eager**: Jedes `map` und `filter` erzeugt sofort ein neues Array. Für die Datenmengen in normalen Apps (Hunderte bis Zehntausende Einträge) spielt das keine Rolle. Und du brauchst kein `.collect()` – das Ergebnis ist schon ein Array.

> 💡 Für echte Lazy-Verarbeitung gibt es seit ES2025 *Iterator Helpers* (`array.values().filter(…).map(…).take(5).toArray()`). Die brauchst du selten – gut zu wissen, dass es sie gibt.

## 3. `reduce` richtig verwenden

`reduce` ist das mächtigste, aber auch das am schwersten lesbare Werkzeug. Es fasst ein Array zu **einem** Wert zusammen – das kann eine Zahl sein, aber auch ein Objekt oder eine Map.

```ts
type Item = { name: string; price: number; qty: number };
const cart: Item[] = [
  { name: "Shampoo", price: 1500, qty: 2 },
  { name: "Kamm", price: 800, qty: 1 },
];

// Summe
const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);   // 3800

// Zu einem Objekt (Startwert und Typ angeben!)
const qtyByName = cart.reduce<Record<string, number>>((acc, item) => {
  acc[item.name] = item.qty;
  return acc;
}, {});
```

**Faustregeln:**

- **Immer einen Startwert** angeben (`, 0` bzw. `, {}`). Ohne Startwert stürzt `reduce` bei einem leeren Array ab.
- Wenn ein `reduce` länger als drei Zeilen wird, ist eine `for...of`-Schleife oft lesbarer. **Das ist völlig in Ordnung.** Professioneller Code ist lesbarer Code, nicht möglichst «funktionaler» Code.

> ✍️ **Jetzt Aufgabe 1** (`uebungen/01-grundlagen.ts`). Die Daten liegen in `uebungen/daten.ts` – schau sie dir zuerst an.

---

## 4. Sortieren – ohne in die Fallen zu tappen

```ts
const numbers = [10, 9, 1, 100];

numbers.sort((a, b) => a - b);          // aufsteigend: [1, 9, 10, 100]  ⚠️ verändert numbers!
const sorted = numbers.toSorted((a, b) => b - a);  // absteigend, Original bleibt  ✅
```

Die Vergleichsfunktion funktioniert wie `Comparator.compare` in Java: negativ → `a` zuerst, positiv → `b` zuerst, `0` → gleich.

| Mutiert das Original ⚠️ | Liefert eine Kopie ✅ |
|---|---|
| `sort()` | `toSorted()` |
| `reverse()` | `toReversed()` |
| `splice()` | `toSpliced()` |
| `arr[i] = x` | `arr.with(i, x)` |
| `push()`, `pop()`, `shift()`, `unshift()` | `[...arr, x]`, `arr.slice(0, -1)` … |

**Strings sortieren:** Für Text, den Menschen lesen, immer `localeCompare` verwenden – sonst landen Umlaute und Grossbuchstaben an seltsamen Stellen:

```ts
["Zürich", "Ärzte", "Bern"].toSorted();                                  // ["Bern", "Zürich", "Ärzte"] ❌
["Zürich", "Ärzte", "Bern"].toSorted((a, b) => a.localeCompare(b, "de")); // ["Ärzte", "Bern", "Zürich"] ✅
```

**Nach mehreren Kriterien sortieren:**

```ts
orders.toSorted((a, b) =>
  b.total - a.total ||                 // zuerst nach Betrag absteigend
  a.customer.localeCompare(b.customer) // bei Gleichstand nach Name
);
```

Der Trick mit `||`: Ist die erste Differenz `0` (falsy), wird das zweite Kriterium ausgewertet. (Das ist einer der wenigen Fälle, in denen `||` mit Zahlen genau richtig ist.)

## 5. Objekte als Collections: `Object.entries` und Co.

```ts
const stock = { Shampoo: 12, Kamm: 0, Wachs: 5 };

Object.keys(stock);     // ["Shampoo", "Kamm", "Wachs"]
Object.values(stock);   // [12, 0, 5]
Object.entries(stock);  // [["Shampoo", 12], ["Kamm", 0], ["Wachs", 5]]

// Transformieren: entries → Array-Methoden → fromEntries
const inStock = Object.fromEntries(
  Object.entries(stock).filter(([, qty]) => qty > 0),
);  // { Shampoo: 12, Wachs: 5 }

// Gruppieren (seit ES2024)
const byFirstLetter = Object.groupBy(["Anna", "Ali", "Bob"], (name) => name[0] ?? "?");
// { A: ["Anna", "Ali"], B: ["Bob"] }
```

> ⚠️ `Object.keys` liefert in TypeScript immer `string[]`, nicht `(keyof typeof stock)[]`. Das ist Absicht: Wegen der strukturellen Typisierung könnte ein Objekt zur Laufzeit mehr Schlüssel haben, als sein Typ verrät.

> 🌐 **Jetzt in der Doku stöbern (20 min):** Öffne die [MDN Array-Referenz](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) und scrolle zur Liste «Instance methods». Lies zu jeder Methode nur den Einzeiler. Markiere dir drei, die du noch nicht kanntest, und probiere sie im Playground aus. Danach: [`Object.groupBy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy).

> ✍️ **Jetzt Aufgaben 2 und 3.**

---

## 6. `Map` und `Set`

```ts
const visits = new Map<string, number>();
visits.set("Melih", 3);
visits.set("Anna", 1);
visits.get("Melih");          // 3
visits.get("Bob");            // undefined
visits.has("Anna");           // true
visits.size;                  // 2  (Eigenschaft, nicht Methode)
for (const [name, count] of visits) { }   // Einträge in Einfüge-Reihenfolge

const tags = new Set(["vip", "neu", "vip"]);   // { "vip", "neu" }
tags.has("vip");              // true
[...tags];                    // ["vip", "neu"] – zurück zum Array
```

### Map oder Objekt? Set oder Array?

| Verwende … | wenn … |
|------------|--------|
| **Objekt / `Record`** | die Schlüssel feste, bekannte Strings sind (Konfiguration, JSON-Daten), oder du es als JSON verschicken willst |
| **`Map`** | Schlüssel dynamisch sind (Benutzereingaben, IDs), nicht-String-Schlüssel nötig sind (Zahlen, Objekte), oder du oft hinzufügst/entfernst |
| **Array** | Reihenfolge und Duplikate wichtig sind |
| **`Set`** | du schnell «ist enthalten?» prüfen oder Duplikate entfernen willst |

### Achtung: Objekte als Schlüssel

Wie in Java ohne überschriebenes `equals`/`hashCode` vergleichen `Map` und `Set` Objekte **per Referenz**:

```ts
const set = new Set([{ id: 1 }]);
set.has({ id: 1 });   // false – ein anderes Objekt mit gleichem Inhalt
```

Es gibt kein `equals`/`hashCode` zum Überschreiben. Die Lösung ist fast immer: einen **primitiven Schlüssel** verwenden (`set.add(user.id)` statt `set.add(user)`).

> ⚠️ **Map und JSON:** `JSON.stringify(new Map(...))` ergibt `{}`. Willst du eine Map verschicken, wandle sie vorher um: `Object.fromEntries(map)`.

---

## 7. ✍️ Übungen

```bash
npm run test:watch -- l06
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-grundlagen.ts` | `map`, `filter`, `reduce`, `find`, `some`, `every`, `flatMap` | ★☆☆ |
| 2 | `02-gruppieren.ts` | gruppieren, zählen, Top-N | ★★☆ |
| 3 | `03-sortieren.ts` | `toSorted`, `localeCompare`, Rangliste | ★★☆ |
| 4 | `04-map-set.ts` | `Map`, `Set`, Mengenoperationen | ★★☆ |

**Regel für alle Aufgaben:** Die Eingaben werden nie verändert. Die Tests prüfen das.

> 🔍 **Recherche-Auftrag:** Was ist der Unterschied zwischen `Object.groupBy` und `Map.groupBy`? Wann würdest du welches verwenden? ([MDN Map.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/groupBy))

---

## 8. ✅ Selbstcheck

<details>
<summary>1. Warum ergibt <code>[10, 9, 1].sort()</code> nicht <code>[1, 9, 10]</code>?</summary>

Ohne Vergleichsfunktion sortiert `sort` die Elemente als Strings. `"10"` < `"9"`, weil `"1"` < `"9"`. Lösung: `(a, b) => a - b`.
</details>

<details>
<summary>2. Was ist der Unterschied zwischen <code>sort</code> und <code>toSorted</code>?</summary>

`sort` sortiert das Array an Ort und Stelle (verändert es). `toSorted` liefert ein neues, sortiertes Array und lässt das Original unverändert.
</details>

<details>
<summary>3. Was liefert <code>[].reduce((a, b) => a + b)</code>?</summary>

Einen `TypeError` – ohne Startwert kann `reduce` bei einem leeren Array nichts zurückgeben. Darum immer einen Startwert angeben.
</details>

<details>
<summary>4. Wann nimmst du eine <code>Map</code> statt eines <code>Record</code>?</summary>

Bei dynamischen Schlüsseln, Nicht-String-Schlüsseln oder vielen Einfüge-/Löschoperationen. Für feste Strukturen und JSON ist ein Objekt besser.
</details>

<details>
<summary>5. Wie entfernst du Duplikate aus einem Array?</summary>

`[...new Set(array)]` – funktioniert für Primitive. Für Objekte über einen Schlüssel, z. B. mit einer `Map` von `id` → Objekt.
</details>

## 9. Weiterführend (optional)

- [MDN: Indexed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections) und [Keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)
- [javascript.info: Array methods](https://javascript.info/array-methods) – mit vielen kleinen Übungen
- [MDN: Iterator helpers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator#iterator_helper_objects) – die lazy Alternative

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l06` sind grün
- [ ] Ich kann ohne Nachschauen eine Liste nach zwei Kriterien sortieren
- [ ] `FORTSCHRITT.md` aktualisiert und committet

🎯 **Jetzt ist Zeit für [Projekt A – Terminplaner](../../projekte/projekt-a-terminplaner/README.md)!** Danach weiter mit [Lektion 7 – Generics](../l07-generics/README.md).
