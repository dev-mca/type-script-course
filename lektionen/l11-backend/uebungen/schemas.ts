// Lektion 11 – Teil B: Eingaben validieren mit Zod
// Tests: npm run test:watch -- l11-backend/uebungen/schemas
//
// Doku: https://zod.dev/basics  und  https://zod.dev/api
//
// Zod beschreibt die erwartete Form von Daten EINMAL – und liefert daraus
// sowohl die Laufzeit-Prüfung (safeParse) als auch den TypeScript-Typ (z.infer).

import { z } from "zod";

/**
 * B.1 Schema für den Body von POST /bookings:
 *   serviceId     – nicht-leerer String
 *   customerName  – String, Leerzeichen am Rand entfernen (.trim()),
 *                   danach 2–80 Zeichen; Meldung bei zu kurz: "Name zu kurz"
 *   start         – String im Format JJJJ-MM-TTTHH:MM, z. B. "2026-11-20T10:00"
 *                   Meldung bei falschem Format: "Format JJJJ-MM-TTTHH:MM erwartet"
 *
 * Zusätzliche, unbekannte Felder werden von z.object standardmässig entfernt.
 */
export const CreateBookingSchema = z.object({
  // TODO: Teil B.1
});

/** B.2 Der Typ wird aus dem Schema HERGELEITET – nicht von Hand geschrieben. */
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

/**
 * B.3 Schema für den Query-Parameter ?date=JJJJ-MM-TT (ein einzelner String).
 */
export const DateSchema = z.string(); // TODO: Teil B.3 – Format prüfen

export type ValidationIssue = { path: string; message: string };

/**
 * B.4 Wandelt einen ZodError in eine einfache Liste für die API-Antwort um.
 * Der Pfad wird mit "." verbunden: ["customer", "name"] → "customer.name"
 * Hinweis: error.issues ist ein Array mit { path, message, … }.
 */
export function formatIssues(error: z.ZodError): ValidationIssue[] {
  throw new Error("TODO: Teil B.4");
}
