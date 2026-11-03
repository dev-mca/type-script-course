// Lektion 11 – Teil D (optional, empfohlen): Dieselbe API mit Hono
// Tests: Setze in hono-app.test.ts TEIL_D = true, dann
//        npm run test:watch -- l11-backend/uebungen/hono
// Ausprobieren: npm run api:hono
//
// Hono (https://hono.dev) ist ein kleines, schnelles, TypeScript-first Web-Framework.
// Es basiert – genau wie dein Router – auf Request/Response. Darum laufen
// dieselben Tests aus api-suite.ts auch gegen diese Version.
//
// Die wichtigsten Hono-Bausteine:
//   const app = new Hono();
//   app.get("/services/:id", (c) => {
//     const id = c.req.param("id");          // Pfad-Parameter
//     const date = c.req.query("date");      // Query-Parameter (string | undefined)
//     return c.json({ … }, 200);             // JSON-Antwort mit Status
//   });
//   app.post("/bookings", async (c) => {
//     const body: unknown = await c.req.json();  // wirft bei ungültigem JSON!
//     …
//     return c.json(booking, 201);
//   });
//   app.delete("/bookings/:id", (c) => c.body(null, 204));   // leere Antwort
//   app.notFound((c) => c.json({ error: "Nicht gefunden" }, 404));
//   app.onError((error, c) => c.json({ error: "Interner Serverfehler" }, 500));
//
// Doku: https://hono.dev/docs/api/routing  und  https://hono.dev/docs/api/context
//
// Verwende deine Schemas (schemas.ts) und das Repository (daten.ts) wieder.
// Vergleiche danach beide Versionen: Was nimmt dir Hono ab? Was ist gleich geblieben?

import type { Hono } from "hono";
import type { AppDependencies } from "./app";

export function createHonoApp(dependencies: AppDependencies = {}): Hono {
  throw new Error("TODO: Teil D");
}
