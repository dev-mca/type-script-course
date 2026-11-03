// Lösung Aufgabe 1 – Formatierung für die Oberfläche

import type { Booking } from "../../l11-backend/uebungen/daten";

export function formatChf(rappen: number): string {
  return `CHF ${(rappen / 100).toFixed(2)}`;
}

export function formatTime(localDateTime: string): string {
  return localDateTime.slice(11, 16);
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"] as const;

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  return `${weekday}, ${day}.${month}.${year}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function groupByDate(bookings: readonly Booking[]): Map<string, Booking[]> {
  const sorted = bookings.toSorted((a, b) => a.start.localeCompare(b.start));
  // Weil wir vorher sortieren, entstehen die Map-Einträge automatisch in Datumsreihenfolge
  return Map.groupBy(sorted, (booking) => booking.start.slice(0, 10));
}
