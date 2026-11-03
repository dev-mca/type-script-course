import { describe, expect, it } from "vitest";
import { z } from "zod";
import { CreateBookingSchema, DateSchema, formatIssues } from "./schemas";

const valid = { serviceId: "s-cut", customerName: "Melih", start: "2026-11-20T10:00" };

function issuesOf(input: unknown) {
  const result = CreateBookingSchema.safeParse(input);
  if (result.success) throw new Error("Erwartet: ungültig");
  return formatIssues(result.error);
}

describe("B.1 CreateBookingSchema", () => {
  it("akzeptiert gültige Daten", () => {
    expect(CreateBookingSchema.safeParse(valid)).toEqual({ success: true, data: valid });
  });

  it("trimmt den Namen und entfernt unbekannte Felder", () => {
    const result = CreateBookingSchema.safeParse({
      ...valid,
      customerName: "  Melih  ",
      admin: true,
    });
    expect(result.success && result.data).toEqual(valid);
  });

  it("meldet einen zu kurzen Namen", () => {
    expect(issuesOf({ ...valid, customerName: " M " })).toEqual([
      { path: "customerName", message: "Name zu kurz" },
    ]);
  });

  it("lehnt zu lange Namen ab", () => {
    expect(issuesOf({ ...valid, customerName: "x".repeat(81) })[0]?.path).toBe("customerName");
  });

  it("prüft das Format von start", () => {
    for (const start of [
      "2026-11-20",
      "20.11.2026 10:00",
      "2026-11-20 10:00",
      "2026-11-20T10:00:00",
    ]) {
      expect(issuesOf({ ...valid, start })).toEqual([
        { path: "start", message: "Format JJJJ-MM-TTTHH:MM erwartet" },
      ]);
    }
  });

  it("meldet fehlende und leere Felder", () => {
    expect(issuesOf({ customerName: "Melih" }).map((i) => i.path)).toEqual(["serviceId", "start"]);
    expect(issuesOf({ ...valid, serviceId: "" }).map((i) => i.path)).toEqual(["serviceId"]);
    expect(issuesOf("kein Objekt")).toHaveLength(1);
  });
});

describe("B.3 DateSchema", () => {
  it("prüft das Datumsformat", () => {
    expect(DateSchema.safeParse("2026-11-20").success).toBe(true);
    expect(DateSchema.safeParse("20.11.2026").success).toBe(false);
    expect(DateSchema.safeParse("2026-11-20T10:00").success).toBe(false);
  });
});

describe("B.4 formatIssues", () => {
  it("verbindet verschachtelte Pfade mit Punkten", () => {
    const schema = z.object({ customer: z.object({ name: z.string().min(1, "leer") }) });
    const result = schema.safeParse({ customer: { name: "" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatIssues(result.error)).toEqual([{ path: "customer.name", message: "leer" }]);
    }
  });
});
