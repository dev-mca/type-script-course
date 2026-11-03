// Lösung Aufgabe 2 – Ein typsicherer API-Client

import { z } from "zod";
import type { Booking, Service } from "../../l11-backend/uebungen/daten";

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

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; status: 400 | 404 | 409; message: string; details: string[] };

export type ApiClient = {
  getServices(): Promise<Service[]>;
  getBookings(date?: string): Promise<Booking[]>;
  createBooking(input: CreateBookingInput): Promise<CreateBookingResult>;
  deleteBooking(id: string): Promise<void>;
};

/** Liest den Body und prüft ihn mit dem Schema – sonst ApiError */
async function parseBody<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  const body: unknown = await response.json().catch(() => undefined);
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError(`Unerwartete Antwort (HTTP ${response.status})`, response.status);
  }
  return result.data;
}

const EXPECTED_ERRORS = [400, 404, 409] as const;
type ExpectedError = (typeof EXPECTED_ERRORS)[number];

function isExpectedError(status: number): status is ExpectedError {
  return (EXPECTED_ERRORS as readonly number[]).includes(status);
}

export function createApiClient(
  baseUrl = "/api",
  fetchFn: FetchFn = (url, init) => fetch(url, init),
): ApiClient {
  async function getList<T>(path: string, schema: z.ZodType<T>): Promise<T[]> {
    const response = await fetchFn(`${baseUrl}${path}`);
    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status} bei ${path}`, response.status);
    }
    return parseBody(response, z.array(schema));
  }

  return {
    getServices: () => getList("/services", ServiceSchema),

    getBookings: (date) =>
      getList(date ? `/bookings?date=${encodeURIComponent(date)}` : "/bookings", BookingSchema),

    async createBooking(input) {
      const response = await fetchFn(`${baseUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (response.status === 201) {
        return { ok: true, booking: await parseBody(response, BookingSchema) };
      }
      if (isExpectedError(response.status)) {
        const body = await parseBody(response, ErrorBodySchema);
        return {
          ok: false,
          status: response.status,
          message: body.error,
          details: (body.details ?? []).map((d) => `${d.path}: ${d.message}`),
        };
      }
      throw new ApiError(`HTTP ${response.status} beim Buchen`, response.status);
    },

    async deleteBooking(id) {
      const response = await fetchFn(`${baseUrl}/bookings/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (response.status !== 204) {
        throw new ApiError(`HTTP ${response.status} beim Löschen`, response.status);
      }
    },
  };
}
