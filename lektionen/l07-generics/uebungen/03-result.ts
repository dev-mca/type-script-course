// Aufgabe 3 – Ein generischer Result-Typ
// Tests: npm run test:watch -- l07-generics/uebungen/03
//
// In Lektion 5 hatte Result<T> immer einen String als Fehler. Jetzt wird auch
// der Fehlertyp generisch – mit einem Default, damit Result<number> weiterhin geht.
//
// So oder ähnlich arbeiten Bibliotheken wie «neverthrow» oder die Sprache Rust.

export type Ok<T> = { ok: true; value: T };
export type Err<E> = { ok: false; error: E };
export type Result<T, E = string> = Ok<T> | Err<E>;

/** 3.1 Erzeugt ein erfolgreiches Result. */
export function ok<T>(value: T): Ok<T> {
  throw new Error("TODO: Aufgabe 3.1");
}

/** 3.2 Erzeugt ein fehlgeschlagenes Result. */
export function err<E>(error: E): Err<E> {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Wandelt den Wert eines erfolgreichen Results um. Fehler werden
 * unverändert durchgereicht (fn wird dann NICHT aufgerufen).
 * map(ok(2), (n) => n * 10)       → ok(20)
 * map(err("x"), (n) => n * 10)    → err("x")
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  throw new Error("TODO: Aufgabe 3.3");
}

/**
 * 3.4 Wie map, aber fn liefert selbst ein Result (kann also fehlschlagen).
 * So lassen sich mehrere fehleranfällige Schritte verketten.
 * andThen(ok("42"), parseNumber) → parseNumber("42")
 * andThen(err("x"), parseNumber) → err("x")
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  throw new Error("TODO: Aufgabe 3.4");
}

/**
 * 3.5 Liefert den Wert oder – bei einem Fehler – den Ersatzwert.
 */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  throw new Error("TODO: Aufgabe 3.5");
}

/**
 * 3.6 Kombiniert eine Liste von Results:
 * - alle ok  → ok mit allen Werten (gleiche Reihenfolge)
 * - sonst    → der ERSTE Fehler
 * all([ok(1), ok(2)])          → ok([1, 2])
 * all([ok(1), err("a"), err("b")]) → err("a")
 */
export function all<T, E>(results: readonly Result<T, E>[]): Result<T[], E> {
  throw new Error("TODO: Aufgabe 3.6");
}

/**
 * 3.7 Führt fn aus und fängt Exceptions ab.
 * fromThrowable(() => JSON.parse("[1]")) → ok([1])
 * fromThrowable(() => JSON.parse("{"))   → err(<das geworfene Error-Objekt>)
 *
 * Der Fehlertyp ist unknown – denn in JS kann alles geworfen werden.
 */
export function fromThrowable<T>(fn: () => T): Result<T, unknown> {
  throw new Error("TODO: Aufgabe 3.7");
}
