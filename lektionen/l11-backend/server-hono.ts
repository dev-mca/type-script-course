// Startet die Hono-Version der API (Teil D).
//
//   npm run api:hono
//
// @hono/node-server macht im Prinzip dasselbe wie unser node-adapter.ts.

import { serve } from "@hono/node-server";
import { createHonoApp } from "./uebungen/hono-app";

const port = Number(process.env.PORT ?? 3000);
const app = createHonoApp();

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🚀 Hono-API läuft auf http://localhost:${info.port}`);
});
