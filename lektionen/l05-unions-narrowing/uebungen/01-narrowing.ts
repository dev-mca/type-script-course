// Aufgabe 1 – Narrowing
// Tests: npm run test:watch -- l05-unions-narrowing/uebungen/01

/**
 * 1.1 Formatiert einen Wert für eine Tabelle:
 *   string  → in Anführungszeichen:  "Hallo"  → "\"Hallo\""
 *   number  → zwei Nachkommastellen: 3.14159  → "3.14"
 *   boolean → "ja" / "nein"
 *   Date    → Datum im Format JJJJ-MM-TT (Tipp: toISOString().slice(0, 10))
 *   null    → "–" (Gedankenstrich)
 */
export function formatCell(value: string | number | boolean | Date | null): string {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * 1.2 Liefert eine ID als Zahl. Strings müssen eine positive ganze Zahl enthalten.
 * toNumericId(42)   → 42
 * toNumericId("42") → 42
 * toNumericId("abc") / toNumericId(-1) / toNumericId(1.5) → Error
 */
export function toNumericId(id: string | number): number {
  throw new Error("TODO: Aufgabe 1.2");
}

export type Circle = { radius: number };
export type Rect = { width: number; height: number };

/**
 * 1.3 Fläche eines Kreises oder Rechtecks.
 * Diese Typen haben KEIN gemeinsames kind-Feld – verwende den `in`-Operator.
 */
export function areaOf(shape: Circle | Rect): number {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Type Guard: true, wenn value ein String mit mindestens einem
 * Nicht-Leerzeichen ist.
 *
 * TODO: Ändere den Rückgabetyp von `boolean` zu `value is string`
 * und schau in der Testdatei, was sich dadurch ändert (Zeile mit .toUpperCase()).
 */
export function isNonEmptyString(value: unknown): boolean {
  throw new Error("TODO: Aufgabe 1.4");
}

export type Admin = { role: "admin"; name: string; permissions: string[] };
export type Customer = { role: "customer"; name: string; loyaltyPoints: number };
export type Guest = { role: "guest" };
export type Visitor = Admin | Customer | Guest;

/**
 * 1.5 Begrüssungstext:
 *   Admin    → "Willkommen zurück, <name> (3 Berechtigungen)"
 *   Customer → "Hallo <name>, du hast 120 Treuepunkte"
 *   Guest    → "Hallo Gast!"
 */
export function greetVisitor(visitor: Visitor): string {
  throw new Error("TODO: Aufgabe 1.5");
}

/**
 * 1.6 Filtert alle Kunden aus einer Liste von Besuchern.
 * Der Rückgabetyp ist Customer[] – dafür braucht filter einen Type Guard als Callback:
 *   visitors.filter((v): v is Customer => …)
 * (Ab TypeScript 5.5 erkennt der Compiler einfache Fälle wie v.role === "customer"
 * sogar automatisch. Probier beide Varianten aus!)
 */
export function onlyCustomers(visitors: Visitor[]): Customer[] {
  throw new Error("TODO: Aufgabe 1.6");
}
