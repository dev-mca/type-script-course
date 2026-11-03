// Lösung Aufgabe 2 – Gruppieren und Zählen

import type { Category, Order, OrderStatus } from "../uebungen/daten";

export function countByStatus(orders: readonly Order[]): Record<OrderStatus, number> {
  // Mit allen Schlüsseln starten – so fehlt garantiert keiner
  const counts: Record<OrderStatus, number> = { paid: 0, open: 0, refunded: 0 };
  for (const order of orders) {
    counts[order.status]++;
  }
  return counts;
}

export function revenueByCategory(orders: readonly Order[]): Record<Category, number> {
  const revenue: Record<Category, number> = { Haar: 0, Bart: 0, Haut: 0 };
  for (const order of orders) {
    if (order.status !== "paid") continue;
    for (const item of order.items) {
      revenue[item.category] += item.priceInRappen * item.quantity;
    }
  }
  return revenue;
}

export function orderIdsByCustomer(orders: readonly Order[]): Map<string, string[]> {
  const grouped = Map.groupBy(orders, (order) => order.customer);
  // Map → Einträge → IDs extrahieren → wieder eine Map
  // Der Rückgabetyp-Hinweis [string, string[]] ist nötig, sonst würde TypeScript
  // ein Array (string | string[])[] statt eines Tupels herleiten.
  return new Map(
    [...grouped].map(([customer, customerOrders]): [string, string[]] => [
      customer,
      customerOrders.map((o) => o.id),
    ]),
  );
}

export type ProductSales = { product: string; quantity: number };

export function topProducts(orders: readonly Order[], n: number): ProductSales[] {
  const quantities = new Map<string, number>();
  for (const order of orders) {
    if (order.status !== "paid") continue;
    for (const { product, quantity } of order.items) {
      quantities.set(product, (quantities.get(product) ?? 0) + quantity);
    }
  }

  return [...quantities]
    .map(([product, quantity]) => ({ product, quantity }))
    .toSorted((a, b) => b.quantity - a.quantity || a.product.localeCompare(b.product, "de"))
    .slice(0, n);
}

export type MonthlyRevenue = { month: string; revenue: number };

export function monthlyRevenue(orders: readonly Order[]): MonthlyRevenue[] {
  const byMonth: Record<string, number> = {};
  for (const order of orders) {
    if (order.status !== "paid") continue;
    const month = order.date.slice(0, 7);
    const total = order.items.reduce((sum, i) => sum + i.priceInRappen * i.quantity, 0);
    byMonth[month] = (byMonth[month] ?? 0) + total;
  }

  return Object.entries(byMonth)
    .map(([month, revenue]) => ({ month, revenue }))
    .toSorted((a, b) => a.month.localeCompare(b.month)); // "JJJJ-MM" sortiert als String korrekt
}
