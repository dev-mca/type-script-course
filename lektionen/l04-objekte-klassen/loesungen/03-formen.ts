// Lösung Aufgabe 3 – Abstrakte Klassen und Vererbung

export abstract class Shape {
  constructor(readonly name: string) {}

  abstract area(): number;
  abstract perimeter(): number;

  // Template Method: definiert den Ablauf, die Details liefern die Unterklassen
  describe(): string {
    return `${this.name}: Fläche ${this.area().toFixed(2)}, Umfang ${this.perimeter().toFixed(2)}`;
  }
}

function assertPositive(value: number, label: string): void {
  if (!(value > 0)) {
    // !(value > 0) statt value <= 0 – fängt auch NaN ab
    throw new Error(`${label} muss grösser als 0 sein, war: ${value}`);
  }
}

export class Circle extends Shape {
  constructor(readonly radius: number) {
    super("Kreis");
    assertPositive(radius, "Radius");
  }

  override area(): number {
    return Math.PI * this.radius ** 2;
  }

  override perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

export class Rectangle extends Shape {
  constructor(
    readonly width: number,
    readonly height: number,
    name = "Rechteck",
  ) {
    super(name);
    assertPositive(width, "Breite");
    assertPositive(height, "Höhe");
  }

  override area(): number {
    return this.width * this.height;
  }

  override perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

export class Square extends Rectangle {
  constructor(side: number) {
    super(side, side, "Quadrat");
  }
}

export function totalArea(shapes: Shape[]): number {
  let total = 0;
  for (const shape of shapes) {
    total += shape.area();
  }
  return total;
}

export function largestShape(shapes: Shape[]): Shape | undefined {
  let largest: Shape | undefined;
  for (const shape of shapes) {
    if (largest === undefined || shape.area() > largest.area()) {
      largest = shape;
    }
  }
  return largest;
}
