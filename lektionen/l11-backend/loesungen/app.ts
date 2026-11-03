// Lösung Teil C – Die Booking-API

import {
  type Booking,
  type BookingRepository,
  InMemoryBookingRepository,
  SERVICES,
  type Service,
  addMinutes,
} from "../uebungen/daten"; // in deiner Lösung: "./daten"
import { Router, json } from "./router";
import { CreateBookingSchema, DateSchema, formatIssues } from "./schemas";

export type AppDependencies = {
  repository?: BookingRepository;
  services?: readonly Service[];
  now?: () => Date;
  generateId?: () => string;
};

/** Liest den Body als JSON – oder liefert undefined, wenn er kein gültiges JSON ist */
async function readJson(request: Request): Promise<{ ok: true; value: unknown } | { ok: false }> {
  try {
    return { ok: true, value: await request.json() };
  } catch {
    return { ok: false };
  }
}

export function createApp(dependencies: AppDependencies = {}): Router {
  const {
    repository = new InMemoryBookingRepository(),
    services = SERVICES,
    now = () => new Date(),
    generateId = () => crypto.randomUUID(),
  } = dependencies;

  const findService = (id: string) => services.find((s) => s.id === id);
  const byStart = (a: Booking, b: Booking) => a.start.localeCompare(b.start);

  const router = new Router();

  router.get("/health", () => json({ status: "ok" }));

  router.get("/services", () => json(services));

  router.get("/services/:id", (_request, { id }) => {
    const service = findService(id ?? "");
    return service ? json(service) : json({ error: "Service nicht gefunden" }, 404);
  });

  router.get("/bookings", (request) => {
    const date = new URL(request.url).searchParams.get("date");
    let bookings = repository.findAll();
    if (date !== null) {
      if (!DateSchema.safeParse(date).success) {
        return json({ error: "Ungültiger Parameter: date" }, 400);
      }
      bookings = bookings.filter((b) => b.start.startsWith(`${date}T`));
    }
    return json(bookings.toSorted(byStart));
  });

  router.post("/bookings", async (request) => {
    const body = await readJson(request);
    if (!body.ok) {
      return json({ error: "Ungültiges JSON" }, 400);
    }

    const parsed = CreateBookingSchema.safeParse(body.value);
    if (!parsed.success) {
      return json({ error: "Ungültige Daten", details: formatIssues(parsed.error) }, 400);
    }
    const input = parsed.data; // ab hier vollständig typisiert: CreateBookingInput

    const service = findService(input.serviceId);
    if (!service) {
      return json({ error: "Service nicht gefunden" }, 404);
    }

    const start = input.start;
    const end = addMinutes(start, service.durationMinutes);
    const conflict = repository.findAll().find((b) => start < b.end && b.start < end);
    if (conflict) {
      return json(
        {
          error: "Termin überschneidet sich mit einer bestehenden Buchung",
          conflictingId: conflict.id,
        },
        409,
      );
    }

    const booking: Booking = {
      id: generateId(),
      serviceId: service.id,
      customerName: input.customerName,
      start,
      end,
      createdAt: now().toISOString(),
    };
    repository.add(booking);
    return json(booking, 201);
  });

  router.delete("/bookings/:id", (_request, { id }) => {
    return repository.remove(id ?? "")
      ? new Response(null, { status: 204 })
      : json({ error: "Buchung nicht gefunden" }, 404);
  });

  return router;
}
