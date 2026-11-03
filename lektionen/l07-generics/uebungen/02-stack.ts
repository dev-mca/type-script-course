// Aufgabe 2 – Eine generische, iterierbare Klasse
// Tests: npm run test:watch -- l07-generics/uebungen/02
//
// Baue einen Stack<T> (LIFO – last in, first out), wie java.util.ArrayDeque als Stack.
//
// Anforderungen:
// - constructor(initial?: Iterable<T>) – optional mit Startwerten; das LETZTE
//   Element von initial liegt danach oben auf dem Stack
// - push(...items: T[]): void      – ein oder mehrere Elemente oben drauflegen
// - pop(): T | undefined           – oberstes Element entfernen und zurückgeben
// - peek(): T | undefined          – oberstes Element ansehen, ohne es zu entfernen
// - get size(): number
// - isEmpty(): boolean
// - toArray(): T[]                 – Kopie, Reihenfolge von UNTEN nach OBEN
// - [Symbol.iterator]              – iteriert von OBEN nach UNTEN (ohne den Stack zu verändern)
// - map<U>(fn: (item: T) => U): Stack<U> – neuer Stack mit umgewandelten Werten,
//                                         gleiche Reihenfolge
//
// Der interne Speicher soll von aussen nicht erreichbar sein (#items).

export class Stack<T> {
  // TODO: Aufgabe 2
}
