// Abschlussprojekt – Gemeinsame Typen und Schemas für Server UND Web
//
// Das ist das Herz deiner Architektur: Jede Datenform wird hier EINMAL als
// Zod-Schema definiert. Der Server validiert damit Eingaben, das Web validiert
// damit Antworten – und beide leiten ihre TypeScript-Typen davon ab.
// Ändert sich etwas, meldet der Compiler jede betroffene Stelle in beiden Teilen.

import { z } from "zod";

// ─── Beispiel (vorgegeben) ───────────────────────────────────────────────────

export const ServiceSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  durationMinutes: z.number().int().positive(),
  priceInRappen: z.number().int().nonnegative(),
  active: z.boolean(),
});
export type Service = z.infer<typeof ServiceSchema>;

// ─── TODO M1 ─────────────────────────────────────────────────────────────────
//
// Definiere hier mindestens:
//   BarberSchema          – id, name, Arbeitszeiten (start/end "HH:MM")
//   BookingSchema         – wie in Lektion 11, plus barberId und customerEmail
//   CreateBookingSchema   – was der Kunde beim Buchen schickt
//   CancelBookingSchema   – Buchungsnummer + E-Mail zur Bestätigung
//   ApiErrorSchema        – die einheitliche Fehlerform { error, details? }
//
// Später (M5/M6) kommen dazu:
//   CreateServiceSchema / UpdateServiceSchema (Tipp: ServiceSchema.omit / .partial)
//   DashboardStatsSchema
