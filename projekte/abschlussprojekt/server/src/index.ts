// Abschlussprojekt – Server starten:  npm run final:api
//
// TODO M3: Konfiguration aus Umgebungsvariablen laden (wie in Lektion 9, Aufgabe 4)
//          und das Datei-Repository verwenden.

import { serve } from "@hono/node-server";
import { createApp } from "./app";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`✂️  Salon-API läuft auf http://localhost:${info.port}`);
});
