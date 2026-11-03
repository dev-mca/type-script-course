import { describe, expect, it } from "vitest";
import { formatChf, integerDivide, roundTo, splitBill } from "./01-zahlen";

describe("1.1 integerDivide", () => {
  it("dividiert ganzzahlig", () => {
    expect(integerDivide(7, 2)).toBe(3);
    expect(integerDivide(10, 5)).toBe(2);
    expect(integerDivide(1, 3)).toBe(0);
  });

  it("schneidet bei negativen Zahlen Richtung 0 ab (wie Java)", () => {
    expect(integerDivide(-7, 2)).toBe(-3);
    expect(integerDivide(7, -2)).toBe(-3);
  });

  it("wirft bei Division durch 0", () => {
    expect(() => integerDivide(5, 0)).toThrow("Division durch 0");
  });
});

describe("1.2 roundTo", () => {
  it("rundet auf die gewünschten Nachkommastellen", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.14159, 0)).toBe(3);
    expect(roundTo(1234.5678, 1)).toBe(1234.6);
    expect(roundTo(2.5, 0)).toBe(3);
  });
});

describe("1.3 formatChf", () => {
  it("formatiert Rappen als Franken", () => {
    expect(formatChf(1250)).toBe("CHF 12.50");
    expect(formatChf(4500)).toBe("CHF 45.00");
    expect(formatChf(5)).toBe("CHF 0.05");
    expect(formatChf(0)).toBe("CHF 0.00");
    expect(formatChf(123456)).toBe("CHF 1234.56");
  });

  it("wirft bei Kommabeträgen", () => {
    expect(() => formatChf(12.5)).toThrow();
  });
});

describe("1.4 splitBill", () => {
  it("teilt gleichmässig auf, wenn es aufgeht", () => {
    expect(splitBill(900, 3)).toEqual([300, 300, 300]);
  });

  it("verteilt den Rest von vorne", () => {
    expect(splitBill(1000, 3)).toEqual([334, 333, 333]);
    expect(splitBill(1001, 4)).toEqual([251, 250, 250, 250]);
    expect(splitBill(2, 5)).toEqual([1, 1, 0, 0, 0]);
  });

  it("verliert keinen Rappen", () => {
    const parts = splitBill(9999, 7);
    let sum = 0;
    for (const part of parts) sum += part;
    expect(sum).toBe(9999);
    expect(parts).toHaveLength(7);
  });

  it("wirft bei 0 oder weniger Personen", () => {
    expect(() => splitBill(1000, 0)).toThrow();
    expect(() => splitBill(1000, -1)).toThrow();
  });
});
