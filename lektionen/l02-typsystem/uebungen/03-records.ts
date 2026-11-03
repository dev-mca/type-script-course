// Aufgabe 3 – Wörterbücher mit Record
// Tests: npm run test:watch -- l02-typsystem/uebungen/03
//
// Record<string, number> ist ein Objekt mit beliebigen String-Schlüsseln und number-Werten.
// Wegen noUncheckedIndexedAccess ist record[key] immer `number | undefined`.

/**
 * Zählt, wie oft jedes Wort vorkommt. Wörter sind durch Leerzeichen getrennt
 * (auch mehrere hintereinander), Gross-/Kleinschreibung egal.
 *
 * countWords("Der Hund und der Fuchs") → { der: 2, hund: 1, und: 1, fuchs: 1 }
 *
 * Hinweis: text.split(/\s+/) trennt bei beliebig vielen Leerzeichen/Tabs.
 */
export function countWords(text: string): Record<string, number> {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * Liefert den Preis eines Produkts. Gibt es das Produkt nicht, wird ein Error
 * mit der Meldung `Unbekanntes Produkt: <name>` geworfen.
 */
export function getPrice(prices: Record<string, number>, product: string): number {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * Addiert zwei Zähl-Wörterbücher. Die Eingaben dürfen NICHT verändert werden.
 * mergeCounts({ a: 1, b: 2 }, { b: 3, c: 4 }) → { a: 1, b: 5, c: 4 }
 *
 * Hinweis: for (const key in obj) liefert die Schlüssel eines Objekts.
 * Hier ist for...in richtig – wir iterieren über Objekt-Schlüssel, nicht über ein Array.
 * (Eleganter geht es mit Object.entries – das kommt in Lektion 6.)
 */
export function mergeCounts(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  throw new Error("TODO: Aufgabe 3.3");
}

/**
 * Vertauscht Schlüssel und Werte. Bei doppelten Werten gewinnt der letzte Schlüssel.
 * invert({ de: "Hallo", en: "Hello" }) → { Hallo: "de", Hello: "en" }
 */
export function invert(map: Record<string, string>): Record<string, string> {
  throw new Error("TODO: Aufgabe 3.4");
}
