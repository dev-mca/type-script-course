import { describe, expect, it } from "vitest";
import { Circle, Rectangle, Shape, Square, largestShape, totalArea } from "./03-formen";

describe("3 Formen", () => {
  describe("Circle", () => {
    it("berechnet Fläche und Umfang", () => {
      const circle = new Circle(2);
      expect(circle.area()).toBeCloseTo(12.566, 3);
      expect(circle.perimeter()).toBeCloseTo(12.566, 3);
      expect(circle.name).toBe("Kreis");
    });

    it("beschreibt sich selbst", () => {
      expect(new Circle(1).describe()).toBe("Kreis: Fläche 3.14, Umfang 6.28");
    });
  });

  describe("Rectangle", () => {
    it("berechnet Fläche und Umfang", () => {
      const rect = new Rectangle(3, 4);
      expect(rect.area()).toBe(12);
      expect(rect.perimeter()).toBe(14);
      expect(rect.describe()).toBe("Rechteck: Fläche 12.00, Umfang 14.00");
    });
  });

  describe("Square", () => {
    it("ist ein Rechteck mit gleichen Seiten", () => {
      const square = new Square(5);
      expect(square.area()).toBe(25);
      expect(square.perimeter()).toBe(20);
      expect(square.describe()).toBe("Quadrat: Fläche 25.00, Umfang 20.00");
    });

    it("ist ein Rectangle und eine Shape", () => {
      const square = new Square(5);
      expect(square).toBeInstanceOf(Square);
      expect(square).toBeInstanceOf(Rectangle);
      expect(square).toBeInstanceOf(Shape);
    });
  });

  it("lehnt ungültige Masse ab", () => {
    expect(() => new Circle(0)).toThrow();
    expect(() => new Circle(-1)).toThrow();
    expect(() => new Rectangle(3, 0)).toThrow();
    expect(() => new Square(-2)).toThrow();
  });

  describe("totalArea", () => {
    it("summiert alle Flächen", () => {
      expect(totalArea([new Rectangle(2, 3), new Square(2)])).toBe(10);
      expect(totalArea([])).toBe(0);
    });
  });

  describe("largestShape", () => {
    it("findet die grösste Form", () => {
      const small = new Square(1);
      const big = new Circle(3);
      const medium = new Rectangle(4, 5);
      expect(largestShape([small, big, medium])).toBe(big);
    });

    it("liefert undefined bei leerer Liste", () => {
      expect(largestShape([])).toBeUndefined();
    });
  });
});
