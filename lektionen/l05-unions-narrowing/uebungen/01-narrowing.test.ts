import { describe, expect, it } from "vitest";
import {
  type Visitor,
  areaOf,
  formatCell,
  greetVisitor,
  isNonEmptyString,
  onlyCustomers,
  toNumericId,
} from "./01-narrowing";

describe("1.1 formatCell", () => {
  it("formatiert jeden Typ", () => {
    expect(formatCell("Hallo")).toBe('"Hallo"');
    expect(formatCell(3.14159)).toBe("3.14");
    expect(formatCell(0)).toBe("0.00");
    expect(formatCell(true)).toBe("ja");
    expect(formatCell(false)).toBe("nein");
    expect(formatCell(new Date("2026-11-03T12:00:00Z"))).toBe("2026-11-03");
    expect(formatCell(null)).toBe("–");
  });

  it("behandelt leere Strings als Strings (nicht als null)", () => {
    expect(formatCell("")).toBe('""');
  });
});

describe("1.2 toNumericId", () => {
  it("akzeptiert Zahlen und Zahl-Strings", () => {
    expect(toNumericId(42)).toBe(42);
    expect(toNumericId("42")).toBe(42);
  });

  it("lehnt Ungültiges ab", () => {
    expect(() => toNumericId("abc")).toThrow();
    expect(() => toNumericId("")).toThrow();
    expect(() => toNumericId(-1)).toThrow();
    expect(() => toNumericId(0)).toThrow();
    expect(() => toNumericId(1.5)).toThrow();
  });
});

describe("1.3 areaOf", () => {
  it("unterscheidet Kreis und Rechteck", () => {
    expect(areaOf({ radius: 1 })).toBeCloseTo(Math.PI);
    expect(areaOf({ width: 3, height: 4 })).toBe(12);
  });
});

describe("1.4 isNonEmptyString", () => {
  it("erkennt nicht-leere Strings", () => {
    expect(isNonEmptyString("a")).toBe(true);
    expect(isNonEmptyString("  x ")).toBe(true);
  });

  it("lehnt alles andere ab", () => {
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(["a"])).toBe(false);
  });

  it("grenzt als Type Guard den Typ ein", () => {
    const value: unknown = "hallo";
    if (isNonEmptyString(value)) {
      // Diese Zeile kompiliert erst, wenn der Rückgabetyp `value is string` ist:
      expect(value.toUpperCase()).toBe("HALLO");
    }
  });
});

const visitors: Visitor[] = [
  { role: "admin", name: "Melih", permissions: ["read", "write", "delete"] },
  { role: "customer", name: "Anna", loyaltyPoints: 120 },
  { role: "guest" },
  { role: "customer", name: "Bob", loyaltyPoints: 0 },
];

describe("1.5 greetVisitor", () => {
  it("begrüsst jeden Besuchertyp passend", () => {
    expect(greetVisitor(visitors[0]!)).toBe("Willkommen zurück, Melih (3 Berechtigungen)");
    expect(greetVisitor(visitors[1]!)).toBe("Hallo Anna, du hast 120 Treuepunkte");
    expect(greetVisitor(visitors[2]!)).toBe("Hallo Gast!");
  });
});

describe("1.6 onlyCustomers", () => {
  it("filtert die Kunden", () => {
    const customers = onlyCustomers(visitors);
    expect(customers.map((c) => c.name)).toEqual(["Anna", "Bob"]);
    // Dank Type Guard ist loyaltyPoints ohne weitere Prüfung zugänglich:
    expect(customers.map((c) => c.loyaltyPoints)).toEqual([120, 0]);
  });
});
