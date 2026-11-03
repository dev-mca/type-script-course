// Projekt A – Meilenstein 1: Zeit-Hilfsfunktionen
//
// Intern rechnen wir mit «Minuten seit Mitternacht» (eine Zahl) – damit lassen
// sich Zeiten einfach vergleichen und addieren. Nach aussen verwenden wir "HH:MM".

import type { Time } from "./typen";

/**
 * "09:30" → 570
 * Gültig ist genau das Format HH:MM mit 00–23 Stunden und 00–59 Minuten
 * (zwei Ziffern jeweils!). Sonst: Error.
 */
export function parseTime(time: Time): number {
  throw new Error("TODO: Projekt A – parseTime");
}

/**
 * 570 → "09:30"
 * Erlaubt: ganze Zahlen von 0 bis 1439. Sonst: Error.
 */
export function formatTime(minutes: number): Time {
  throw new Error("TODO: Projekt A – formatTime");
}

/**
 * addMinutes("09:30", 45) → "10:15"
 * Ergebnis ausserhalb des Tages → Error (formatTime erledigt das für dich).
 */
export function addMinutes(time: Time, minutes: number): Time {
  throw new Error("TODO: Projekt A – addMinutes");
}
