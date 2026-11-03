// Aufgabe 2 – Gruppieren und Zählen
// Tests: npm run test:watch -- l06-arrays-collections/uebungen/02
//
// Solche Auswertungen sind das tägliche Brot in Dashboards und Reports.
// Wenn ein reduce zu unübersichtlich wird: for...of ist völlig okay!

import type { Category, Order, OrderStatus } from "./daten";

/**
 * 2.1 Anzahl Bestellungen pro Status. ALLE drei Status müssen im Ergebnis
 * vorkommen (auch mit 0).
 * → { paid: 5, open: 2, refunded: 1 }
 */
export function countByStatus(orders: readonly Order[]): Record<OrderStatus, number> {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * 2.2 Umsatz pro Kategorie, nur bezahlte Bestellungen.
 * Alle drei Kategorien müssen vorkommen.
 * → { Haar: 9300, Bart: 11600, Haut: 3500 }
 */
export function revenueByCategory(orders: readonly Order[]): Record<Category, number> {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * 2.3 Bestell-IDs pro Kunde als Map – die Kunden in der Reihenfolge ihres
 * ersten Auftretens, die IDs in Original-Reihenfolge.
 * → Map { "Melih" => ["B-1001", "B-1004"], "Anna" => [...], ... }
 *
 * Tipp: Map.groupBy(orders, …) liefert Map<string, Order[]> – danach noch die IDs extrahieren.
 */
export function orderIdsByCustomer(orders: readonly Order[]): Map<string, string[]> {
  throw new Error("TODO: Aufgabe 2.3");
}

export type ProductSales = { product: string; quantity: number };

/**
 * 2.4 Die n meistverkauften Produkte (nach Stückzahl, nur bezahlte Bestellungen).
 * Sortierung: Stückzahl absteigend, bei Gleichstand Produktname aufsteigend
 * (mit localeCompare(…, "de")).
 * → topProducts(ORDERS, 3) → [{ product: "Shampoo", quantity: 5 }, { product: "Bartöl", quantity: 3 }, …]
 */
export function topProducts(orders: readonly Order[], n: number): ProductSales[] {
  throw new Error("TODO: Aufgabe 2.4");
}

export type MonthlyRevenue = { month: string; revenue: number };

/**
 * 2.5 Umsatz pro Monat (nur bezahlt), aufsteigend nach Monat.
 * month ist im Format "JJJJ-MM" (die ersten 7 Zeichen von date).
 * Monate ohne Umsatz kommen nicht vor.
 */
export function monthlyRevenue(orders: readonly Order[]): MonthlyRevenue[] {
  throw new Error("TODO: Aufgabe 2.5");
}
