// Projekt B – Meilensteine 1 bis 3: Dateien lesen und prüfen
//
// Die Signaturen sind vorgegeben, weil die Abnahmetests sie verwenden.
// Hilfsfunktionen (z. B. isValidDate, validateRecord) darfst du in eigene
// Module auslagern – das ist sogar ausdrücklich erwünscht.

import type { ParseResult, Service } from "./typen";

/**
 * M1: Liest services.json und prüft jeden Eintrag
 * (id, name: nicht-leere Strings; priceInRappen, durationMinutes: ganze Zahlen > 0).
 * Ist die Datei kein Array oder ein Eintrag ungültig → Error werfen
 * (die Services sind die Grundlage – ohne gültige Services macht die Auswertung keinen Sinn).
 */
export async function loadServices(filePath: string): Promise<Service[]> {
  throw new Error("TODO: Projekt B – loadServices");
}

/**
 * M2: Liest den Inhalt einer CSV-Datei (Trennzeichen ";").
 *
 * - Die erste Zeile ist die Kopfzeile mit den deutschen Spaltennamen:
 *     id;datum;zeit;barber;serviceId;kunde;status
 *   Die Reihenfolge der Spalten darf variieren – lies sie aus der Kopfzeile!
 * - Leere Zeilen werden übersprungen (zählen aber bei der Zeilennummer mit).
 * - Jede ungültige Zeile wird NICHT übernommen, sondern als ParseError gemeldet.
 *   Es wird nur das ERSTE Problem pro Zeile gemeldet, in dieser Prüfreihenfolge:
 *     1. falsche Spaltenzahl     → "Erwartet 7 Spalten, gefunden 6"
 *     2. leeres Feld             → "Feld fehlt: time"   (englischer Feldname aus dem Booking-Typ,
 *                                                          Reihenfolge wie im Booking-Typ)
 *     3. ungültiges Datum        → "Ungültiges Datum: 2026-09-31"   (muss ein echtes Datum sein!)
 *     4. ungültige Uhrzeit       → "Ungültige Uhrzeit: 25:00"
 *     5. ungültiger Status       → "Ungültiger Status: abgesagt"
 *     6. unbekannter Service     → "Unbekannter Service: s-massage"
 *
 * @param source Dateiname für die Fehlermeldungen
 * @param knownServiceIds IDs aller gültigen Services
 */
export function parseBookingCsv(
  text: string,
  source: string,
  knownServiceIds: ReadonlySet<string>,
): ParseResult {
  throw new Error("TODO: Projekt B – parseBookingCsv");
}

/**
 * M2: Wie parseBookingCsv, aber für bereits geparstes JSON (unknown!).
 * - Ist data kein Array → Error werfen: `${source}: JSON-Array erwartet`
 * - Jeder Eintrag ist ein Objekt mit den englischen Feldnamen des Booking-Typs.
 * - Ein Eintrag, der kein Objekt ist → "Eintrag ist kein Objekt"
 * - Fehlendes oder nicht-string Feld → "Feld fehlt: <name>"
 * - Danach dieselben Prüfungen 3–6 wie bei CSV.
 * - line ist die Position im Array (erster Eintrag = 1).
 */
export function parseBookingJson(
  data: unknown,
  source: string,
  knownServiceIds: ReadonlySet<string>,
): ParseResult {
  throw new Error("TODO: Projekt B – parseBookingJson");
}

/**
 * M3: Liest services.json und ALLE Dateien "buchungen-*.csv" und "buchungen-*.json"
 * im Ordner – GLEICHZEITIG (Promise.all). Andere Dateien werden ignoriert.
 *
 * Ergebnis:
 *   bookings – alle gültigen Buchungen, sortiert nach Datum und Uhrzeit
 *   errors   – alle Probleme, sortiert nach Dateiname und Zeile
 *   services – die geladenen Services (brauchst du für die Analyse)
 */
export async function loadAllBookings(dir: string): Promise<ParseResult & { services: Service[] }> {
  throw new Error("TODO: Projekt B – loadAllBookings");
}
