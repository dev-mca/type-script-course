// Aufgabe 4 – Literal-Typen, as const und Tupel
// Tests: npm run test:watch -- l02-typsystem/uebungen/04

export type Direction = "north" | "east" | "south" | "west";

/**
 * Dreht um 90° im Uhrzeigersinn: north → east → south → west → north
 *
 * Hinweis: switch funktioniert mit Strings genau wie in Java.
 * Bonus: Lösche einen case – was sagt der Compiler? (Tipp: Rückgabetyp ist Direction.)
 */
export function turnRight(direction: Direction): Direction {
  throw new Error("TODO: Aufgabe 4.1");
}

/**
 * Gegenrichtung: north ↔ south, east ↔ west
 *
 * Diesmal ohne switch: Verwende ein Objekt vom Typ Record<Direction, Direction>.
 * Probier aus, was passiert, wenn du darin einen Schlüssel vergisst!
 */
export function opposite(direction: Direction): Direction {
  throw new Error("TODO: Aufgabe 4.2");
}

// `as const` macht aus dem Array ein readonly-Tupel mit Literal-Typen.
// Daraus leiten wir den Typ Size her: "S" | "M" | "L" | "XL"
// (Wie diese Zeile genau funktioniert, lernst du in Lektion 10.)
export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

/**
 * Wandelt einen beliebigen String in eine Size um (Gross-/Kleinschreibung egal,
 * Leerzeichen am Rand ignorieren). Ungültige Werte → Error.
 *
 * parseSize(" m ") → "M"
 * parseSize("XXL") → Error
 *
 * Hinweis: SIZES.includes(x) akzeptiert nur Size-Werte als Argument, darum meckert
 * der Compiler bei einem string. Ein üblicher Trick:
 *   (SIZES as readonly string[]).includes(x)
 * Danach musst du dem Compiler mit `as Size` sagen, dass x jetzt eine Size ist.
 * (In Lektion 5 lernst du mit Type Guards einen Weg ohne `as`.)
 */
export function parseSize(input: string): Size {
  throw new Error("TODO: Aufgabe 4.3");
}

/**
 * Liefert Minimum und Maximum als Tupel. Bei leerem Array → Error.
 * minMax([3, 1, 4, 1, 5]) → [1, 5]
 */
export function minMax(numbers: number[]): [min: number, max: number] {
  throw new Error("TODO: Aufgabe 4.4");
}

export type Point = [x: number, y: number];

/**
 * Euklidischer Abstand zweier Punkte.
 * distance([0, 0], [3, 4]) → 5
 *
 * Hinweis: Tupel kann man destrukturieren: const [x, y] = point;
 * Math.hypot(dx, dy) oder Math.sqrt(dx ** 2 + dy ** 2)
 */
export function distance(a: Point, b: Point): number {
  throw new Error("TODO: Aufgabe 4.5");
}
