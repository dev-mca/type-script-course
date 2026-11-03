import { describe, expect, it } from "vitest";
import { countWords, getPrice, invert, mergeCounts } from "./03-records";

describe("3.1 countWords", () => {
  it("zählt Wörter unabhängig von Gross-/Kleinschreibung", () => {
    expect(countWords("Der Hund und der Fuchs")).toEqual({ der: 2, hund: 1, und: 1, fuchs: 1 });
  });

  it("kommt mit mehreren Leerzeichen klar", () => {
    expect(countWords("  ja   ja  nein ")).toEqual({ ja: 2, nein: 1 });
  });

  it("liefert ein leeres Objekt für leeren Text", () => {
    expect(countWords("")).toEqual({});
    expect(countWords("   ")).toEqual({});
  });
});

describe("3.2 getPrice", () => {
  const prices = { Haarschnitt: 4500, Bart: 2500, Gratis: 0 };

  it("liefert vorhandene Preise", () => {
    expect(getPrice(prices, "Bart")).toBe(2500);
    expect(getPrice(prices, "Gratis")).toBe(0);
  });

  it("wirft bei unbekannten Produkten", () => {
    expect(() => getPrice(prices, "Färben")).toThrow("Unbekanntes Produkt: Färben");
  });
});

describe("3.3 mergeCounts", () => {
  it("addiert die Werte", () => {
    expect(mergeCounts({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 5, c: 4 });
    expect(mergeCounts({}, { x: 1 })).toEqual({ x: 1 });
  });

  it("verändert die Eingaben nicht", () => {
    const a = { a: 1 };
    const b = { a: 2 };
    mergeCounts(a, b);
    expect(a).toEqual({ a: 1 });
    expect(b).toEqual({ a: 2 });
  });
});

describe("3.4 invert", () => {
  it("vertauscht Schlüssel und Werte", () => {
    expect(invert({ de: "Hallo", en: "Hello" })).toEqual({ Hallo: "de", Hello: "en" });
  });

  it("lässt bei doppelten Werten den letzten gewinnen", () => {
    expect(invert({ a: "x", b: "x" })).toEqual({ x: "b" });
  });
});
