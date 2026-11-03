// Aufgabe 3 – null, undefined, truthy/falsy
// Tests: npm run test:watch -- l01-erste-schritte/uebungen/03
//
// `string | null | undefined` heisst: der Wert ist ein String ODER null ODER undefined.
// Das ist ein Union-Typ – mehr dazu in Lektion 5. Hier reicht: TypeScript zwingt dich,
// null/undefined zu behandeln, bevor du String-Methoden aufrufen darfst.

/**
 * true, wenn der Wert null, undefined, leer oder nur aus Leerzeichen besteht.
 */
export function isBlank(value: string | null | undefined): boolean {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * Gibt `value` zurück – oder `fallback`, wenn value null oder undefined ist.
 * ACHTUNG: 0 ist ein gültiger Wert und darf NICHT ersetzt werden!
 */
export function withDefault(value: number | null | undefined, fallback: number): number {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * Anzeigename eines Benutzers: der Spitzname, falls vorhanden und nicht leer
 * (Leerzeichen zählen als leer), sonst der Vorname.
 *
 * displayName({ firstName: "Melih", nickname: "Mel" }) → "Mel"
 * displayName({ firstName: "Melih", nickname: "  " })  → "Melih"
 * displayName({ firstName: "Melih" })                  → "Melih"
 *
 * Hinweis: Das `?` bei nickname heisst «darf fehlen» (dann ist es undefined).
 * Verwende deine Funktion isBlank!
 */
export function displayName(user: { firstName: string; nickname?: string | null }): string {
  throw new Error("TODO: Aufgabe 3.3");
}

/**
 * Liest eine Bestellmenge aus einem Formularfeld.
 * - undefined oder leer/nur Leerzeichen → 1 (Standardmenge)
 * - "0" → 0 (gültig!)
 * - eine ganze Zahl ≥ 0 → diese Zahl
 * - alles andere ("abc", "-3", "2.5") → Error werfen
 *
 * Hinweis: Number("  7 ") ergibt 7. Number("abc") ergibt NaN.
 */
export function parseQuantity(input: string | undefined): number {
  throw new Error("TODO: Aufgabe 3.4");
}
