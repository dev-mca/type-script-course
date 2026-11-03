import { describe, expect, it } from "vitest";
import type { Booking } from "../../l11-backend/uebungen/daten";
import { formatChf, formatDate, formatDuration, formatTime, groupByDate } from "./formatierung";

describe("1.1 formatChf", () => {
  it("formatiert Rappen", () => {
    expect(formatChf(4500)).toBe("CHF 45.00");
    expect(formatChf(5)).toBe("CHF 0.05");
  });
});

describe("1.2 formatTime", () => {
  it("liest die Uhrzeit", () => {
    expect(formatTime("2026-11-20T10:00")).toBe("10:00");
    expect(formatTime("2026-11-20T09:05")).toBe("09:05");
  });
});

describe("1.3 formatDate", () => {
  it("formatiert mit Wochentag", () => {
    expect(formatDate("2026-11-20")).toBe("Fr, 20.11.2026");
    expect(formatDate("2026-11-22")).toBe("So, 22.11.2026");
    expect(formatDate("2027-01-04")).toBe("Mo, 04.01.2027");
  });
});

describe("1.4 formatDuration", () => {
  it("formatiert Minuten und Stunden", () => {
    expect(formatDuration(15)).toBe("15 min");
    expect(formatDuration(60)).toBe("1 h");
    expect(formatDuration(90)).toBe("1 h 30 min");
    expect(formatDuration(125)).toBe("2 h 5 min");
  });
});

describe("1.5 groupByDate", () => {
  const b = (id: string, start: string): Booking => ({
    id,
    serviceId: "s-cut",
    customerName: "X",
    start,
    end: start,
    createdAt: "2026-11-01T00:00:00.000Z",
  });

  it("gruppiert und sortiert", () => {
    const grouped = groupByDate([
      b("3", "2026-11-21T09:00"),
      b("2", "2026-11-20T14:00"),
      b("1", "2026-11-20T10:00"),
    ]);
    expect([...grouped.keys()]).toEqual(["2026-11-20", "2026-11-21"]);
    expect(grouped.get("2026-11-20")?.map((x) => x.id)).toEqual(["1", "2"]);
    expect(grouped.get("2026-11-21")?.map((x) => x.id)).toEqual(["3"]);
  });

  it("liefert für keine Buchungen eine leere Map", () => {
    expect(groupByDate([]).size).toBe(0);
  });
});
