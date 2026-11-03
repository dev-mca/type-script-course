// Aufgabe 3 – Abstrakte Klassen und Vererbung
// Tests: npm run test:watch -- l04-objekte-klassen/uebungen/03
//
// Baue diese Hierarchie:
//
//          Shape (abstract)
//         /               \
//     Circle            Rectangle
//                           |
//                        Square
//
// Shape:
//   - constructor(name: string) – name ist öffentlich lesbar und readonly
//   - abstract area(): number
//   - abstract perimeter(): number
//   - describe(): string  → "Kreis: Fläche 12.57, Umfang 12.57"
//       (beide Werte mit genau 2 Nachkommastellen – toFixed(2))
//       Diese Methode ist in Shape implementiert und ruft die abstrakten Methoden auf.
//       Das ist das «Template Method»-Muster.
//
// Circle(radius)                  → name "Kreis"
// Rectangle(width, height)        → name "Rechteck"
// Square(side) extends Rectangle  → name "Quadrat"
//   Tipp: Gib Rectangle einen dritten, optionalen Konstruktor-Parameter name = "Rechteck",
//   den Square mit super(side, side, "Quadrat") nutzen kann.
//
// Alle Masse müssen > 0 sein, sonst wirft der Konstruktor einen Error.
// Denk an das Schlüsselwort `override` beim Implementieren der Methoden!

export abstract class Shape {
  // TODO: Aufgabe 3.1
}

export class Circle {
  // TODO: Aufgabe 3.2 (extends Shape)
}

export class Rectangle {
  // TODO: Aufgabe 3.3 (extends Shape)
}

export class Square {
  // TODO: Aufgabe 3.4 (extends Rectangle)
}

/**
 * 3.5 Summe aller Flächen.
 */
export function totalArea(shapes: Shape[]): number {
  throw new Error("TODO: Aufgabe 3.5");
}

/**
 * 3.6 Die Form mit der grössten Fläche – oder undefined bei leerer Liste.
 */
export function largestShape(shapes: Shape[]): Shape | undefined {
  throw new Error("TODO: Aufgabe 3.6");
}
