// Aufgabe 2 – Mit unknown sicher umgehen
// Tests: npm run test:watch -- l02-typsystem/uebungen/02
//
// Werte vom Typ unknown darfst du erst benutzen, nachdem du ihren Typ geprüft hast.
// Werkzeuge dafür (ausführlich in Lektion 5):
//   typeof x === "string" | "number" | "boolean" | "object" | "function" | "undefined"
//   x === null           (Achtung: typeof null ist "object"!)
//   Array.isArray(x)

/**
 * Beschreibt einen beliebigen Wert mit einem kurzen Text:
 *   null              → "null"
 *   undefined         → "undefined"
 *   "Hallo"           → "string (5 Zeichen)"
 *   42                → "number"
 *   true              → "boolean"
 *   [1, 2, 3]         → "array (3 Elemente)"
 *   { a: 1 }          → "object"
 *   () => {}          → "function"
 *
 * Reihenfolge der Prüfungen beachten: Arrays und null sind laut typeof auch "object"!
 */
export function describeValue(value: unknown): string {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * Liest ein Alter aus einem unbekannten Wert (z. B. aus einem JSON-Formular).
 * Erlaubt sind Zahlen und Strings, die eine Zahl enthalten (" 42 ").
 * Gültig ist nur eine ganze Zahl von 0 bis 150. Alles andere → Error werfen.
 *
 * parseAge(42)    → 42
 * parseAge("42")  → 42
 * parseAge(42.5)  → Error
 * parseAge(true)  → Error
 * parseAge(null)  → Error
 */
export function parseAge(input: unknown): number {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * Prüft, ob `input` ein Array ist, das nur aus Zahlen besteht, und gibt eine
 * KOPIE davon als number[] zurück. Sonst: TypeError werfen.
 *
 * Hinweis: Nach Array.isArray(input) ist input vom Typ any[]. Kopiere die Werte
 * nach der Prüfung einzeln in ein neues number[].
 */
export function toNumberArray(input: unknown): number[] {
  throw new Error("TODO: Aufgabe 2.3");
}
