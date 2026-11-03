// Lösung Aufgabe 2 – Eigene Typ-Werkzeuge

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type MyPartial<T> = { [K in keyof T]?: T[K] };

export type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export type NullableProps<T> = { [K in keyof T]: T[K] | null };

export type ElementType<T> = T extends readonly (infer E)[] ? E : never;
// readonly (infer E)[] passt auf readonly UND normale Arrays

export type MyReturnType<T> = T extends (...args: never[]) => infer R ? R : never;
// never[] als Parametertyp: jede Funktion ist zuweisbar (Parameter sind kontravariant)

export type Unwrap<T> = T extends Promise<infer V> ? Unwrap<V> : T;

export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
// string & K: Schlüssel können auch number oder symbol sein – Capitalize braucht string

export type HandlerName<E extends string> = `on${Capitalize<E>}`;
// Template Literal Types verteilen sich automatisch über Unions

export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
// -? verhindert, dass optionale Felder undefined in die Union bringen

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T // Funktionen unverändert lassen
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> } // Objekte und Arrays rekursiv
    : T; // Primitive bleiben, wie sie sind
// Mapped Types über Arrays erzeugen wieder Arrays – darum wird number[] zu readonly number[]

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – identisch zur Aufgabe
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
