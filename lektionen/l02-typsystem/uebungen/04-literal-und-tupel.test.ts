import { describe, expect, it } from "vitest";
import { distance, minMax, opposite, parseSize, turnRight } from "./04-literal-und-tupel";

describe("4.1 turnRight", () => {
  it("dreht im Uhrzeigersinn", () => {
    expect(turnRight("north")).toBe("east");
    expect(turnRight("east")).toBe("south");
    expect(turnRight("south")).toBe("west");
    expect(turnRight("west")).toBe("north");
  });

  it("ist nach vier Drehungen wieder am Anfang", () => {
    expect(turnRight(turnRight(turnRight(turnRight("north"))))).toBe("north");
  });
});

describe("4.2 opposite", () => {
  it("liefert die Gegenrichtung", () => {
    expect(opposite("north")).toBe("south");
    expect(opposite("south")).toBe("north");
    expect(opposite("east")).toBe("west");
    expect(opposite("west")).toBe("east");
  });
});

describe("4.3 parseSize", () => {
  it("erkennt gültige Grössen", () => {
    expect(parseSize("M")).toBe("M");
    expect(parseSize(" m ")).toBe("M");
    expect(parseSize("xl")).toBe("XL");
  });

  it("wirft bei ungültigen Grössen", () => {
    expect(() => parseSize("XXL")).toThrow();
    expect(() => parseSize("")).toThrow();
  });
});

describe("4.4 minMax", () => {
  it("liefert Minimum und Maximum", () => {
    expect(minMax([3, 1, 4, 1, 5])).toEqual([1, 5]);
    expect(minMax([7])).toEqual([7, 7]);
    expect(minMax([-2, -8])).toEqual([-8, -2]);
  });

  it("wirft bei leerem Array", () => {
    expect(() => minMax([])).toThrow();
  });
});

describe("4.5 distance", () => {
  it("berechnet den Abstand", () => {
    expect(distance([0, 0], [3, 4])).toBe(5);
    expect(distance([1, 1], [1, 1])).toBe(0);
    expect(distance([-1, -1], [2, 3])).toBe(5);
  });
});
