// Aufgabe 2 – Strings
// Tests: npm run test:watch -- l01-erste-schritte/uebungen/02

/**
 * Liefert die Initialen eines Namens in Grossbuchstaben.
 * initials("Melih Can")             → "MC"
 * initials("  anna   maria  meier ") → "AMM"   (mehrere Leerzeichen!)
 * initials("")                      → ""
 *
 * Hinweis: trim(), split(" ") und leere Teile überspringen.
 */
export function initials(fullName: string): string {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * Erzeugt eine Rechnungsnummer im Format "RE-<Jahr>-<4-stellige Nummer>".
 * formatInvoiceNumber(2026, 7)    → "RE-2026-0007"
 * formatInvoiceNumber(2026, 12345) → "RE-2026-12345"  (längere Nummern nicht abschneiden)
 */
export function formatInvoiceNumber(year: number, sequence: number): string {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * Kürzt einen Text auf maximal `maxLength` Zeichen. Wird gekürzt, ist das letzte
 * Zeichen "…" (ein einzelnes Zeichen!) und die Gesamtlänge genau `maxLength`.
 * truncate("Hallo Welt", 8)  → "Hallo W…"
 * truncate("Hallo", 10)      → "Hallo"
 */
export function truncate(text: string, maxLength: number): string {
  throw new Error("TODO: Aufgabe 2.3");
}

/**
 * Zählt, wie oft `word` in `text` vorkommt – Gross-/Kleinschreibung egal.
 * countOccurrences("Das ist das Haus, das ich meine.", "das") → 3
 *
 * Hinweis: Es gibt mehrere Wege. Einer davon: split.
 */
export function countOccurrences(text: string, word: string): number {
  throw new Error("TODO: Aufgabe 2.4");
}

/**
 * Wandelt einen Titel in einen URL-Slug um:
 * - alles klein
 * - ä→ae, ö→oe, ü→ue (vor dem nächsten Schritt!)
 * - jede Folge von Zeichen, die keine Buchstaben a–z oder Ziffern sind, wird zu EINEM "-"
 * - keine "-" am Anfang oder Ende
 *
 * slugify("Hallo Welt!")                  → "hallo-welt"
 * slugify("Über 100 Tipps & Tricks")      → "ueber-100-tipps-tricks"
 * slugify("  --TypeScript  ist toll--  ") → "typescript-ist-toll"
 *
 * Hinweis: Reguläre Ausdrücke schreibt man in JS als Literal: /[^a-z0-9]+/g
 * Das g (global) heisst: alle Treffer ersetzen, nicht nur den ersten.
 */
export function slugify(title: string): string {
  throw new Error("TODO: Aufgabe 2.5");
}
