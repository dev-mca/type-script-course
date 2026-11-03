// Lösung Aufgabe 1 – Zahlen

export function integerDivide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division durch 0");
  }
  // trunc schneidet Richtung 0 ab – genau wie die int-Division in Java.
  // Math.floor wäre bei negativen Zahlen falsch (-3.5 → -4).
  return Math.trunc(a / b);
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatChf(rappen: number): string {
  if (!Number.isInteger(rappen)) {
    throw new Error(`Rappenbetrag muss ganzzahlig sein, war: ${rappen}`);
  }
  // Variante 1: (rappen / 100).toFixed(2)
  // Variante 2 (ohne Gleitkomma): Franken und Rappen getrennt berechnen
  const francs = Math.trunc(rappen / 100);
  const cents = String(rappen % 100).padStart(2, "0");
  return `CHF ${francs}.${cents}`;
}

export function splitBill(totalRappen: number, people: number): number[] {
  if (people <= 0) {
    throw new Error("Es braucht mindestens eine Person");
  }
  const base = Math.trunc(totalRappen / people);
  const remainder = totalRappen % people;

  const parts: number[] = [];
  for (let i = 0; i < people; i++) {
    parts.push(i < remainder ? base + 1 : base);
  }
  return parts;
}
