// Aufgabe 5 – Generische Typen (wird vom COMPILER geprüft)
//
// Fertig, wenn diese Datei keine roten Markierungen mehr hat:
//   npx tsc --noEmit -p lektionen/l07-generics
//
// Neu: Neben @ts-expect-error verwenden wir hier Expect<Equal<A, B>>.
// Das kompiliert nur, wenn A und B GENAU derselbe Typ sind.
// (Wie Equal funktioniert, ist fortgeschrittene Typ-Magie – das verstehst du
// nach Lektion 10. Hier benutzt du es einfach.)
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

// TODO 5.1: Ein Paar aus zwei Werten, die verschiedene Typen haben dürfen.
// Wird der zweite Typ weggelassen, ist er gleich dem ersten.
//   Pair<string, number> = [string, number]
//   Pair<boolean>        = [boolean, boolean]
export type Pair<A, B = unknown> = unknown;

// TODO 5.2: Ein Wert, der auch null sein darf.
export type Nullable<T> = unknown;

// TODO 5.3: Eine API-Antwort: entweder erfolgreich mit Daten oder ein Fehler.
//   { status: "success"; data: T } | { status: "error"; message: string }
export type ApiResponse<T> = unknown;

// TODO 5.4: Ein Wörterbuch mit String-Schlüsseln und Werten vom Typ T
export type Dictionary<T> = unknown;

// TODO 5.5: Eine Seite aus einer paginierten Liste
//   items: Liste von T, page: Zahl, totalPages: Zahl
export type Page<T> = unknown;

// TODO 5.6: Ein Repository-Interface für beliebige Entitäten mit einer id.
// T muss ein Feld `id` vom Typ string haben (Einschränkung mit extends!).
//   findById(id: string): T | undefined
//   findAll(): T[]
//   save(entity: T): void
export interface Repository<T> {}

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – NICHT verändern
// ─────────────────────────────────────────────────────────────────────────────

type User = { id: string; name: string };

export type Checks = [
  Expect<Equal<Pair<string, number>, [string, number]>>,
  Expect<Equal<Pair<boolean>, [boolean, boolean]>>,
  Expect<Equal<Nullable<number>, number | null>>,
  Expect<Equal<Dictionary<boolean>, Record<string, boolean>>>,
  Expect<Equal<Page<User>["items"], User[]>>,
];

export function checks(): void {
  const r1: ApiResponse<User[]> = { status: "success", data: [{ id: "u1", name: "Melih" }] };
  const r2: ApiResponse<User[]> = { status: "error", message: "Nicht gefunden" };
  // @ts-expect-error – im Fehlerfall gibt es keine data
  const r3: ApiResponse<User[]> = { status: "error", data: [] };
  // @ts-expect-error – data muss vom richtigen Typ sein
  const r4: ApiResponse<User[]> = { status: "success", data: "keine Liste" };

  const page: Page<User> = { items: [], page: 1, totalPages: 3 };
  // @ts-expect-error – totalPages fehlt
  const brokenPage: Page<User> = { items: [], page: 1 };

  const repo: Repository<User> = {
    findById: (id) => ({ id, name: "Test" }),
    findAll: () => [],
    save: () => {},
  };
  const found: User | undefined = repo.findById("u1");

  // @ts-expect-error – number hat kein id-Feld, darf also kein Repository-Typ sein
  type NumberRepo = Repository<number>;

  console.log(r1, r2, r3, r4, page, brokenPage, found);
}
