// Aufgabe 3 – Sortieren
// Tests: npm run test:watch -- l06-arrays-collections/uebungen/03
//
// Regel: Nie das Original verändern → toSorted statt sort.

import type { Order } from "./daten";

/** 3.1 Bestellungen nach Datum, neueste zuerst. */
export function sortByDateDesc(orders: readonly Order[]): Order[] {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * 3.2 Namen alphabetisch nach deutschen Regeln (Umlaute richtig einordnen,
 * Gross-/Kleinschreibung spielt für die Reihenfolge keine Rolle).
 * sortNames(["Zürich", "Ärzte", "Bern", "anna", "Aarau"])
 *   → ["Aarau", "anna", "Ärzte", "Bern", "Zürich"]
 */
export function sortNames(names: readonly string[]): string[] {
  throw new Error("TODO: Aufgabe 3.2");
}

export type SortKey = "date" | "customer" | "total";
export type Direction = "asc" | "desc";

/**
 * 3.3 Sortiert Bestellungen nach einem wählbaren Kriterium und einer Richtung.
 *   date     → nach Datum
 *   customer → nach Kundenname (localeCompare, "de")
 *   total    → nach Gesamtbetrag (Preis × Menge)
 * Bei Gleichstand IMMER nach id aufsteigend – unabhängig von der Richtung.
 *
 * Tipp: Schreib zuerst eine Vergleichsfunktion für "asc" und kehre das Ergebnis
 * für "desc" um (× -1). Den id-Vergleich hängst du danach mit || an.
 */
export function sortOrders(orders: readonly Order[], key: SortKey, direction: Direction): Order[] {
  throw new Error("TODO: Aufgabe 3.3");
}

export type Player = { name: string; points: number };
export type RankedPlayer = Player & { rank: number }; // & = alle Felder von beiden (Lektion 10)

/**
 * 3.4 Rangliste: nach Punkten absteigend, bei Gleichstand nach Name aufsteigend.
 * Gleiche Punktzahl = gleicher Rang, danach wird übersprungen («olympische» Rangliste):
 *   Bob 80 → 1, Chiara 80 → 1, Anna 50 → 3, Eva 50 → 3, Dario 30 → 5
 */
export function rankPlayers(players: readonly Player[]): RankedPlayer[] {
  throw new Error("TODO: Aufgabe 3.4");
}
