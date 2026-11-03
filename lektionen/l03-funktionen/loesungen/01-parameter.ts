// Lösung Aufgabe 1 – Parameter

export function greet(name: string, greeting = "Hallo"): string {
  // Der Typ von greeting (string) wird aus dem Default-Wert hergeleitet.
  return `${greeting} ${name}!`;
}

export function sum(...numbers: number[]): number {
  let total = 0;
  for (const n of numbers) {
    total += n;
  }
  return total;
}

export function average(...numbers: number[]): number | undefined {
  if (numbers.length === 0) {
    return undefined;
  }
  return sum(...numbers) / numbers.length;
}

// Für längere Optionen-Typen lohnt sich ein eigener Name:
type PriceOptions = {
  currency?: string;
  decimals?: number;
};

export function formatPrice(
  rappen: number,
  { currency = "CHF", decimals = 2 }: PriceOptions = {},
): string {
  return `${currency} ${(rappen / 100).toFixed(decimals)}`;
}
