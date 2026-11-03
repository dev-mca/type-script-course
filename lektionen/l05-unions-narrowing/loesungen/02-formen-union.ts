// Lösung Aufgabe 2 – Discriminated Union mit Vollständigkeitsprüfung

export type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; a: number; b: number; c: number };

export function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}

export function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle": {
      // Geschweifte Klammern: eigener Block, damit `s` nur hier gilt
      const { a, b, c } = shape;
      const s = (a + b + c) / 2;
      return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }
    default:
      return assertNever(shape);
  }
}

export function perimeter(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return 2 * Math.PI * shape.radius;
    case "rectangle":
      return 2 * (shape.width + shape.height);
    case "triangle":
      return shape.a + shape.b + shape.c;
    default:
      return assertNever(shape);
  }
}

// Record über alle kind-Werte: Fehlt einer, meldet der Compiler das sofort.
const NAMES: Record<Shape["kind"], string> = {
  circle: "Kreis",
  rectangle: "Rechteck",
  triangle: "Dreieck",
};

export function shapeName(shape: Shape): string {
  return NAMES[shape.kind];
}

export function isValidShape(shape: Shape): boolean {
  switch (shape.kind) {
    case "circle":
      return shape.radius > 0;
    case "rectangle":
      return shape.width > 0 && shape.height > 0;
    case "triangle": {
      const { a, b, c } = shape;
      return a > 0 && b > 0 && c > 0 && a < b + c && b < a + c && c < a + b;
    }
    default:
      return assertNever(shape);
  }
}
