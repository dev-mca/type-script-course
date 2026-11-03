// Aufgabe 1 – Zahlen
// Tests: npm run test:watch -- l01-erste-schritte/uebungen/01

/**
 * Ganzzahldivision wie in Java (`7 / 2 == 3`, `-7 / 2 == -3`).
 * Bei Division durch 0 soll ein Error mit der Meldung "Division durch 0" geworfen werden.
 *
 * Hinweis: Math.trunc vs. Math.floor – schau in Abschnitt 5 des README.
 */
export function integerDivide(a: number, b: number): number {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * Rundet `value` auf `decimals` Nachkommastellen.
 * roundTo(3.14159, 2) → 3.14
 *
 * Hinweis: Math.round rundet nur auf ganze Zahlen. Wie kannst du das ausnutzen?
 * Potenzieren geht in JS mit ** (z. B. 10 ** 2 === 100).
 */
export function roundTo(value: number, decimals: number): number {
  throw new Error("TODO: Aufgabe 1.2");
}

/**
 * Formatiert einen Betrag in Rappen als Franken-String mit genau zwei Nachkommastellen.
 * formatChf(1250) → "CHF 12.50"
 * formatChf(5)    → "CHF 0.05"
 *
 * Ist `rappen` keine Ganzzahl, soll ein Error geworfen werden
 * (Geldbeträge in Rappen sind immer ganzzahlig!).
 */
export function formatChf(rappen: number): string {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * Teilt einen Betrag (in Rappen) möglichst gerecht auf `people` Personen auf.
 * Kein Rappen darf verloren gehen: Der Rest wird von vorne verteilt.
 *
 * splitBill(1000, 3) → [334, 333, 333]
 * splitBill(1001, 4) → [251, 250, 250, 250]
 *
 * Bei people <= 0 soll ein Error geworfen werden.
 */
export function splitBill(totalRappen: number, people: number): number[] {
  throw new Error("TODO: Aufgabe 1.4");
}
