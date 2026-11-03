// Lösung Aufgabe 4 – Map und Set

import type { Order } from "../uebungen/daten";

export function uniqueProducts(orders: readonly Order[]): string[] {
  const products = new Set(orders.flatMap((o) => o.items.map((i) => i.product)));
  return [...products].toSorted((a, b) => a.localeCompare(b, "de"));
}

export function wordFrequency(text: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().split(/\s+/)) {
    if (word === "") continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}

export function topWords(text: string, n: number): [word: string, count: number][] {
  return [...wordFrequency(text)]
    .toSorted(([wordA, countA], [wordB, countB]) => countB - countA || wordA.localeCompare(wordB))
    .slice(0, n);
}

export function intersection(a: readonly string[], b: readonly string[]): string[] {
  const inB = new Set(b);
  // Set um das Ergebnis herum entfernt Duplikate und behält die Reihenfolge von a
  return [...new Set(a.filter((x) => inB.has(x)))];
}

export function difference(a: readonly string[], b: readonly string[]): string[] {
  const inB = new Set(b);
  return [...new Set(a.filter((x) => !inB.has(x)))];
}

export function customersWhoBoughtBoth(
  orders: readonly Order[],
  productA: string,
  productB: string,
): string[] {
  const productsByCustomer = new Map<string, Set<string>>();
  for (const order of orders) {
    if (order.status === "refunded") continue;
    const products = productsByCustomer.get(order.customer) ?? new Set<string>();
    for (const item of order.items) {
      products.add(item.product);
    }
    productsByCustomer.set(order.customer, products);
  }

  return [...productsByCustomer]
    .filter(([, products]) => products.has(productA) && products.has(productB))
    .map(([customer]) => customer)
    .toSorted((a, b) => a.localeCompare(b, "de"));
}
