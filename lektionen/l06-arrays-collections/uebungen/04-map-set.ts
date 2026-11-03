// Aufgabe 4 – Map und Set
// Tests: npm run test:watch -- l06-arrays-collections/uebungen/04

import type { Order } from "./daten";

/**
 * 4.1 Alle verschiedenen Produktnamen, alphabetisch sortiert (localeCompare, "de").
 * Hinweis: new Set(…) entfernt Duplikate, [...set] macht wieder ein Array daraus.
 */
export function uniqueProducts(orders: readonly Order[]): string[] {
  throw new Error("TODO: Aufgabe 4.1");
}

/**
 * 4.2 Worthäufigkeit als Map (Wörter klein geschrieben, getrennt durch Leerzeichen).
 * Die Map enthält die Wörter in der Reihenfolge ihres ersten Auftretens.
 * wordFrequency("Der Hund und der Fuchs") → Map { "der" => 2, "hund" => 1, "und" => 1, "fuchs" => 1 }
 */
export function wordFrequency(text: string): Map<string, number> {
  throw new Error("TODO: Aufgabe 4.2");
}

/**
 * 4.3 Die n häufigsten Wörter als [Wort, Anzahl]-Tupel.
 * Sortierung: Anzahl absteigend, bei Gleichstand Wort aufsteigend.
 * Verwende deine Funktion wordFrequency.
 */
export function topWords(text: string, n: number): [word: string, count: number][] {
  throw new Error("TODO: Aufgabe 4.3");
}

/**
 * 4.4 Schnittmenge: Elemente aus a, die auch in b vorkommen.
 * Reihenfolge wie in a, ohne Duplikate.
 * intersection(["a", "b", "c", "b"], ["b", "c", "d"]) → ["b", "c"]
 *
 * Für grosse Listen ist b.includes(x) langsam (O(n) pro Aufruf).
 * Ein Set macht die Suche O(1) – genau wie HashSet in Java.
 */
export function intersection(a: readonly string[], b: readonly string[]): string[] {
  throw new Error("TODO: Aufgabe 4.4");
}

/**
 * 4.5 Differenz: Elemente aus a, die NICHT in b vorkommen.
 * Reihenfolge wie in a, ohne Duplikate.
 */
export function difference(a: readonly string[], b: readonly string[]): string[] {
  throw new Error("TODO: Aufgabe 4.5");
}

/**
 * 4.6 Welche Kunden haben (über alle ihre NICHT rückerstatteten Bestellungen hinweg)
 * BEIDE Produkte gekauft? Ergebnis alphabetisch sortiert.
 *
 * customersWhoBoughtBoth(ORDERS, "Shampoo", "Bartöl") → ["Chiara", "Melih"]
 *
 * Tipp: Baue eine Map<Kunde, Set<Produkt>> auf.
 */
export function customersWhoBoughtBoth(
  orders: readonly Order[],
  productA: string,
  productB: string,
): string[] {
  throw new Error("TODO: Aufgabe 4.6");
}
