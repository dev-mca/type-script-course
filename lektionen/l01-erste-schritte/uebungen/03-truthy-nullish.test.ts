import { describe, expect, it } from "vitest";
import { displayName, isBlank, parseQuantity, withDefault } from "./03-truthy-nullish";

describe("3.1 isBlank", () => {
  it("erkennt null und undefined", () => {
    expect(isBlank(null)).toBe(true);
    expect(isBlank(undefined)).toBe(true);
  });

  it("erkennt leere Strings und Leerzeichen", () => {
    expect(isBlank("")).toBe(true);
    expect(isBlank("   ")).toBe(true);
    expect(isBlank("\t\n")).toBe(true);
  });

  it("liefert false für echten Inhalt", () => {
    expect(isBlank("a")).toBe(false);
    expect(isBlank("0")).toBe(false);
    expect(isBlank(" x ")).toBe(false);
  });
});

describe("3.2 withDefault", () => {
  it("ersetzt null und undefined", () => {
    expect(withDefault(undefined, 10)).toBe(10);
    expect(withDefault(null, 10)).toBe(10);
  });

  it("behält echte Werte – auch 0!", () => {
    expect(withDefault(5, 10)).toBe(5);
    expect(withDefault(0, 10)).toBe(0);
    expect(withDefault(-1, 10)).toBe(-1);
  });
});

describe("3.3 displayName", () => {
  it("nimmt den Spitznamen, falls vorhanden", () => {
    expect(displayName({ firstName: "Melih", nickname: "Mel" })).toBe("Mel");
  });

  it("nimmt den Vornamen bei fehlendem oder leerem Spitznamen", () => {
    expect(displayName({ firstName: "Melih" })).toBe("Melih");
    expect(displayName({ firstName: "Melih", nickname: null })).toBe("Melih");
    expect(displayName({ firstName: "Melih", nickname: "" })).toBe("Melih");
    expect(displayName({ firstName: "Melih", nickname: "   " })).toBe("Melih");
  });
});

describe("3.4 parseQuantity", () => {
  it("liefert 1 bei fehlender Eingabe", () => {
    expect(parseQuantity(undefined)).toBe(1);
    expect(parseQuantity("")).toBe(1);
    expect(parseQuantity("   ")).toBe(1);
  });

  it("akzeptiert 0", () => {
    expect(parseQuantity("0")).toBe(0);
  });

  it("liest ganze Zahlen (auch mit Leerzeichen)", () => {
    expect(parseQuantity("3")).toBe(3);
    expect(parseQuantity(" 12 ")).toBe(12);
  });

  it("wirft bei ungültigen Eingaben", () => {
    expect(() => parseQuantity("abc")).toThrow();
    expect(() => parseQuantity("-3")).toThrow();
    expect(() => parseQuantity("2.5")).toThrow();
  });
});
