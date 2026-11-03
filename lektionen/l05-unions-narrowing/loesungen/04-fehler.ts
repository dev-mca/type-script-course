// Lösung Aufgabe 4 – Fehlerbehandlung

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unbekannter Fehler";
}

export function safeJsonParse(text: string): Result<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: `Ungültiges JSON: ${getErrorMessage(error)}` };
  }
}

export class ValidationError extends Error {
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

const ALLOWED_DURATIONS = [15, 30, 45, 60];

export type BookingInput = { name?: string; email?: string; durationMinutes?: number };
export type Booking = { name: string; email: string; durationMinutes: number };

export function validateBooking(input: BookingInput): Booking {
  const name = input.name?.trim() ?? "";
  if (name === "") {
    throw new ValidationError("name", "Name fehlt");
  }

  const email = input.email ?? "";
  if (!email.includes("@")) {
    throw new ValidationError("email", "E-Mail ungültig");
  }

  const durationMinutes = input.durationMinutes ?? 30;
  if (!ALLOWED_DURATIONS.includes(durationMinutes)) {
    throw new ValidationError("durationMinutes", "Dauer ungültig");
  }

  return { name, email, durationMinutes };
}

export function tryValidateBooking(
  input: BookingInput,
  validate: (input: BookingInput) => Booking = validateBooking,
): Result<Booking> {
  try {
    return { ok: true, value: validate(input) };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, error: `${error.field}: ${error.message}` };
    }
    throw error; // alles andere ist ein echter Fehler – nicht verschlucken!
  }
}
