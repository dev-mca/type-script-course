import { describe, expect, it } from "vitest";
import {
  ValidationError,
  getErrorMessage,
  safeJsonParse,
  tryValidateBooking,
  validateBooking,
} from "./04-fehler";

/** Führt fn aus und gibt den geworfenen Fehler zurück (oder schlägt fehl, wenn nichts geworfen wird) */
function catchError(fn: () => unknown): unknown {
  try {
    fn();
  } catch (error) {
    return error;
  }
  throw new Error("Erwartet wurde ein Fehler, aber es wurde keiner geworfen");
}

describe("4.1 getErrorMessage", () => {
  it("liest die Meldung aus Error-Objekten", () => {
    expect(getErrorMessage(new Error("Kaputt"))).toBe("Kaputt");
    expect(getErrorMessage(new TypeError("Falscher Typ"))).toBe("Falscher Typ");
  });

  it("gibt Strings direkt zurück", () => {
    expect(getErrorMessage("Hilfe")).toBe("Hilfe");
  });

  it("hat einen Fallback für alles andere", () => {
    expect(getErrorMessage(42)).toBe("Unbekannter Fehler");
    expect(getErrorMessage(null)).toBe("Unbekannter Fehler");
    expect(getErrorMessage({ message: "kein echtes Error" })).toBe("Unbekannter Fehler");
  });
});

describe("4.2 safeJsonParse", () => {
  it("parst gültiges JSON", () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ ok: true, value: { a: 1 } });
    expect(safeJsonParse("[1,2]")).toEqual({ ok: true, value: [1, 2] });
    expect(safeJsonParse("null")).toEqual({ ok: true, value: null });
  });

  it("liefert bei ungültigem JSON einen Fehler statt zu werfen", () => {
    const result = safeJsonParse("{kaputt");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.startsWith("Ungültiges JSON: ")).toBe(true);
      expect(result.error.length).toBeGreaterThan("Ungültiges JSON: ".length);
    }
  });
});

describe("4.3 ValidationError", () => {
  it("ist ein Error mit zusätzlichem Feld", () => {
    const error = new ValidationError("email", "E-Mail fehlt");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe("E-Mail fehlt");
    expect(error.field).toBe("email");
    expect(error.name).toBe("ValidationError");
  });
});

describe("4.4 validateBooking", () => {
  it("liefert eine vollständige Buchung", () => {
    expect(
      validateBooking({ name: " Melih ", email: "m@example.ch", durationMinutes: 45 }),
    ).toEqual({ name: "Melih", email: "m@example.ch", durationMinutes: 45 });
  });

  it("setzt die Standarddauer", () => {
    expect(validateBooking({ name: "Melih", email: "m@example.ch" }).durationMinutes).toBe(30);
  });

  it("wirft ValidationErrors mit dem richtigen Feld", () => {
    const cases = [
      { input: { email: "m@example.ch" }, field: "name" },
      { input: { name: "  ", email: "m@example.ch" }, field: "name" },
      { input: { name: "Melih", email: "kein-at" }, field: "email" },
      { input: { name: "Melih" }, field: "email" },
      {
        input: { name: "Melih", email: "m@example.ch", durationMinutes: 20 },
        field: "durationMinutes",
      },
    ];
    for (const { input, field } of cases) {
      const error = catchError(() => validateBooking(input));
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).field).toBe(field);
    }
  });
});

describe("4.5 tryValidateBooking", () => {
  it("liefert ok für gültige Eingaben", () => {
    expect(tryValidateBooking({ name: "Melih", email: "m@example.ch" })).toEqual({
      ok: true,
      value: { name: "Melih", email: "m@example.ch", durationMinutes: 30 },
    });
  });

  it("wandelt ValidationErrors in ein Result um", () => {
    expect(tryValidateBooking({ name: "Melih", email: "x" })).toEqual({
      ok: false,
      error: "email: E-Mail ungültig",
    });
  });

  it("wirft andere Fehler weiter", () => {
    const buggyValidator = () => {
      throw new TypeError("Programmierfehler!");
    };
    expect(() => tryValidateBooking({}, buggyValidator)).toThrow("Programmierfehler!");
  });
});
