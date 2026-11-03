// Aufgabe 2 – Eigene Typ-Werkzeuge (wird vom COMPILER geprüft)
//
// Baue die folgenden Typen selbst – OHNE die eingebauten Utility Types
// (Partial, Readonly, Pick, ReturnType, …) zu verwenden. Erlaubt sind Mapped
// Types, Conditional Types, infer, keyof, Template Literal Types und die
// String-Helfer Capitalize/Uppercase.
//
// Fertig, wenn keine roten Markierungen mehr da sind.

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

// TODO 2.1: Alle Felder optional (wie Partial)
export type MyPartial<T> = unknown;

// TODO 2.2: Alle Felder readonly (wie Readonly)
export type MyReadonly<T> = unknown;

// TODO 2.3: Nur die Felder K (wie Pick). K muss ein Schlüssel von T sein!
export type MyPick<T, K> = unknown;

// TODO 2.4: Alle readonly-Modifizierer entfernen
export type Mutable<T> = unknown;

// TODO 2.5: Jedes Feld darf zusätzlich null sein: { a: string } → { a: string | null }
export type NullableProps<T> = unknown;

// TODO 2.6: Elementtyp eines Arrays; kein Array → never
//   ElementType<string[]> = string,  ElementType<readonly number[]> = number
export type ElementType<T> = unknown;

// TODO 2.7: Rückgabetyp einer Funktion (wie ReturnType); keine Funktion → never
export type MyReturnType<T> = unknown;

// TODO 2.8: Promise auspacken – auch verschachtelt; kein Promise → T selbst
//   Unwrap<Promise<Promise<number>>> = number,  Unwrap<string> = string
//   Tipp: Ein Typ darf sich selbst verwenden (Rekursion).
export type Unwrap<T> = unknown;

// TODO 2.9: Für jedes Feld eine Getter-Funktion:
//   Getters<{ name: string; age: number }> = { getName: () => string; getAge: () => number }
//   Tipp: Key Remapping mit `as` und Capitalize<string & K>
export type Getters<T> = unknown;

// TODO 2.10: Event-Handler-Namen aus Event-Namen:
//   HandlerName<"click" | "submit"> = "onClick" | "onSubmit"
export type HandlerName<E extends string> = unknown;

// TODO 2.11 ★: Alle Schlüssel von T, deren Wert vom Typ V ist:
//   KeysOfType<{ a: string; b: number; c: string }, string> = "a" | "c"
//   Tipp: Mapped Type, der für passende Schlüssel K und sonst never liefert,
//   und dann mit [keyof T] die Werte als Union auslesen.
export type KeysOfType<T, V> = unknown;

// TODO 2.12 ★★: Readonly bis in jede Verschachtelungstiefe
//   Funktionen sollen unverändert bleiben.
export type DeepReadonly<T> = unknown;

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – NICHT verändern
// ─────────────────────────────────────────────────────────────────────────────

type Service = { readonly id: string; name: string; price: number; tags: string[] };
type Nested = { a: { b: { c: number[] } }; fn: () => void };

export type Checks = [
  Expect<Equal<MyPartial<{ a: string; b: number }>, { a?: string; b?: number }>>,
  Expect<Equal<MyReadonly<{ a: string }>, { readonly a: string }>>,
  Expect<Equal<MyPick<Service, "name" | "price">, { name: string; price: number }>>,
  Expect<Equal<Mutable<Service>, { id: string; name: string; price: number; tags: string[] }>>,
  Expect<Equal<NullableProps<{ a: string; b: number }>, { a: string | null; b: number | null }>>,
  Expect<Equal<ElementType<string[]>, string>>,
  Expect<Equal<ElementType<readonly number[]>, number>>,
  Expect<Equal<ElementType<string>, never>>,
  Expect<Equal<MyReturnType<() => boolean>, boolean>>,
  Expect<Equal<MyReturnType<(a: number, b: string) => Promise<void>>, Promise<void>>>,
  Expect<Equal<MyReturnType<string>, never>>,
  Expect<Equal<Unwrap<Promise<number>>, number>>,
  Expect<Equal<Unwrap<Promise<Promise<string>>>, string>>,
  Expect<Equal<Unwrap<boolean>, boolean>>,
  Expect<
    Equal<Getters<{ name: string; age: number }>, { getName: () => string; getAge: () => number }>
  >,
  Expect<Equal<HandlerName<"click" | "submit">, "onClick" | "onSubmit">>,
  Expect<Equal<KeysOfType<{ a: string; b: number; c: string }, string>, "a" | "c">>,
  Expect<Equal<KeysOfType<Service, number>, "price">>,
  Expect<Equal<DeepReadonly<Nested>["a"]["b"]["c"], readonly number[]>>,
  Expect<Equal<DeepReadonly<Nested>["fn"], () => void>>,
];

export function checks(): void {
  // @ts-expect-error – MyPick darf nur echte Schlüssel akzeptieren
  type Invalid = MyPick<Service, "color">;

  const deep = {} as DeepReadonly<Nested>;
  // @ts-expect-error – auch tief verschachtelt readonly
  deep.a.b.c = [];
  // @ts-expect-error – readonly Arrays haben kein push
  deep.a.b.c.push(1);
}
