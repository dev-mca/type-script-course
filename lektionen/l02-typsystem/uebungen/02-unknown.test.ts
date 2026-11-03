import { describe, expect, it } from "vitest";
import { describeValue, parseAge, toNumberArray } from "./02-unknown";

describe("2.1 describeValue", () => {
  it("erkennt null und undefined", () => {
    expect(describeValue(null)).toBe("null");
    expect(describeValue(undefined)).toBe("undefined");
  });

  it("erkennt Primitive", () => {
    expect(describeValue("Hallo")).toBe("string (5 Zeichen)");
    expect(describeValue("")).toBe("string (0 Zeichen)");
    expect(describeValue(42)).toBe("number");
    expect(describeValue(NaN)).toBe("number");
    expect(describeValue(false)).toBe("boolean");
  });

  it("unterscheidet Arrays, Objekte und Funktionen", () => {
    expect(describeValue([1, 2, 3])).toBe("array (3 Elemente)");
    expect(describeValue([])).toBe("array (0 Elemente)");
    expect(describeValue({ a: 1 })).toBe("object");
    expect(describeValue(() => 1)).toBe("function");
  });
});

describe("2.2 parseAge", () => {
  it("akzeptiert Zahlen und Zahlen-Strings", () => {
    expect(parseAge(42)).toBe(42);
    expect(parseAge(0)).toBe(0);
    expect(parseAge("42")).toBe(42);
    expect(parseAge(" 150 ")).toBe(150);
  });

  it("lehnt ungültige Werte ab", () => {
    expect(() => parseAge(42.5)).toThrow();
    expect(() => parseAge(-1)).toThrow();
    expect(() => parseAge(151)).toThrow();
    expect(() => parseAge("zweiundvierzig")).toThrow();
    expect(() => parseAge("")).toThrow();
    expect(() => parseAge(true)).toThrow();
    expect(() => parseAge(null)).toThrow();
    expect(() => parseAge(undefined)).toThrow();
    expect(() => parseAge({ age: 42 })).toThrow();
  });
});

describe("2.3 toNumberArray", () => {
  it("gibt eine Kopie gültiger Zahlen-Arrays zurück", () => {
    const original: unknown = [1, 2, 3];
    const result = toNumberArray(original);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(original); // neue Referenz!
    expect(toNumberArray([])).toEqual([]);
  });

  it("wirft TypeError bei falschen Eingaben", () => {
    expect(() => toNumberArray("1,2,3")).toThrow(TypeError);
    expect(() => toNumberArray([1, "2", 3])).toThrow(TypeError);
    expect(() => toNumberArray({ 0: 1, length: 1 })).toThrow(TypeError);
    expect(() => toNumberArray(null)).toThrow(TypeError);
  });
});
