// Aufgabe 2 – Discriminated Union mit Vollständigkeitsprüfung
// Tests: npm run test:watch -- l05-unions-narrowing/uebungen/02
//
// Vergleiche mit Lektion 4, Aufgabe 3: Dort haben wir Formen mit Klassen und
// Vererbung gebaut. Hier dasselbe mit Daten + Funktionen. Welche Variante
// gefällt dir besser? Wann würdest du welche wählen?

export type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; a: number; b: number; c: number }; // drei Seitenlängen

/** Hilfsfunktion für die Vollständigkeitsprüfung – siehe README Abschnitt 5 */
export function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}

/**
 * 2.1 Fläche. Dreieck mit der Formel von Heron:
 *   s = (a + b + c) / 2
 *   Fläche = √(s · (s−a) · (s−b) · (s−c))
 *
 * Verwende switch über shape.kind und einen default-Zweig mit assertNever(shape).
 */
export function area(shape: Shape): number {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * 2.2 Umfang
 */
export function perimeter(shape: Shape): number {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * 2.3 Deutscher Name der Form: "Kreis", "Rechteck", "Dreieck".
 * Diesmal OHNE switch: Verwende ein Objekt vom Typ Record<Shape["kind"], string>.
 * Shape["kind"] ist der Typ "circle" | "rectangle" | "triangle" (Indexed Access – Lektion 10).
 */
export function shapeName(shape: Shape): string {
  throw new Error("TODO: Aufgabe 2.3");
}

/**
 * 2.4 Prüft, ob die Masse gültig sind:
 *   alle Längen > 0, und beim Dreieck muss die Dreiecksungleichung gelten
 *   (jede Seite ist kürzer als die Summe der beiden anderen).
 */
export function isValidShape(shape: Shape): boolean {
  throw new Error("TODO: Aufgabe 2.4");
}
