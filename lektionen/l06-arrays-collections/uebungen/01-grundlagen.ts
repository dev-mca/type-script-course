// Aufgabe 1 – Die wichtigsten Array-Methoden
// Tests: npm run test:watch -- l06-arrays-collections/uebungen/01
//
// Versuche, jede Funktion mit Array-Methoden zu lösen (ohne for-Schleife).
// Danach überlege: Wäre eine Schleife irgendwo lesbarer gewesen?

import type { Order } from "./daten";

/** 1.1 Gesamtbetrag einer Bestellung (Preis × Menge, summiert). Leere Bestellung → 0. */
export function orderTotal(order: Order): number {
  throw new Error("TODO: Aufgabe 1.1");
}

/** 1.2 Umsatz aller BEZAHLTEN Bestellungen (status "paid"). */
export function totalRevenue(orders: readonly Order[]): number {
  throw new Error("TODO: Aufgabe 1.2");
}

/** 1.3 Alle Bestellungen eines Kunden (in der ursprünglichen Reihenfolge). */
export function ordersOf(orders: readonly Order[], customer: string): Order[] {
  throw new Error("TODO: Aufgabe 1.3");
}

/** 1.4 Bestellung anhand der ID – oder undefined. */
export function findOrder(orders: readonly Order[], id: string): Order | undefined {
  throw new Error("TODO: Aufgabe 1.4");
}

/** 1.5 Gibt es mindestens eine rückerstattete Bestellung (status "refunded")? */
export function hasRefunds(orders: readonly Order[]): boolean {
  throw new Error("TODO: Aufgabe 1.5");
}

/** 1.6 Hat jede Bestellung mindestens einen Artikel? */
export function allHaveItems(orders: readonly Order[]): boolean {
  throw new Error("TODO: Aufgabe 1.6");
}

/**
 * 1.7 Alle Produktnamen aller Bestellungen in einer flachen Liste
 * (mit Duplikaten, in der Reihenfolge, in der sie vorkommen).
 * Hinweis: flatMap
 */
export function productNames(orders: readonly Order[]): string[] {
  throw new Error("TODO: Aufgabe 1.7");
}

/**
 * 1.8 Durchschnittlicher Bestellwert der BEZAHLTEN Bestellungen
 * (oder undefined, wenn es keine gibt).
 * Verwende deine Funktionen von oben!
 */
export function averagePaidOrderValue(orders: readonly Order[]): number | undefined {
  throw new Error("TODO: Aufgabe 1.8");
}
