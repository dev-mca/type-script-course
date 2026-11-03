// Projekt B – Abnahmetests (vorgegeben, NICHT verändern)
// Ausführen: npm run test:watch -- projekt-b
// Einzelne Meilensteine: npm run test:watch -- projekt-b -t M2

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  type Booking,
  analyze,
  loadAllBookings,
  loadServices,
  parseBookingCsv,
  parseBookingJson,
  renderErrors,
  renderJson,
  renderText,
} from "../src/index";

const DATA_DIR = path.join(import.meta.dirname, "..", "daten");
const KNOWN = new Set(["s-cut", "s-beard", "s-combo", "s-color"]);

async function withTempFile<T>(content: string, fn: (file: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(path.join(tmpdir(), "projekt-b-"));
  try {
    const file = path.join(dir, "services.json");
    await writeFile(file, content);
    return await fn(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// ─── M1 ──────────────────────────────────────────────────────────────────────

describe("M1 loadServices", () => {
  it("lädt die Services", async () => {
    const services = await loadServices(path.join(DATA_DIR, "services.json"));
    expect(services).toHaveLength(4);
    expect(services[0]).toEqual({
      id: "s-cut",
      name: "Haarschnitt",
      priceInRappen: 4500,
      durationMinutes: 30,
    });
  });

  it("wirft bei ungültigen Dateien", async () => {
    await withTempFile('{"id": "s-cut"}', async (file) => {
      await expect(loadServices(file)).rejects.toThrow();
    });
    await withTempFile(
      '[{"id": "s-cut", "name": "Schnitt", "priceInRappen": "45"}]',
      async (file) => {
        await expect(loadServices(file)).rejects.toThrow();
      },
    );
    await expect(loadServices(path.join(DATA_DIR, "gibts-nicht.json"))).rejects.toThrow();
  });
});

// ─── M2 ──────────────────────────────────────────────────────────────────────

describe("M2 parseBookingCsv", () => {
  const HEADER = "id;datum;zeit;barber;serviceId;kunde;status";

  it("liest gültige Zeilen", () => {
    const csv = `${HEADER}\nB-1;2026-09-01;09:00;Anna;s-cut;Melih;erledigt\n`;
    expect(parseBookingCsv(csv, "test.csv", KNOWN)).toEqual({
      bookings: [
        {
          id: "B-1",
          date: "2026-09-01",
          time: "09:00",
          barber: "Anna",
          serviceId: "s-cut",
          customer: "Melih",
          status: "erledigt",
        },
      ],
      errors: [],
    });
  });

  it("liest die Spalten anhand der Kopfzeile", () => {
    const csv =
      "status;kunde;id;zeit;datum;serviceId;barber\nstorniert;Anna;B-2;14:30;2026-10-01;s-beard;Bob";
    const { bookings } = parseBookingCsv(csv, "test.csv", KNOWN);
    expect(bookings[0]).toMatchObject({
      id: "B-2",
      customer: "Anna",
      barber: "Bob",
      status: "storniert",
    });
  });

  it("meldet Fehler mit Datei, Zeile und Grund", () => {
    const csv = [
      HEADER,
      "B-1;2026-02-30;09:00;Anna;s-cut;Melih;erledigt",
      "",
      "B-2;2026-09-01;9:00;Anna;s-cut;Melih;erledigt",
      "B-3;2026-09-01;09:00;Anna;s-cut;;erledigt",
      "B-4;2026-09-01;09:00;Anna;s-cut;Melih",
      "B-5;2026-09-01;09:00;Anna;s-nails;Melih;erledigt",
      "B-6;2026-09-01;09:00;Anna;s-cut;Melih;vielleicht",
      "B-7;2026-09-01;09:00;Anna;s-cut;Melih;erledigt",
    ].join("\n");
    const result = parseBookingCsv(csv, "test.csv", KNOWN);
    expect(result.bookings.map((b) => b.id)).toEqual(["B-7"]);
    expect(result.errors).toEqual([
      { source: "test.csv", line: 2, message: "Ungültiges Datum: 2026-02-30" },
      { source: "test.csv", line: 4, message: "Ungültige Uhrzeit: 9:00" },
      { source: "test.csv", line: 5, message: "Feld fehlt: customer" },
      { source: "test.csv", line: 6, message: "Erwartet 7 Spalten, gefunden 6" },
      { source: "test.csv", line: 7, message: "Unbekannter Service: s-nails" },
      { source: "test.csv", line: 8, message: "Ungültiger Status: vielleicht" },
    ]);
  });

  it("kommt mit Windows-Zeilenumbrüchen und Leerzeichen klar", () => {
    const csv = `${HEADER}\r\n B-1 ; 2026-09-01 ;09:00;Anna;s-cut;Melih;erledigt \r\n`;
    expect(parseBookingCsv(csv, "x.csv", KNOWN).bookings[0]?.id).toBe("B-1");
  });
});

describe("M2 parseBookingJson", () => {
  it("liest gültige Einträge und meldet ungültige", () => {
    const data: unknown = [
      {
        id: "B-1",
        date: "2026-11-02",
        time: "09:00",
        barber: "Anna",
        serviceId: "s-cut",
        customer: "Melih",
        status: "erledigt",
      },
      "kein Objekt",
      {
        id: "B-3",
        date: "2026-11-02",
        time: "09:00",
        barber: "Anna",
        serviceId: "s-cut",
        status: "erledigt",
      },
      {
        id: "B-4",
        date: "2026-11-02",
        time: 900,
        barber: "Anna",
        serviceId: "s-cut",
        customer: "X",
        status: "erledigt",
      },
    ];
    const result = parseBookingJson(data, "test.json", KNOWN);
    expect(result.bookings.map((b) => b.id)).toEqual(["B-1"]);
    expect(result.errors).toEqual([
      { source: "test.json", line: 2, message: "Eintrag ist kein Objekt" },
      { source: "test.json", line: 3, message: "Feld fehlt: customer" },
      { source: "test.json", line: 4, message: "Feld fehlt: time" },
    ]);
  });

  it("wirft, wenn die Datei kein Array enthält", () => {
    expect(() => parseBookingJson({ bookings: [] }, "test.json", KNOWN)).toThrow(
      "test.json: JSON-Array erwartet",
    );
  });
});

// ─── M3 ──────────────────────────────────────────────────────────────────────

describe("M3 loadAllBookings", () => {
  it("lädt alle Dateien im Ordner", async () => {
    const { bookings, errors, services } = await loadAllBookings(DATA_DIR);
    expect(services).toHaveLength(4);
    expect(bookings).toHaveLength(19);
    expect(errors).toEqual([
      { source: "buchungen-2026-09.csv", line: 8, message: "Ungültiges Datum: 2026-09-31" },
      { source: "buchungen-2026-09.csv", line: 9, message: "Unbekannter Service: s-massage" },
      { source: "buchungen-2026-09.csv", line: 12, message: "Erwartet 7 Spalten, gefunden 6" },
      { source: "buchungen-2026-10.csv", line: 9, message: "Ungültiger Status: abgesagt" },
      { source: "buchungen-2026-11.json", line: 3, message: "Ungültige Uhrzeit: 25:00" },
      { source: "buchungen-2026-11.json", line: 5, message: "Feld fehlt: time" },
    ]);
  });

  it("sortiert die Buchungen nach Datum und Uhrzeit", async () => {
    const { bookings } = await loadAllBookings(DATA_DIR);
    const keys = bookings.map((b) => `${b.date} ${b.time}`);
    expect(keys).toEqual(keys.toSorted());
    expect(bookings[0]?.id).toBe("B-001");
    expect(bookings.at(-1)?.id).toBe("B-025");
  });
});

// ─── M4 ──────────────────────────────────────────────────────────────────────

describe("M4 analyze", () => {
  it("berechnet den vollständigen Report", async () => {
    const { bookings, services } = await loadAllBookings(DATA_DIR);
    expect(analyze(bookings, services)).toEqual({
      period: { from: "2026-09-01", to: "2026-11-07" },
      totals: { bookings: 19, completed: 14, cancelled: 2, noShows: 3 },
      noShowRate: 0.176,
      revenueInRappen: 78500,
      revenueByMonth: [
        { month: "2026-09", revenueInRappen: 22500 },
        { month: "2026-10", revenueInRappen: 36000 },
        { month: "2026-11", revenueInRappen: 20000 },
      ],
      revenueByBarber: [
        { barber: "Anna", revenueInRappen: 45000 },
        { barber: "Bob", revenueInRappen: 33500 },
      ],
      topServices: [
        { serviceId: "s-cut", name: "Haarschnitt", count: 4, revenueInRappen: 18000 },
        { serviceId: "s-combo", name: "Haarschnitt + Bart", count: 4, revenueInRappen: 26000 },
        { serviceId: "s-beard", name: "Bart", count: 3, revenueInRappen: 7500 },
      ],
      busiestWeekday: { weekday: "Samstag", count: 8 },
      returningCustomers: ["Chiara", "Eva", "Kurt", "Melih"],
    });
  });

  it("kommt mit leeren Daten klar", () => {
    expect(analyze([], [])).toEqual({
      period: null,
      totals: { bookings: 0, completed: 0, cancelled: 0, noShows: 0 },
      noShowRate: 0,
      revenueInRappen: 0,
      revenueByMonth: [],
      revenueByBarber: [],
      topServices: [],
      busiestWeekday: null,
      returningCustomers: [],
    });
  });

  it("verändert die Eingabe nicht", async () => {
    const { bookings, services } = await loadAllBookings(DATA_DIR);
    const copy: Booking[] = structuredClone(bookings);
    analyze(bookings, services);
    expect(bookings).toEqual(copy);
  });
});

// ─── M5 ──────────────────────────────────────────────────────────────────────

describe("M5 Ausgabe", () => {
  it("renderText enthält die wichtigsten Zeilen", async () => {
    const { bookings, services } = await loadAllBookings(DATA_DIR);
    const text = renderText(analyze(bookings, services));
    const lines = text.split("\n").map((line) => line.trim());
    expect(lines).toContain("Auswertung 2026-09-01 bis 2026-11-07");
    expect(lines).toContain("Umsatz total: CHF 785.00");
    expect(lines).toContain("No-Show-Quote: 17.6 %");
    for (const expected of ["2026-10", "Anna", "Bob", "Haarschnitt + Bart"]) {
      expect(lines.some((l) => l.includes(expected) && l.includes("CHF"))).toBe(true);
    }
  });

  it("renderText funktioniert ohne Daten", () => {
    expect(renderText(analyze([], []))).toContain("Auswertung (keine Daten)");
  });

  it("renderJson liefert den Report als formatiertes JSON", async () => {
    const { bookings, services } = await loadAllBookings(DATA_DIR);
    const report = analyze(bookings, services);
    const json = renderJson(report);
    expect(JSON.parse(json)).toEqual(report);
    expect(json).toContain('\n  "period"');
  });

  it("renderErrors listet die Fehler", () => {
    expect(
      renderErrors([
        { source: "a.csv", line: 8, message: "Ungültiges Datum: 2026-09-31" },
        { source: "b.json", line: 2, message: "Feld fehlt: time" },
      ]),
    ).toBe("a.csv:8 – Ungültiges Datum: 2026-09-31\nb.json:2 – Feld fehlt: time");
    expect(renderErrors([])).toBe("");
  });
});
