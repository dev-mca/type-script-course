// Aufgabe 1 – Generische Funktionen
// Tests: npm run test:watch -- l07-generics/uebungen/01
//
// ⚠️ Die Signaturen fehlen absichtlich teilweise! Bei jeder Funktion steht in
// der Beschreibung, welche Signatur gewünscht ist. Die Tests prüfen auch, dass
// die Typen stimmen (rote Markierungen in der Testdatei = Signatur noch falsch).

/**
 * 1.1 Letztes Element oder undefined.
 * Gewünschte Signatur: last<T>(items: readonly T[]): T | undefined
 */
export function last(items: readonly unknown[]): unknown {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * 1.2 Teilt ein Array in Stücke der Grösse `size`. Das letzte Stück darf kleiner sein.
 * chunk([1, 2, 3, 4, 5], 2) → [[1, 2], [3, 4], [5]]
 * size < 1 → Error
 *
 * Gewünschte Signatur: chunk<T>(items: readonly T[], size: number): T[][]
 */
export function chunk(items: readonly unknown[], size: number): unknown[][] {
  throw new Error("TODO: Aufgabe 1.2");
}

/**
 * 1.3 Gruppiert Elemente nach einem Schlüssel, den keyFn liefert.
 * groupBy(["Anna", "Ali", "Bob"], (s) => s[0]!) → { A: ["Anna", "Ali"], B: ["Bob"] }
 *
 * Gewünschte Signatur:
 *   groupBy<T, K extends string>(items: readonly T[], keyFn: (item: T) => K): Partial<Record<K, T[]>>
 *
 * Partial, weil nicht jeder mögliche Schlüssel vorkommen muss.
 * (Ja, es gibt Object.groupBy – hier baust du es zur Übung selbst.)
 */
export function groupBy(items: readonly unknown[], keyFn: (item: unknown) => string): unknown {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Holt ein Feld aus jedem Objekt.
 * pluck([{ name: "A", age: 1 }], "name") → ["A"]   (Typ: string[])
 *
 * Gewünschte Signatur: pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][]
 */
export function pluck(items: readonly unknown[], key: string): unknown[] {
  throw new Error("TODO: Aufgabe 1.4");
}

/**
 * 1.5 Das Element mit der höchsten Bewertung (oder undefined bei leerer Liste).
 * Bei Gleichstand gewinnt das erste.
 * maxBy(["ab", "abcd", "abc"], (s) => s.length) → "abcd"
 *
 * Gewünschte Signatur: maxBy<T>(items: readonly T[], score: (item: T) => number): T | undefined
 */
export function maxBy(items: readonly unknown[], score: (item: unknown) => number): unknown {
  throw new Error("TODO: Aufgabe 1.5");
}

/**
 * 1.6 Entfernt Duplikate anhand eines Schlüssels; das erste Vorkommen bleibt.
 * uniqueBy(users, (u) => u.email)
 *
 * Gewünschte Signatur: uniqueBy<T, K>(items: readonly T[], keyFn: (item: T) => K): T[]
 */
export function uniqueBy(items: readonly unknown[], keyFn: (item: unknown) => unknown): unknown[] {
  throw new Error("TODO: Aufgabe 1.6");
}
