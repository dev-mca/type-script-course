// Lösung Aufgabe 3 – null, undefined, truthy/falsy

export function isBlank(value: string | null | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  // Ab hier weiss TypeScript: value ist ein string (Narrowing, Lektion 5)
  return value.trim() === "";

  // Kurzform mit Optional Chaining:
  // return (value?.trim() ?? "") === "";
}

export function withDefault(value: number | null | undefined, fallback: number): number {
  // NICHT value || fallback – das würde 0 ersetzen
  return value ?? fallback;
}

export function displayName(user: { firstName: string; nickname?: string | null }): string {
  if (isBlank(user.nickname)) {
    return user.firstName;
  }
  // TypeScript weiss hier nicht, dass nickname gesetzt ist (isBlank ist eine
  // normale Funktion). Mit einem "Type Guard" (Lektion 5) ginge das eleganter.
  return user.nickname ?? user.firstName;
}

export function parseQuantity(input: string | undefined): number {
  if (input === undefined || input.trim() === "") {
    return 1;
  }
  const quantity = Number(input);
  if (!Number.isInteger(quantity) || quantity < 0) {
    // Number.isInteger(NaN) ist false – deckt also auch "abc" ab
    throw new Error(`Ungültige Menge: "${input}"`);
  }
  return quantity;
}
