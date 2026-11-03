// Lösung Aufgabe 3 – Wörterbücher mit Record

export function countWords(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of text.toLowerCase().split(/\s+/)) {
    if (word === "") continue; // entsteht bei Leerzeichen am Anfang/Ende
    // counts[word] ist number | undefined – ?? 0 behandelt den ersten Fund
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}

export function getPrice(prices: Record<string, number>, product: string): number {
  const price = prices[product]; // number | undefined
  if (price === undefined) {
    // NICHT `if (!price)` – sonst würde der Gratis-Preis 0 als "fehlt" gelten!
    throw new Error(`Unbekanntes Produkt: ${product}`);
  }
  return price; // hier: number
}

export function mergeCounts(
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> {
  const result: Record<string, number> = { ...a }; // flache Kopie (Spread, Lektion 4)
  for (const key in b) {
    result[key] = (result[key] ?? 0) + (b[key] ?? 0);
  }
  return result;
}

export function invert(map: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in map) {
    const value = map[key];
    if (value !== undefined) {
      result[value] = key;
    }
  }
  return result;
}
