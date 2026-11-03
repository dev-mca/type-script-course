import { describe, expect, it } from "vitest";
import { type Shape, area, isValidShape, perimeter, shapeName } from "./02-formen-union";

const circle: Shape = { kind: "circle", radius: 2 };
const rectangle: Shape = { kind: "rectangle", width: 3, height: 4 };
const triangle: Shape = { kind: "triangle", a: 3, b: 4, c: 5 };

describe("2.1 area", () => {
  it("berechnet die Fläche jeder Form", () => {
    expect(area(circle)).toBeCloseTo(12.566, 3);
    expect(area(rectangle)).toBe(12);
    expect(area(triangle)).toBeCloseTo(6);
  });

  it("wirft bei unbekannten Formen (z. B. aus fehlerhaftem JSON)", () => {
    const broken = JSON.parse('{"kind":"hexagon","side":2}') as Shape;
    expect(() => area(broken)).toThrow("Unbehandelter Fall");
  });
});

describe("2.2 perimeter", () => {
  it("berechnet den Umfang jeder Form", () => {
    expect(perimeter(circle)).toBeCloseTo(12.566, 3);
    expect(perimeter(rectangle)).toBe(14);
    expect(perimeter(triangle)).toBe(12);
  });
});

describe("2.3 shapeName", () => {
  it("liefert deutsche Namen", () => {
    expect(shapeName(circle)).toBe("Kreis");
    expect(shapeName(rectangle)).toBe("Rechteck");
    expect(shapeName(triangle)).toBe("Dreieck");
  });
});

describe("2.4 isValidShape", () => {
  it("akzeptiert gültige Formen", () => {
    expect(isValidShape(circle)).toBe(true);
    expect(isValidShape(rectangle)).toBe(true);
    expect(isValidShape(triangle)).toBe(true);
  });

  it("lehnt nicht-positive Masse ab", () => {
    expect(isValidShape({ kind: "circle", radius: 0 })).toBe(false);
    expect(isValidShape({ kind: "rectangle", width: 3, height: -1 })).toBe(false);
    expect(isValidShape({ kind: "triangle", a: 0, b: 4, c: 5 })).toBe(false);
  });

  it("prüft die Dreiecksungleichung", () => {
    expect(isValidShape({ kind: "triangle", a: 1, b: 2, c: 10 })).toBe(false);
    expect(isValidShape({ kind: "triangle", a: 1, b: 2, c: 3 })).toBe(false); // entartet
  });
});
