// Aufgabe 2 – Higher-Order Functions
// Tests: npm run test:watch -- l03-funktionen/uebungen/02

/** Ein Funktionstyp, den wir mehrfach brauchen */
export type NumberFn = (n: number) => number;

/**
 * 2.1 Wendet f zweimal an: applyTwice(f, x) === f(f(x))
 * applyTwice((n) => n + 3, 10) → 16
 */
export function applyTwice(f: NumberFn, x: number): number {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * 2.2 Verkettet zwei Funktionen: compose(f, g) liefert eine NEUE Funktion,
 * die zuerst g und dann f anwendet – also x => f(g(x)).
 * (So schreibt man es in der Mathematik: (f ∘ g)(x))
 *
 * const plusOneThenDouble = compose(double, plusOne);
 * plusOneThenDouble(5) → 12
 */
export function compose(f: NumberFn, g: NumberFn): NumberFn {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * 2.3 Wie compose, aber für beliebig viele Funktionen und in Lese-Reihenfolge
 * (links nach rechts). Ohne Funktionen: die Zahl unverändert zurückgeben.
 *
 * pipe(plusOne, double, square)(2) → ((2 + 1) * 2)² = 36
 * pipe()(7) → 7
 */
export function pipe(...fns: NumberFn[]): NumberFn {
  throw new Error("TODO: Aufgabe 2.3");
}

/**
 * 2.4 Ruft fn für i = 0 … n-1 auf und sammelt die Ergebnisse.
 * times(3, (i) => `Zeile ${i}`) → ["Zeile 0", "Zeile 1", "Zeile 2"]
 */
export function times(n: number, fn: (i: number) => string): string[] {
  throw new Error("TODO: Aufgabe 2.4");
}

/**
 * 2.5 Erzeugt eine Prüf-Funktion für einen Zahlenbereich (inklusive Grenzen).
 * const isValidAge = between(0, 150);
 * isValidAge(42)  → true
 * isValidAge(151) → false
 */
export function between(min: number, max: number): (n: number) => boolean {
  throw new Error("TODO: Aufgabe 2.5");
}

/**
 * 2.6 Zählt, wie viele Zahlen das Prädikat erfüllen.
 * countWhere([1, 5, 10, 15], between(4, 11)) → 2
 */
export function countWhere(numbers: number[], predicate: (n: number) => boolean): number {
  throw new Error("TODO: Aufgabe 2.6");
}
