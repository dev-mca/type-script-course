// Lektion 12 – Aufgabe 2: Ein typsicherer API-Client
// Tests: npm run test:watch -- l12-frontend/uebungen/api-client
//
// Das Frontend spricht mit deiner API aus Lektion 11. Damit die Oberfläche
// sich nicht um fetch, Statuscodes und JSON kümmern muss, kapseln wir das in
// einem Client mit klaren, typisierten Methoden.
//
// Wichtig: Auch Antworten vom EIGENEN Server prüfen wir mit Zod. Server und
// Frontend werden oft unabhängig voneinander geändert – ein Schema fängt
// Unstimmigkeiten sofort und mit klarer Fehlermeldung ab.

import { z } from "zod";
import type { Booking, Service } from "../../l11-backend/uebungen/daten";

/** Schemas für die Antworten des Servers (vorgegeben) */
export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  durationMinutes: z.number(),
  priceInRappen: z.number(),
}) satisfies z.ZodType<Service>;

export const BookingSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  customerName: z.string(),
  start: z.string(),
  end: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<Booking>;

const ErrorBodySchema = z.object({
  error: z.string(),
  details: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
});

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

/** Unerwartete Probleme: Netzwerk, Serverfehler (5xx), Antwort hat falsche Form */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type CreateBookingInput = { serviceId: string; customerName: string; start: string };

/** Erwartbare Ergebnisse einer Buchung – die Oberfläche zeigt sie dem Benutzer an */
export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; status: 400 | 404 | 409; message: string; details: string[] };

export type ApiClient = {
  getServices(): Promise<Service[]>;
  getBookings(date?: string): Promise<Booking[]>;
  createBooking(input: CreateBookingInput): Promise<CreateBookingResult>;
  deleteBooking(id: string): Promise<void>;
};

/**
 * Erzeugt den Client.
 *
 * getServices()       GET  {baseUrl}/services          → Service[] (mit ServiceSchema prüfen)
 * getBookings(date?)  GET  {baseUrl}/bookings[?date=…] → Booking[] (mit BookingSchema prüfen)
 * createBooking(in)   POST {baseUrl}/bookings  (JSON-Body)
 *    201            → { ok: true, booking }
 *    400, 404, 409  → { ok: false, status, message: body.error,
 *                       details: body.details als "pfad: meldung"-Strings (oder []) }
 * deleteBooking(id)   DELETE {baseUrl}/bookings/{id}   → 204: fertig
 *
 * In ALLEN anderen Fällen (anderer Status, Antwort passt nicht zum Schema)
 * → ApiError werfen (mit Status, falls vorhanden).
 * Netzwerkfehler von fetch dürfen einfach durchgereicht werden.
 *
 * ⚠️ Browser-Falle: Der Standardwert für fetchFn ist absichtlich
 *    (url, init) => fetch(url, init)
 * und nicht einfach `fetch`. Ruft man ein «losgelöstes» window.fetch auf,
 * wirft der Browser «Illegal invocation» (das this-Problem aus Lektion 3!).
 *
 * Tipp: Schreib dir eine kleine Hilfsfunktion parseBody(response, schema), die
 * response.json() mit einem Schema prüft und bei Misserfolg einen ApiError wirft.
 */
export function createApiClient(
  baseUrl = "/api",
  fetchFn: FetchFn = (url, init) => fetch(url, init),
): ApiClient {
  throw new Error("TODO: Aufgabe 2");
}
