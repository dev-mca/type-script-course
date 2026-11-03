import { describe, expect, it } from "vitest";
import {
  SERVICES,
  addRappen,
  parseEmail,
  toRappen,
  totalPrice,
  welcomeMessage,
} from "./04-branded-satisfies";

describe("4.1 toRappen", () => {
  it("akzeptiert ganze Zahlen ≥ 0", () => {
    expect(toRappen(0)).toBe(0);
    expect(toRappen(4500)).toBe(4500);
  });

  it("lehnt ungültige Beträge ab", () => {
    expect(() => toRappen(-1)).toThrow();
    expect(() => toRappen(12.5)).toThrow();
    expect(() => toRappen(NaN)).toThrow();
  });
});

describe("4.2 addRappen", () => {
  it("addiert", () => {
    expect(addRappen(toRappen(100), toRappen(250))).toBe(350);
  });
});

describe("4.3 parseEmail", () => {
  it("normalisiert gültige Adressen", () => {
    expect(parseEmail(" Melih@Example.CH ")).toBe("melih@example.ch");
    expect(welcomeMessage(parseEmail("a@b.ch"))).toContain("a@b.ch");
  });

  it("lehnt ungültige Adressen ab", () => {
    for (const invalid of ["", "melih", "melih@", "@example.ch", "me lih@example.ch", "a@b"]) {
      expect(() => parseEmail(invalid)).toThrow();
    }
  });
});

describe("4.4/4.5 SERVICES und totalPrice", () => {
  it("enthält die drei Services", () => {
    expect(Object.keys(SERVICES)).toEqual(["haircut", "beard", "color"]);
  });

  it("berechnet Gesamtpreise", () => {
    expect(totalPrice(["haircut", "beard"])).toBe(7000);
    expect(totalPrice(["color"])).toBe(9000);
    expect(totalPrice([])).toBe(0);
  });
});
