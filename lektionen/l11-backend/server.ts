// Startet die API aus Teil C mit deinem eigenen Router.
//
//   npm run api
//
// tsx watch startet den Server bei jeder Änderung automatisch neu.
// Danach im Browser: http://localhost:3000/services
// Oder in IntelliJ: api.http öffnen und auf ▶ neben einer Anfrage klicken.

import { serve } from "./node-adapter";
import { createApp } from "./uebungen/app";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

serve((request) => app.handle(request), port);
