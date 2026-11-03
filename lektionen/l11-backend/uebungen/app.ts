// Lektion 11 – Teil C: Die Booking-API
// Tests: npm run test:watch -- l11-backend/uebungen/app
// Ausprobieren: npm run api   (danach api.http in IntelliJ öffnen)
//
// Hier kommt alles zusammen: dein Router (Teil A), deine Schemas (Teil B) und
// das vorgegebene Repository (daten.ts).

import {
  type Booking,
  type BookingRepository,
  InMemoryBookingRepository,
  SERVICES,
  type Service,
  addMinutes,
} from "./daten";
import { Router, json } from "./router";
import { CreateBookingSchema, DateSchema, formatIssues } from "./schemas";

/** Alles, was die App von aussen braucht – im Test austauschbar (Dependency Injection) */
export type AppDependencies = {
  repository?: BookingRepository;
  services?: readonly Service[];
  /** liefert den aktuellen Zeitpunkt (für createdAt) */
  now?: () => Date;
  /** erzeugt eine neue, eindeutige ID */
  generateId?: () => string;
};

/**
 * Erzeugt die App mit diesen Endpunkten:
 *
 * GET    /health          → 200 { status: "ok" }
 * GET    /services        → 200 alle Services
 * GET    /services/:id    → 200 Service | 404 { error: "Service nicht gefunden" }
 *
 * GET    /bookings        → 200 alle Buchungen, sortiert nach start
 *        ?date=JJJJ-MM-TT → nur Buchungen, deren start mit diesem Datum beginnt
 *                           ungültiges Format → 400 { error: "Ungültiger Parameter: date" }
 *
 * POST   /bookings        Body: { serviceId, customerName, start }
 *        → 201 die neue Booking (id, serviceId, customerName, start, end, createdAt)
 *          end = start + Dauer des Service (addMinutes aus daten.ts)
 *          createdAt = now().toISOString()
 *        → 400 { error: "Ungültiges JSON" }                    wenn der Body kein JSON ist
 *        → 400 { error: "Ungültige Daten", details: [...] }    wenn das Schema nicht passt
 *                                                                (details = formatIssues(...))
 *        → 404 { error: "Service nicht gefunden" }             unbekannte serviceId
 *        → 409 { error: "Termin überschneidet sich mit einer bestehenden Buchung",
 *                conflictingId: "<id>" }                        Überschneidung (a.start < b.end && b.start < a.end)
 *
 * DELETE /bookings/:id    → 204 (leerer Body) | 404 { error: "Buchung nicht gefunden" }
 *
 * Tipp: Strings im Format JJJJ-MM-TTTHH:MM kann man direkt mit < und > vergleichen.
 */
export function createApp(dependencies: AppDependencies = {}): Router {
  const {
    repository = new InMemoryBookingRepository(),
    services = SERVICES,
    now = () => new Date(),
    generateId = () => crypto.randomUUID(),
  } = dependencies;

  const router = new Router();

  router.get("/health", () => json({ status: "ok" }));

  // TODO: Teil C – die übrigen Endpunkte

  return router;
}
