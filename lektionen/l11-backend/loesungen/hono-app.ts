// Lösung Teil D – Dieselbe API mit Hono

import { Hono } from "hono";
import type { AppDependencies } from "./app";
import { type Booking, InMemoryBookingRepository, SERVICES, addMinutes } from "../uebungen/daten"; // in deiner Lösung: "./daten"
import { CreateBookingSchema, DateSchema, formatIssues } from "./schemas";

export function createHonoApp(dependencies: AppDependencies = {}): Hono {
  const {
    repository = new InMemoryBookingRepository(),
    services = SERVICES,
    now = () => new Date(),
    generateId = () => crypto.randomUUID(),
  } = dependencies;

  const findService = (id: string) => services.find((s) => s.id === id);

  const app = new Hono();

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.get("/services", (c) => c.json(services));

  app.get("/services/:id", (c) => {
    const service = findService(c.req.param("id"));
    return service ? c.json(service) : c.json({ error: "Service nicht gefunden" }, 404);
  });

  app.get("/bookings", (c) => {
    const date = c.req.query("date");
    let bookings = repository.findAll();
    if (date !== undefined) {
      if (!DateSchema.safeParse(date).success) {
        return c.json({ error: "Ungültiger Parameter: date" }, 400);
      }
      bookings = bookings.filter((b) => b.start.startsWith(`${date}T`));
    }
    return c.json(bookings.toSorted((a, b) => a.start.localeCompare(b.start)));
  });

  app.post("/bookings", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Ungültiges JSON" }, 400);
    }

    const parsed = CreateBookingSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Ungültige Daten", details: formatIssues(parsed.error) }, 400);
    }

    const service = findService(parsed.data.serviceId);
    if (!service) {
      return c.json({ error: "Service nicht gefunden" }, 404);
    }

    const start = parsed.data.start;
    const end = addMinutes(start, service.durationMinutes);
    const conflict = repository.findAll().find((b) => start < b.end && b.start < end);
    if (conflict) {
      return c.json(
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
      customerName: parsed.data.customerName,
      start,
      end,
      createdAt: now().toISOString(),
    };
    repository.add(booking);
    return c.json(booking, 201);
  });

  app.delete("/bookings/:id", (c) =>
    repository.remove(c.req.param("id"))
      ? c.body(null, 204)
      : c.json({ error: "Buchung nicht gefunden" }, 404),
  );

  app.notFound((c) => c.json({ error: "Nicht gefunden" }, 404));

  app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Interner Serverfehler" }, 500);
  });

  return app;
}
