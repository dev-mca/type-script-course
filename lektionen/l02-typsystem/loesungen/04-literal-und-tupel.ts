// Lösung Aufgabe 4 – Literal-Typen, as const und Tupel

export type Direction = "north" | "east" | "south" | "west";

export function turnRight(direction: Direction): Direction {
  switch (direction) {
    case "north":
      return "east";
    case "east":
      return "south";
    case "south":
      return "west";
    case "west":
      return "north";
  }
  // Kein default nötig: TypeScript erkennt, dass alle Fälle abgedeckt sind.
  // Fehlt ein case, meldet der Compiler "Function lacks ending return statement".
}

// Record<Direction, Direction> verlangt GENAU alle vier Schlüssel.
// Vergisst du einen, ist das ein Compilerfehler – sehr praktisch!
const OPPOSITES: Record<Direction, Direction> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

export function opposite(direction: Direction): Direction {
  return OPPOSITES[direction];
  // Kein `| undefined`, weil der Schlüsseltyp Direction ist und nicht string.
}

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export function parseSize(input: string): Size {
  const normalized = input.trim().toUpperCase();
  if (!(SIZES as readonly string[]).includes(normalized)) {
    throw new Error(`Ungültige Grösse: "${input}"`);
  }
  return normalized as Size; // sicher, weil wir es eine Zeile vorher geprüft haben
}

export function minMax(numbers: number[]): [min: number, max: number] {
  if (numbers.length === 0) {
    throw new Error("minMax braucht mindestens eine Zahl");
  }
  return [Math.min(...numbers), Math.max(...numbers)];
  // ...numbers ist der Spread-Operator: verteilt das Array auf einzelne Argumente.
  // Achtung: bei sehr grossen Arrays (> ~100 000 Elemente) besser eine Schleife verwenden.
}

export type Point = [x: number, y: number];

export function distance(a: Point, b: Point): number {
  const [x1, y1] = a;
  const [x2, y2] = b;
  return Math.hypot(x2 - x1, y2 - y1);
}
