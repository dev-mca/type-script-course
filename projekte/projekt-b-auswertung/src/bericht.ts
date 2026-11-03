// Projekt B – Meilenstein 5: Ausgabe

import type { ParseError, Report } from "./typen";

/**
 * Formatiert den Report als lesbaren Text für die Konsole. Das Layout bestimmst
 * du – es MUSS aber diese Zeilen (genau so) enthalten:
 *
 *   Auswertung 2026-09-01 bis 2026-11-07       (bei period = null: "Auswertung (keine Daten)")
 *   Umsatz total: CHF 785.00
 *   No-Show-Quote: 17.6 %                       (noShowRate × 100, eine Nachkommastelle)
 *
 * Und für jeden Monat, jeden Barber und jeden Top-Service je eine Zeile, die den
 * Namen bzw. Monat und den Betrag als "CHF …" enthält. Gestalte es übersichtlich!
 */
export function renderText(report: Report): string {
  throw new Error("TODO: Projekt B – renderText");
}

/** Der Report als formatiertes JSON (2 Leerzeichen Einrückung). */
export function renderJson(report: Report): string {
  throw new Error("TODO: Projekt B – renderJson");
}

/**
 * Formatiert die Liste der Fehler, eine Zeile pro Fehler:
 *   "buchungen-2026-09.csv:8 – Ungültiges Datum: 2026-09-31"
 * Leere Liste → "" (leerer String)
 */
export function renderErrors(errors: readonly ParseError[]): string {
  throw new Error("TODO: Projekt B – renderErrors");
}
