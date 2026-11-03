// Lektion 12 – Aufgabe 1: Formatierung für die Oberfläche
// Tests: npm run test:watch -- l12-frontend/uebungen/formatierung
//
// Reine Funktionen ohne DOM – darum leicht zu testen. Sowohl die DOM-App (Teil A)
// als auch die React-App (Teil B) verwenden sie.

import type { Booking } from "../../l11-backend/uebungen/daten";

/**
 * 1.1 Rappen → "CHF 45.00"
 */
export function formatChf(rappen: number): string {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * 1.2 Uhrzeit aus "2026-11-20T10:00" → "10:00"
 */
export function formatTime(localDateTime: string): string {
  throw new Error("TODO: Aufgabe 1.2");
}

/**
 * 1.3 Datum "2026-11-20" → "Fr, 20.11.2026"
 * Wochentage: So, Mo, Di, Mi, Do, Fr, Sa
 * Tipp: new Date(`${date}T00:00:00Z`).getUTCDay() (0 = Sonntag)
 *
 * (Für echte Apps gibt es Intl.DateTimeFormat – schau es dir im Recherche-Auftrag an.
 * Hier bauen wir es selbst, damit das Ergebnis überall gleich aussieht.)
 */
export function formatDate(date: string): string {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Dauer in Minuten → lesbarer Text
 *   15 → "15 min", 60 → "1 h", 90 → "1 h 30 min"
 */
export function formatDuration(minutes: number): string {
  throw new Error("TODO: Aufgabe 1.4");
}

/**
 * 1.5 Gruppiert Buchungen nach Datum (die ersten 10 Zeichen von start).
 * Die Map ist nach Datum aufsteigend sortiert, die Buchungen pro Tag nach Startzeit.
 */
export function groupByDate(bookings: readonly Booking[]): Map<string, Booking[]> {
  throw new Error("TODO: Aufgabe 1.5");
}
