// Projekt A – Abnahmetests (vorgegeben, NICHT verändern)
// Ausführen: npm run test:watch -- projekt-a
//
// Diese Tests beschreiben, was dein Programm können muss. Schreib zusätzlich
// eigene Tests in tests/eigene.test.ts (siehe README).

import { describe, expect, it } from "vitest";
import { Salon } from "../src/salon";
import type { Barber, BookingRequest, Service } from "../src/typen";
import { addMinutes, formatTime, parseTime } from "../src/zeit";

const SERVICES: Service[] = [
  { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  { id: "s-beard", name: "Bart", durationMinutes: 15, priceInRappen: 2500 },
  { id: "s-color", name: "Färben", durationMinutes: 90, priceInRappen: 9000 },
];

const BARBERS: Barber[] = [
  { id: "b-anna", name: "Anna", start: "09:00", end: "18:00" },
  { id: "b-bob", name: "Bob", start: "10:00", end: "16:00" },
];

const DAY = "2026-11-20";

function request(overrides: Partial<BookingRequest> = {}): BookingRequest {
  return {
    barberId: "b-anna",
    serviceId: "s-cut",
    customerName: "Melih",
    date: DAY,
    start: "10:00",
    ...overrides,
  };
}

function newSalon(): Salon {
  return new Salon(SERVICES, BARBERS);
}

// ─── Meilenstein 1: Zeit ─────────────────────────────────────────────────────

describe("M1 Zeit-Hilfsfunktionen", () => {
  it("parseTime wandelt HH:MM in Minuten um", () => {
    expect(parseTime("00:00")).toBe(0);
    expect(parseTime("09:30")).toBe(570);
    expect(parseTime("23:59")).toBe(1439);
  });

  it("parseTime lehnt ungültige Zeiten ab", () => {
    for (const invalid of ["24:00", "9:30", "12:60", "12:5", "abc", "", "12:30:00", " 12:30"]) {
      expect(() => parseTime(invalid)).toThrow();
    }
  });

  it("formatTime wandelt Minuten in HH:MM um", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(570)).toBe("09:30");
    expect(formatTime(1439)).toBe("23:59");
  });

  it("formatTime lehnt ungültige Werte ab", () => {
    for (const invalid of [-1, 1440, 1.5, NaN]) {
      expect(() => formatTime(invalid)).toThrow();
    }
  });

  it("addMinutes addiert Minuten", () => {
    expect(addMinutes("09:30", 45)).toBe("10:15");
    expect(addMinutes("09:30", 0)).toBe("09:30");
    expect(() => addMinutes("23:30", 45)).toThrow();
  });
});

// ─── Meilenstein 2: Buchen ───────────────────────────────────────────────────

describe("M2 book – einfache Buchungen", () => {
  it("bucht einen gültigen Termin", () => {
    const result = newSalon().book(request());
    expect(result).toEqual({
      ok: true,
      value: {
        id: "T-1",
        barberId: "b-anna",
        serviceId: "s-cut",
        customerName: "Melih",
        date: DAY,
        start: "10:00",
        end: "10:30",
      },
    });
  });

  it("vergibt fortlaufende IDs pro Salon", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" }));
    const second = salon.book(request({ start: "11:00" }));
    expect(second.ok && second.value.id).toBe("T-2");
    const first = newSalon().book(request());
    expect(first.ok && first.value.id).toBe("T-1"); // neuer Salon beginnt wieder bei T-1
  });

  it("lehnt ungültige Zeiten, unbekannte Services und Barber ab", () => {
    const salon = newSalon();
    expect(salon.book(request({ start: "10:7" }))).toEqual({
      ok: false,
      error: { type: "invalid-time" },
    });
    expect(salon.book(request({ serviceId: "s-massage" }))).toEqual({
      ok: false,
      error: { type: "unknown-service" },
    });
    expect(salon.book(request({ barberId: "b-zoe" }))).toEqual({
      ok: false,
      error: { type: "unknown-barber" },
    });
  });

  it("prüft in der vorgegebenen Reihenfolge", () => {
    expect(newSalon().book(request({ start: "x", serviceId: "?", barberId: "?" }))).toEqual({
      ok: false,
      error: { type: "invalid-time" },
    });
    expect(newSalon().book(request({ serviceId: "?", barberId: "?" }))).toEqual({
      ok: false,
      error: { type: "unknown-service" },
    });
  });

  it("verlangt, dass der Termin ganz in der Arbeitszeit liegt", () => {
    const salon = newSalon();
    const outside = { ok: false, error: { type: "outside-working-hours" } };
    expect(salon.book(request({ barberId: "b-bob", start: "09:30" }))).toEqual(outside);
    expect(salon.book(request({ start: "17:45" }))).toEqual(outside); // endet 18:15
    expect(salon.book(request({ start: "08:59" }))).toEqual(outside);
    expect(salon.book(request({ start: "17:30" })).ok).toBe(true); // endet genau 18:00
  });
});

// ─── Meilenstein 3: Überschneidungen und Stornieren ──────────────────────────

describe("M3 Überschneidungen", () => {
  it("lehnt überschneidende Termine beim selben Barber ab", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" })); // T-1: 10:00–10:30
    expect(salon.book(request({ serviceId: "s-beard", start: "10:15" }))).toEqual({
      ok: false,
      error: { type: "overlap", conflictingAppointmentId: "T-1" },
    });
    expect(salon.book(request({ serviceId: "s-color", start: "09:00" }))).toEqual({
      ok: false,
      error: { type: "overlap", conflictingAppointmentId: "T-1" },
    });
  });

  it("erlaubt direkt anschliessende Termine", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" }));
    expect(salon.book(request({ serviceId: "s-beard", start: "10:30" })).ok).toBe(true);
    expect(salon.book(request({ serviceId: "s-cut", start: "09:30" })).ok).toBe(true);
  });

  it("erlaubt gleiche Zeit bei anderem Barber oder an anderem Tag", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" }));
    expect(salon.book(request({ barberId: "b-bob", start: "10:00" })).ok).toBe(true);
    expect(salon.book(request({ date: "2026-11-21", start: "10:00" })).ok).toBe(true);
  });
});

describe("M3 cancel", () => {
  it("storniert Termine und gibt den Platz frei", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" }));
    expect(salon.cancel("T-1")).toBe(true);
    expect(salon.cancel("T-1")).toBe(false);
    expect(salon.book(request({ start: "10:00" })).ok).toBe(true);
  });

  it("liefert false für unbekannte Termine", () => {
    expect(newSalon().cancel("T-99")).toBe(false);
  });

  it("vergibt nach dem Stornieren keine ID doppelt", () => {
    const salon = newSalon();
    salon.book(request({ start: "10:00" }));
    salon.cancel("T-1");
    const next = salon.book(request({ start: "11:00" }));
    expect(next.ok && next.value.id).toBe("T-2");
  });
});

// ─── Meilenstein 4: Abfragen ─────────────────────────────────────────────────

describe("M4 appointmentsFor", () => {
  it("liefert die Termine eines Barbers sortiert nach Startzeit", () => {
    const salon = newSalon();
    salon.book(request({ start: "14:00", customerName: "C" }));
    salon.book(request({ start: "09:00", customerName: "A" }));
    salon.book(request({ barberId: "b-bob", start: "11:00", customerName: "X" }));
    salon.book(request({ start: "11:30", customerName: "B" }));
    salon.book(request({ date: "2026-11-21", start: "10:00", customerName: "Y" }));

    expect(salon.appointmentsFor("b-anna", DAY).map((a) => a.customerName)).toEqual([
      "A",
      "B",
      "C",
    ]);
    expect(salon.appointmentsFor("b-bob", DAY)).toHaveLength(1);
    expect(salon.appointmentsFor("b-bob", "2026-11-22")).toEqual([]);
  });

  it("gibt eine Kopie zurück", () => {
    const salon = newSalon();
    salon.book(request());
    salon.appointmentsFor("b-anna", DAY).pop();
    expect(salon.appointmentsFor("b-anna", DAY)).toHaveLength(1);
  });
});

describe("M4 freeSlots", () => {
  it("findet freie Startzeiten", () => {
    const salon = newSalon();
    salon.book(request({ barberId: "b-bob", start: "11:00" })); // 11:00–11:30

    expect(salon.freeSlots("b-bob", DAY, "s-beard", 30)).toEqual([
      "10:00",
      "10:30",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
    ]);
    expect(salon.freeSlots("b-bob", DAY, "s-color", 60)).toEqual(["12:00", "13:00", "14:00"]);
  });

  it("verwendet standardmässig 15-Minuten-Schritte", () => {
    const salon = newSalon();
    const slots = salon.freeSlots("b-bob", DAY, "s-color");
    expect(slots[0]).toBe("10:00");
    expect(slots[1]).toBe("10:15");
    expect(slots.at(-1)).toBe("14:30"); // 14:30 + 90 min = 16:00
  });

  it("wirft bei unbekanntem Barber oder Service", () => {
    expect(() => newSalon().freeSlots("b-zoe", DAY, "s-cut")).toThrow();
    expect(() => newSalon().freeSlots("b-anna", DAY, "s-massage")).toThrow();
  });
});

// ─── Meilenstein 5: Auswertung ───────────────────────────────────────────────

describe("M5 dailyRevenue und daySummary", () => {
  function bookedSalon(): Salon {
    const salon = newSalon();
    salon.book(request({ start: "10:00", serviceId: "s-beard", customerName: "Chiara" }));
    salon.book(request({ start: "09:00", serviceId: "s-cut", customerName: "Melih" }));
    salon.book(request({ date: "2026-11-21", serviceId: "s-color", customerName: "Dario" }));
    return salon;
  }

  it("summiert den Umsatz eines Tages", () => {
    const salon = bookedSalon();
    expect(salon.dailyRevenue(DAY)).toBe(7000);
    expect(salon.dailyRevenue("2026-11-21")).toBe(9000);
    expect(salon.dailyRevenue("2026-12-24")).toBe(0);
  });

  it("erstellt den Tagesplan im vorgegebenen Format", () => {
    expect(bookedSalon().daySummary(DAY)).toBe(
      [
        "Tagesplan 2026-11-20",
        "Anna",
        "  09:00–09:30 Haarschnitt (Melih)",
        "  10:00–10:15 Bart (Chiara)",
        "Bob",
        "  (keine Termine)",
        "Umsatz: CHF 70.00",
      ].join("\n"),
    );
  });
});
