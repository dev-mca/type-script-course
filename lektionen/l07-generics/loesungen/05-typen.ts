// Lösung Aufgabe 5 – Generische Typen

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export type Pair<A, B = A> = [A, B]; // Default darf auf frühere Parameter verweisen

export type Nullable<T> = T | null;

export type ApiResponse<T> = { status: "success"; data: T } | { status: "error"; message: string };

export type Dictionary<T> = Record<string, T>;

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
};

export interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – identisch zur Aufgabe
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
