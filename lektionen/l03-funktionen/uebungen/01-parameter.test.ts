import { describe, expect, it } from "vitest";
import { average, formatPrice, greet, sum } from "./01-parameter";

describe("1.1 greet", () => {
  it("verwendet 'Hallo' als Standard", () => {
    expect(greet("Melih")).toBe("Hallo Melih!");
  });

  it("verwendet eine eigene Grussformel", () => {
    expect(greet("Melih", "Grüezi")).toBe("Grüezi Melih!");
  });
});

describe("1.2 sum", () => {
  it("summiert beliebig viele Zahlen", () => {
    expect(sum()).toBe(0);
    expect(sum(5)).toBe(5);
    expect(sum(1, 2, 3)).toBe(6);
    expect(sum(...[10, 20, 30])).toBe(60);
  });
});

describe("1.3 average", () => {
  it("berechnet den Durchschnitt", () => {
    expect(average(2, 4, 6)).toBe(4);
    expect(average(1, 2)).toBe(1.5);
  });

  it("liefert undefined ohne Zahlen", () => {
    expect(average()).toBeUndefined();
  });
});

describe("1.4 formatPrice", () => {
  it("verwendet die Standardwerte", () => {
    expect(formatPrice(1250)).toBe("CHF 12.50");
  });

  it("akzeptiert einzelne Optionen", () => {
    expect(formatPrice(1250, { currency: "EUR" })).toBe("EUR 12.50");
    expect(formatPrice(1250, { decimals: 0 })).toBe("CHF 13");
    expect(formatPrice(1249, { decimals: 0 })).toBe("CHF 12");
  });

  it("akzeptiert beide Optionen", () => {
    expect(formatPrice(99, { currency: "USD", decimals: 1 })).toBe("USD 1.0");
  });

  it("akzeptiert ein leeres Optionen-Objekt", () => {
    expect(formatPrice(5, {})).toBe("CHF 0.05");
  });
});
