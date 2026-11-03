// Aufgabe 4 – Fehlerbehandlung
// Tests: npm run test:watch -- l05-unions-narrowing/uebungen/04

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * 4.1 Liefert eine lesbare Meldung für einen beliebigen gefangenen Wert:
 *   Error-Objekt → seine message
 *   String       → der String selbst
 *   alles andere → "Unbekannter Fehler"
 */
export function getErrorMessage(error: unknown): string {
  throw new Error("TODO: Aufgabe 4.1");
}

/**
 * 4.2 JSON.parse wirft bei ungültigem JSON eine Exception (SyntaxError).
 * Diese Funktion verpackt das in ein Result.
 *
 * safeJsonParse('{"a":1}') → { ok: true, value: { a: 1 } }
 * safeJsonParse("{kaputt") → { ok: false, error: "Ungültiges JSON: <Meldung des SyntaxError>" }
 */
export function safeJsonParse(text: string): Result<unknown> {
  throw new Error("TODO: Aufgabe 4.2");
}

/**
 * 4.3 Eine eigene Fehlerklasse für Validierungsfehler.
 * - erbt von Error
 * - hat ein öffentliches, readonly Feld `field` (welches Feld ungültig ist)
 * - name ist "ValidationError"
 *
 * new ValidationError("email", "E-Mail fehlt")
 *   .message → "E-Mail fehlt"
 *   .field   → "email"
 *   .name    → "ValidationError"
 */
export class ValidationError {
  // TODO: Aufgabe 4.3 – extends Error
}

export type BookingInput = { name?: string; email?: string; durationMinutes?: number };
export type Booking = { name: string; email: string; durationMinutes: number };

/**
 * 4.4 Prüft eine Buchungsanfrage und wirft beim ERSTEN Problem einen ValidationError:
 *   name fehlt/leer                 → field "name",  message "Name fehlt"
 *   email fehlt oder ohne "@"       → field "email", message "E-Mail ungültig"
 *   durationMinutes fehlt           → Standardwert 30
 *   durationMinutes nicht 15/30/45/60 → field "durationMinutes", message "Dauer ungültig"
 * Gibt die vollständige Booking zurück (name getrimmt).
 */
export function validateBooking(input: BookingInput): Booking {
  throw new Error("TODO: Aufgabe 4.4");
}

/**
 * 4.5 Ruft validateBooking auf und wandelt ValidationErrors in ein Result um:
 *   { ok: false, error: "<field>: <message>" }
 *
 * WICHTIG: Andere Fehler (keine ValidationError) sollen NICHT verschluckt werden,
 * sondern weitergeworfen werden (throw error;). Sonst versteckst du Programmierfehler!
 *
 * Der zweite Parameter erlaubt den Tests, eine andere Validierungsfunktion
 * einzuschleusen – du rufst einfach `validate(input)` auf.
 */
export function tryValidateBooking(
  input: BookingInput,
  validate: (input: BookingInput) => Booking = validateBooking,
): Result<Booking> {
  throw new Error("TODO: Aufgabe 4.5");
}
