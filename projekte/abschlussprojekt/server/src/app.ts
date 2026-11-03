// Abschlussprojekt – Die Hono-App (Startpunkt, ausbauen!)

import { Hono } from "hono";
import type { Service } from "../../shared/typen";
import { SEED_SERVICES } from "./seed";

export type AppDependencies = {
  services?: Service[];
  // TODO M2/M3: repository, now, generateId, adminToken, …
};

export function createApp(dependencies: AppDependencies = {}): Hono {
  const services = dependencies.services ?? SEED_SERVICES;

  const app = new Hono();

  app.get("/health", (c) => c.json({ status: "ok" }));

  // Kunden sehen nur aktive Services
  app.get("/services", (c) => c.json(services.filter((service) => service.active)));

  // TODO M2: GET  /barbers
  // TODO M2: GET  /barbers/:id/slots?date=JJJJ-MM-TT&serviceId=…
  // TODO M3: POST /bookings, POST /bookings/:id/cancel
  // TODO M5: Admin-Routen unter /admin/… (mit Token-Prüfung als Middleware)
  // TODO M6: GET  /admin/stats

  app.notFound((c) => c.json({ error: "Nicht gefunden" }, 404));
  app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Interner Serverfehler" }, 500);
  });

  return app;
}
