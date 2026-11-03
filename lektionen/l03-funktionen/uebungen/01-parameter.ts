// Aufgabe 1 – Parameter
// Tests: npm run test:watch -- l03-funktionen/uebungen/01
//
// ⚠️ Bei dieser Aufgabe sind die Signaturen absichtlich UNVOLLSTÄNDIG.
// Deine erste Aufgabe ist jeweils, die Parameter zu ergänzen. Solange sie fehlen,
// zeigt IntelliJ in der Testdatei rote Fehler – die verschwinden, sobald die
// Signatur stimmt.

/**
 * 1.1 Begrüssung mit optionaler Grussformel (Standard: "Hallo").
 * greet("Melih")           → "Hallo Melih!"
 * greet("Melih", "Grüezi") → "Grüezi Melih!"
 *
 * TODO: Ergänze einen zweiten Parameter `greeting` mit Default-Wert.
 */
export function greet(name: string): string {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * 1.2 Summe beliebig vieler Zahlen.
 * sum()        → 0
 * sum(1, 2, 3) → 6
 *
 * TODO: Ergänze einen Rest-Parameter.
 */
export function sum(): number {
  throw new Error("TODO: Aufgabe 1.2");
}

/**
 * 1.3 Durchschnitt beliebig vieler Zahlen – oder undefined, wenn keine übergeben wurden.
 * average(2, 4, 6) → 4
 * average()        → undefined
 *
 * TODO: Signatur ergänzen. Tipp: Verwende deine sum-Funktion mit Spread: sum(...numbers)
 */
export function average(): number | undefined {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Formatiert einen Betrag in Rappen. Optional kann ein Objekt mit Optionen
 * übergeben werden:
 *   currency – Währungskürzel, Standard "CHF"
 *   decimals – Anzahl Nachkommastellen, Standard 2
 *
 * formatPrice(1250)                      → "CHF 12.50"
 * formatPrice(1250, { currency: "EUR" }) → "EUR 12.50"
 * formatPrice(1250, { decimals: 0 })     → "CHF 13"
 *
 * TODO: Ergänze einen optionalen Parameter `options` mit Typ
 *   { currency?: string; decimals?: number }
 * und verwende Destructuring mit Defaults:
 *   function f(x: number, { currency = "CHF", decimals = 2 }: { … } = {})
 * Das `= {}` am Ende sorgt dafür, dass der ganze Parameter weggelassen werden darf.
 */
export function formatPrice(rappen: number): string {
  throw new Error("TODO: Aufgabe 1.4");
}
