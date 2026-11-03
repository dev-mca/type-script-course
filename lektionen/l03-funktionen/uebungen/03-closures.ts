// Aufgabe 3 – Closures
// Tests: npm run test:watch -- l03-funktionen/uebungen/03

export type Counter = {
  increment: () => number; // erhöht um 1, gibt den neuen Wert zurück
  decrement: () => number; // verringert um 1, gibt den neuen Wert zurück
  value: () => number; // aktueller Wert
  reset: () => void; // zurück auf den Startwert
};

/**
 * 3.1 Erzeugt einen Zähler mit privatem Zustand (keine Klasse verwenden!).
 * Jeder Aufruf von createCounter liefert einen unabhängigen Zähler.
 */
export function createCounter(start = 0): Counter {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * 3.2 Liefert eine Funktion, die bei jedem Aufruf eine neue ID erzeugt:
 * const nextUserId = createIdGenerator("u");
 * nextUserId() → "u-1"
 * nextUserId() → "u-2"
 */
export function createIdGenerator(prefix: string): () => string {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Liefert eine Funktion, die `fn` nur beim ERSTEN Aufruf ausführt.
 * Alle weiteren Aufrufe geben das gespeicherte Ergebnis des ersten Aufrufs zurück.
 *
 * Das <T> kennst du von Java-Generics: T ist der Rückgabetyp von fn.
 * (Generics vertiefen wir in Lektion 7.)
 *
 * Achtung: fn darf auch undefined zurückgeben. Merke dir also nicht nur das
 * Ergebnis, sondern separat, OB fn schon aufgerufen wurde.
 */
export function once<T>(fn: () => T): () => T {
  throw new Error("TODO: Aufgabe 3.3");
}

/**
 * 3.4 Liefert eine Version von `fn`, die sich Ergebnisse merkt (Memoization).
 * Wird die Funktion mit einem Argument aufgerufen, das schon einmal vorkam,
 * wird das gespeicherte Ergebnis zurückgegeben, ohne fn erneut aufzurufen.
 *
 * Hinweis: Eine Map funktioniert wie HashMap in Java:
 *   const cache = new Map<number, number>();
 *   cache.has(k), cache.get(k), cache.set(k, v)
 */
export function memoize(fn: (n: number) => number): (n: number) => number {
  throw new Error("TODO: Aufgabe 3.4");
}
