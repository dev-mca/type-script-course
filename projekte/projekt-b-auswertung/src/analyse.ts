// Projekt B – Meilenstein 4: Auswertung
//
// Eine REINE Funktion: keine Dateien, kein Netzwerk, kein Date.now().
// Gleiche Eingabe → gleiche Ausgabe. Dadurch ist sie leicht zu testen.

import type { Booking, Report, Service } from "./typen";

/**
 * Berechnet den Report. Die genaue Bedeutung jedes Felds steht in typen.ts beim Typ Report.
 *
 * Tipp: Schreib für jedes Feld eine eigene kleine Funktion (revenueByMonth(…),
 * topServices(…), …) und setze sie hier zusammen. So bleibt jede Funktion kurz
 * und einzeln testbar.
 *
 * Wochentag aus einem Datum: new Date(`${date}T00:00:00Z`).getUTCDay()
 * liefert 0 = Sonntag, 1 = Montag, … 6 = Samstag.
 */
export function analyze(bookings: readonly Booking[], services: readonly Service[]): Report {
  throw new Error("TODO: Projekt B – analyze");
}
