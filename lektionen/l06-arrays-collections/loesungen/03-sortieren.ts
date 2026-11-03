// Lösung Aufgabe 3 – Sortieren

import type { Order } from "../uebungen/daten";

export function sortByDateDesc(orders: readonly Order[]): Order[] {
  // ISO-Datumsstrings (JJJJ-MM-TT) lassen sich direkt als Strings vergleichen
  return orders.toSorted((a, b) => b.date.localeCompare(a.date));
}

export function sortNames(names: readonly string[]): string[] {
  return names.toSorted((a, b) => a.localeCompare(b, "de"));
}

export type SortKey = "date" | "customer" | "total";
export type Direction = "asc" | "desc";

function total(order: Order): number {
  return order.items.reduce((sum, i) => sum + i.priceInRappen * i.quantity, 0);
}

// Für jeden Schlüssel eine aufsteigende Vergleichsfunktion.
// Record<SortKey, …> stellt sicher, dass keiner vergessen geht.
const COMPARATORS: Record<SortKey, (a: Order, b: Order) => number> = {
  date: (a, b) => a.date.localeCompare(b.date),
  customer: (a, b) => a.customer.localeCompare(b.customer, "de"),
  total: (a, b) => total(a) - total(b),
};

export function sortOrders(orders: readonly Order[], key: SortKey, direction: Direction): Order[] {
  const compare = COMPARATORS[key];
  const factor = direction === "asc" ? 1 : -1;
  return orders.toSorted((a, b) => factor * compare(a, b) || a.id.localeCompare(b.id));
}

export type Player = { name: string; points: number };
export type RankedPlayer = Player & { rank: number };

export function rankPlayers(players: readonly Player[]): RankedPlayer[] {
  const sorted = players.toSorted(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name, "de"),
  );

  // forEach (wie auch map, filter …) bekommt als zweites Argument den Index.
  // Hier brauchen wir aber Zugriff auf den bereits berechneten Rang des Vorgängers,
  // darum bauen wir das Ergebnis Schritt für Schritt auf.
  const ranked: RankedPlayer[] = [];
  sorted.forEach((player, index) => {
    const previous = ranked[index - 1];
    const rank = previous && previous.points === player.points ? previous.rank : index + 1;
    ranked.push({ ...player, rank });
  });
  return ranked;
}
