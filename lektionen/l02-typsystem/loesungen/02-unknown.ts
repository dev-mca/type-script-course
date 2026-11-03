// Lösung Aufgabe 2 – Mit unknown sicher umgehen

export function describeValue(value: unknown): string {
  // Zuerst die Sonderfälle, die typeof falsch einordnen würde
  if (value === null) return "null";
  if (Array.isArray(value)) return `array (${value.length} Elemente)`;

  // Ab hier: TypeScript weiss nach jedem typeof-Check, welcher Typ vorliegt
  if (typeof value === "string") return `string (${value.length} Zeichen)`;

  // typeof liefert für alles andere genau den gewünschten Text:
  // "undefined", "number", "boolean", "object", "function" (und "bigint", "symbol")
  return typeof value;
}

export function parseAge(input: unknown): number {
  let age: number;
  if (typeof input === "number") {
    age = input;
  } else if (typeof input === "string" && input.trim() !== "") {
    age = Number(input);
  } else {
    throw new Error(`Kein gültiges Alter: ${String(input)}`);
  }

  if (!Number.isInteger(age) || age < 0 || age > 150) {
    throw new Error(`Alter ausserhalb des gültigen Bereichs: ${String(input)}`);
  }
  return age;
}

export function toNumberArray(input: unknown): number[] {
  if (!Array.isArray(input)) {
    throw new TypeError("Erwartet wurde ein Array");
  }
  const result: number[] = [];
  for (const element of input) {
    // element ist hier any – wir prüfen trotzdem, als wäre es unknown
    if (typeof element !== "number") {
      throw new TypeError(`Element ist keine Zahl: ${String(element)}`);
    }
    result.push(element);
  }
  return result;
}
