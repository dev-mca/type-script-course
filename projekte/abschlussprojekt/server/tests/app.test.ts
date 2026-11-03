// Abschlussprojekt – Server-Tests (Startpunkt – hier kommen deine Tests hin)
// Ausführen: npm run test:watch -- abschlussprojekt

import { describe, expect, it } from "vitest";
import type { Service } from "../../shared/typen";
import { createApp } from "../src/app";

const BASE = "http://localhost";

describe("Salon-API", () => {
  it("GET /health", async () => {
    const response = await createApp().fetch(new Request(`${BASE}/health`));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("GET /services liefert nur aktive Services", async () => {
    const services: Service[] = [
      { id: "a", name: "Aktiv", durationMinutes: 30, priceInRappen: 1000, active: true },
      { id: "b", name: "Inaktiv", durationMinutes: 30, priceInRappen: 1000, active: false },
    ];
    const response = await createApp({ services }).fetch(new Request(`${BASE}/services`));
    const body = (await response.json()) as Service[];
    expect(body.map((s) => s.id)).toEqual(["a"]);
  });

  it("antwortet auf unbekannte Pfade mit JSON-404", async () => {
    const response = await createApp().fetch(new Request(`${BASE}/gibts-nicht`));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Nicht gefunden" });
  });
});
