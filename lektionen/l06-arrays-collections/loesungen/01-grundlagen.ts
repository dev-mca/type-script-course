// Lösung Aufgabe 1 – Die wichtigsten Array-Methoden

import type { Order } from "../uebungen/daten";

export function orderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.priceInRappen * item.quantity, 0);
}

export function totalRevenue(orders: readonly Order[]): number {
  return orders
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + orderTotal(order), 0);
}

export function ordersOf(orders: readonly Order[], customer: string): Order[] {
  return orders.filter((order) => order.customer === customer);
}

export function findOrder(orders: readonly Order[], id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function hasRefunds(orders: readonly Order[]): boolean {
  return orders.some((order) => order.status === "refunded");
}

export function allHaveItems(orders: readonly Order[]): boolean {
  return orders.every((order) => order.items.length > 0);
}

export function productNames(orders: readonly Order[]): string[] {
  return orders.flatMap((order) => order.items.map((item) => item.product));
}

export function averagePaidOrderValue(orders: readonly Order[]): number | undefined {
  const paid = orders.filter((order) => order.status === "paid");
  if (paid.length === 0) return undefined;
  return totalRevenue(paid) / paid.length;
}
