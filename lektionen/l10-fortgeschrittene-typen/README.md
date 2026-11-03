# Lektion 10 – Fortgeschrittene Typen

> ⏱ **ca. 4 Stunden** · Voraussetzung: Lektion 9 (und Projekt B) · Schwierigkeit: ●●●●●

## Darum geht's

Bis jetzt hast du Typen *beschrieben*. In dieser Lektion lernst du, Typen aus anderen Typen zu **berechnen**. Das klingt abstrakt, löst aber ein sehr praktisches Problem: **eine einzige Quelle der Wahrheit**. Statt `User`, `UserUpdate`, `UserPreview` und `NewUser` viermal von Hand zu pflegen, definierst du `User` einmal und leitest den Rest ab. Ändert sich `User`, passen sich alle abgeleiteten Typen automatisch an.

Genau diese Technik steckt hinter Bibliotheken wie Zod, React, Hono oder Prisma. Du musst nicht jeden Trick selbst schreiben können – aber du solltest die Typen in fremden Bibliotheken **lesen** können.

> ⚠️ **Wichtig:** Fortgeschrittene Typen sind ein Werkzeug, kein Ziel. In normalem Anwendungscode brauchst du vor allem Abschnitt 2 (Utility Types) und 6 (`satisfies`). Die Abschnitte 3–5 helfen dir vor allem, Bibliotheken zu verstehen. Schreib keinen Typ, den deine Teamkollegen nicht mehr lesen können.

**Nach dieser Lektion kannst du:**

- Typen aus Werten herleiten (`typeof`, `keyof`, Indexed Access)
- die eingebauten Utility Types sicher einsetzen
- Mapped Types und Conditional Types lesen und einfache selbst schreiben
- mit `satisfies` und Branded Types typsicheren Anwendungscode schreiben

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 📖 Lesen | Abschnitte 1–2 | 25 min |
| 2 | 🌐 Doku | Handbook «Utility Types» | 20 min |
| 3 | ✍️ Üben | Aufgabe 1 | 30 min |
| 4 | 📖 Lesen | Abschnitte 3–5 | 35 min |
| 5 | 🌐 Doku | Handbook «Creating Types from Types» | 40 min |
| 6 | ✍️ Üben | Aufgabe 2 | 45 min |
| 7 | 📖 Lesen | Abschnitte 6–7 | 15 min |
| 8 | ✍️ Üben | Aufgaben 3–4 | 50 min |
| 9 | 🎮 Bonus | Type Challenges (optional) | – |

---

## 1. Typen aus Werten herleiten

```ts
const DEFAULT_CONFIG = { port: 3000, host: "localhost", debug: false };
type Config = typeof DEFAULT_CONFIG;        // { port: number; host: string; debug: boolean }

type ConfigKey = keyof Config;              // "port" | "host" | "debug"
type Port = Config["port"];                 // number  ← Indexed Access

const ROLES = ["admin", "barber", "customer"] as const;
type Role = (typeof ROLES)[number];         // "admin" | "barber" | "customer"
```

Die letzte Zeile hast du in Lektion 2 schon gesehen. Jetzt verstehst du sie: `typeof ROLES` ist `readonly ["admin", "barber", "customer"]`, und `[number]` heisst «der Typ eines beliebigen Elements per Zahl-Index» – also die Union aller Elemente.

**Vorteil:** Die Liste existiert zur Laufzeit (für Dropdowns, Validierung), *und* der Typ wird daraus abgeleitet. Fügst du eine Rolle hinzu, ist der Typ automatisch aktuell.

> 💡 `typeof` hat in TypeScript zwei Bedeutungen: In normalem Code (`typeof x === "string"`) ist es der JavaScript-Operator zur Laufzeit. In einer **Typ-Position** (`type T = typeof x`) liefert es den TypeScript-Typ von `x`.

## 2. Die eingebauten Utility Types

```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  createdAt: Date;
};
```

| Utility Type | Ergebnis | Typische Verwendung |
|--------------|----------|---------------------|
| `Partial<User>` | alle Felder optional | Update-Objekte (`PATCH`) |
| `Required<T>` | alle Felder Pflicht | Gegenteil von Partial |
| `Readonly<User>` | alle Felder readonly | unveränderliche Daten |
| `Pick<User, "id" \| "name">` | nur diese Felder | Vorschau, Listenansicht |
| `Omit<User, "id" \| "createdAt">` | alle ausser diesen | «Neues Objekt erstellen» (id kommt vom Server) |
| `Record<"a" \| "b", number>` | Objekt mit genau diesen Schlüsseln | Lookup-Tabellen |
| `Exclude<"a" \| "b" \| "c", "a">` | `"b" \| "c"` | aus Unions entfernen |
| `Extract<"a" \| "b" \| 1, string>` | `"a" \| "b"` | aus Unions auswählen |
| `NonNullable<string \| null>` | `string` | null/undefined entfernen |
| `ReturnType<typeof fn>` | Rückgabetyp einer Funktion | Typ einer Funktion übernehmen |
| `Parameters<typeof fn>` | Parametertypen als Tupel | Wrapper-Funktionen |
| `Awaited<Promise<User>>` | `User` | Ergebnis eines Promise |

**Kombinieren:**

```ts
type NewUser = Omit<User, "id" | "createdAt">;               // für POST
type UserUpdate = Partial<Omit<User, "id" | "createdAt">>;  // für PATCH
type UserPreview = Pick<User, "id" | "name">;               // für Listen
```

> 🌐 **Doku (20 min):** [Handbook: Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) – überfliege alle, lies die oben genannten genau.

> ✍️ **Jetzt Aufgabe 1.**

---

## 3. Mapped Types – über Schlüssel iterieren

Wie funktioniert `Partial` eigentlich? So:

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

Lies das als Schleife über Typen: «Für jeden Schlüssel `K` in `T`: ein optionales Feld `K` mit dem Typ `T[K]`.»

Modifizierer:

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // readonly ENTFERNEN
type Concrete<T> = { [K in keyof T]-?: T[K] };         // ? ENTFERNEN (wie Required)
```

**Key Remapping** mit `as`:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
```

## 4. Conditional Types und `infer`

Ein **Conditional Type** ist ein `if` für Typen:

```ts
type IsString<T> = T extends string ? true : false;
type A = IsString<"hallo">;   // true
type B = IsString<42>;        // false
```

`T extends U` heisst hier «ist `T` zuweisbar an `U`?».

Mit **`infer`** kannst du einen Teil eines Typs «herausziehen»:

```ts
type ElementType<T> = T extends readonly (infer E)[] ? E : never;
type X = ElementType<string[]>;        // string

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type Y = UnwrapPromise<Promise<number>>;   // number
```

So ist z. B. `ReturnType` gebaut: `T extends (...args: any[]) => infer R ? R : never`.

**Distributiv über Unions:** Ist `T` eine Union, wird der Conditional Type auf jedes Mitglied einzeln angewendet:

```ts
type NoNull<T> = T extends null | undefined ? never : T;
type Z = NoNull<string | null | number>;   // string | number  (never fällt aus Unions weg)
```

## 5. Template Literal Types

```ts
type Size = "S" | "M" | "L";
type Color = "rot" | "blau";
type Variant = `${Size}-${Color}`;   // "S-rot" | "S-blau" | "M-rot" | … (alle 6 Kombinationen)

type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickHandler = EventName<"click">;   // "onClick"
```

Eingebaute Helfer: `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.

### Jetzt verstehst du auch `Equal`

In den Typ-Aufgaben verwenden wir diesen Helfer:

```ts
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
```

Er vergleicht zwei *generische Funktionstypen*, deren Ergebnis von einem Conditional Type abhängt. TypeScript hält zwei solche Funktionstypen nur dann für kompatibel, wenn `X` und `Y` **identisch** sind – nicht nur gegenseitig zuweisbar. Ein einfacheres `X extends Y ? Y extends X ? true : false : false` würde z. B. `any` und `string` für gleich halten. Du musst das nicht selbst erfinden können – die Community hat diesen Trick vor Jahren gefunden.

> 🌐 **Jetzt in der Doku lesen (40 min):** [Handbook: Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) – die Unterseiten [Keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html), [Typeof](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), [Indexed Access](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html), [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) und [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html).

> ✍️ **Jetzt Aufgabe 2.**

---

## 6. `satisfies` – prüfen, ohne den Typ zu verlieren

```ts
type Route = { path: string; method: "GET" | "POST" };

// Mit Annotation: TS «vergisst» die konkreten Schlüssel
const routes1: Record<string, Route> = {
  listServices: { path: "/services", method: "GET" },
};
routes1.listServces;   // kein Fehler (Tippfehler!) – Record<string, …> erlaubt jeden Schlüssel

// Mit satisfies: geprüft UND die genauen Schlüssel bleiben erhalten
const routes2 = {
  listServices: { path: "/services", method: "GET" },
  createBooking: { path: "/bookings", method: "POST" },
} satisfies Record<string, Route>;
routes2.listServces;   // ❌ Fehler – Tippfehler wird erkannt
type RouteName = keyof typeof routes2;   // "listServices" | "createBooking"
```

**Faustregel:** Für Konfigurationsobjekte und Lookup-Tabellen ist `satisfies` fast immer besser als eine Typ-Annotation.

## 7. Branded Types – nominale Typen wie in Java

Manchmal vermisst man die nominale Typisierung von Java: Eine `UserId` und eine `OrderId` sind beide Strings, sollen aber nicht verwechselt werden.

```ts
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

function toUserId(value: string): UserId {
  if (!value.startsWith("u_")) throw new Error(`Keine User-ID: ${value}`);
  return value as UserId;   // der einzige Ort, an dem wir «casten»
}

function findUser(id: UserId) { … }

const orderId = "o_42" as OrderId;
findUser(orderId);              // ❌ OrderId ist keine UserId
findUser("u_1");                // ❌ ein einfacher String auch nicht
findUser(toUserId("u_1"));      // ✅ nur geprüfte Werte
```

Das `& { __brand: … }` existiert nur im Typsystem – zur Laufzeit ist es ein ganz normaler String. Die Prüffunktion ist der einzige Weg, einen solchen Wert zu bekommen. Das Muster heisst auch «Parse, don't validate»: Statt Werte an vielen Stellen zu prüfen, prüfst du einmal und der *Typ* garantiert danach die Gültigkeit.

---

## 8. ✍️ Übungen

```bash
npm run test:watch -- l10
npx tsc --noEmit -p lektionen/l10-fortgeschrittene-typen
```

| Nr | Datei | Thema | Prüfung | ★ |
|----|-------|-------|---------|---|
| 1 | `01-utility-types.ts` | eingebaute Utility Types | **Compiler** | ★★☆ |
| 2 | `02-eigene-typen.ts` | Mapped, Conditional, Template Literal Types | **Compiler** | ★★★ |
| 3 | `03-typed-emitter.ts` | ein typsicherer Event-Emitter | Tests + Compiler | ★★★ |
| 4 | `04-branded-satisfies.ts` | Branded Types, `satisfies` | Tests + Compiler | ★★☆ |

> 🎮 **Bonus (optional, macht süchtig):** [Type Challenges](https://github.com/type-challenges/type-challenges) – Rätsel für das Typsystem, sortiert nach Schwierigkeit. Versuche die ersten 5 «easy»-Aufgaben. Du kannst sie direkt im Browser lösen.

---

## 9. ✅ Selbstcheck

<details>
<summary>1. Was ist der Unterschied zwischen <code>Pick</code> und <code>Omit</code>?</summary>

`Pick<T, K>` behält nur die Felder `K`. `Omit<T, K>` behält alle **ausser** `K`.
</details>

<details>
<summary>2. Wie liest du <code>{ [K in keyof T]?: T[K] }</code>?</summary>

«Für jeden Schlüssel K von T ein optionales Feld K mit dem Typ von T[K]» – das ist `Partial<T>`.
</details>

<details>
<summary>3. Was liefert <code>ElementType&lt;number[]&gt;</code> mit <code>T extends (infer E)[] ? E : never</code>?</summary>

`number` – `infer E` «fängt» den Elementtyp.
</details>

<details>
<summary>4. Warum ist <code>satisfies</code> oft besser als eine Typ-Annotation?</summary>

Es prüft, dass der Wert zum Typ passt, behält aber den genaueren, hergeleiteten Typ (z. B. die konkreten Schlüssel). Eine Annotation «verbreitert» den Typ auf den angegebenen.
</details>

<details>
<summary>5. Existiert ein Branded Type zur Laufzeit?</summary>

Nein. Zur Laufzeit ist es ein normaler Wert (z. B. String). Die Marke existiert nur im Typsystem, darum braucht es eine Prüffunktion als einzigen «Eingang».
</details>

## 10. Weiterführend (optional)

- [Total TypeScript Essentials](https://www.totaltypescript.com/books/total-typescript-essentials) – Kapitel «Deriving Types» und «Annotations and Assertions»
- [Handbook: Type Manipulation (Übersicht)](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l10` sind grün
- [ ] `npx tsc --noEmit -p lektionen/l10-fortgeschrittene-typen` ohne Fehler
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 11 – Backend-API](../l11-backend/README.md)
