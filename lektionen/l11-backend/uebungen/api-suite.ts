// Gemeinsame Tests für die Booking-API (vorgegeben, NICHT verändern).
//
// Die Tests sprechen nur über Request → Response mit der App. Sie wissen nicht,
// wie die App intern gebaut ist. Darum laufen genau dieselben Tests gegen deinen
// eigenen Router (app.test.ts) UND gegen die Hono-Version (hono-app.test.ts).

import { describe, expect, it } from "vitest";
import { type Booking, InMemoryBookingRepository } from "./daten";

export type TestDependencies = {
  repository: InMemoryBookingRepository;
  now: () => Date;
  generateId: () => string;
};

export type Handler = (request: Request) => Promise<Response>;

const BASE = "http://localhost";
const NOW = new Date("2026-11-03T08:00:00.000Z");

function createDependencies(initial: Booking[] = []): TestDependencies {
  let counter = 0;
  return {
    repository: new InMemoryBookingRepository(initial),
    now: () => NOW,
    generateId: () => `b-${++counter}`,
  };
}

function post(path: string, body: unknown): Request {
  return new Request(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const booking = (overrides: Partial<Booking> = {}): Booking => ({
  id: "existing",
  serviceId: "s-cut",
  customerName: "Anna",
  start: "2026-11-20T10:00",
  end: "2026-11-20T10:30",
  createdAt: "2026-11-01T00:00:00.000Z",
  ...overrides,
});

export function runApiSuite(
  label: string,
  createHandler: (deps: TestDependencies) => Handler,
): void {
  describe(`${label}: Services und Health`, () => {
    it("GET /health", async () => {
      const response = await createHandler(createDependencies())(new Request(`${BASE}/health`));
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ status: "ok" });
    });

    it("GET /services liefert alle Services", async () => {
      const response = await createHandler(createDependencies())(new Request(`${BASE}/services`));
      expect(response.status).toBe(200);
      const body = (await response.json()) as { id: string }[];
      expect(body.map((s) => s.id)).toEqual(["s-cut", "s-beard", "s-combo", "s-color"]);
    });

    it("GET /services/:id", async () => {
      const handler = createHandler(createDependencies());
      const found = await handler(new Request(`${BASE}/services/s-beard`));
      expect(found.status).toBe(200);
      expect(await found.json()).toMatchObject({ id: "s-beard", name: "Bart" });

      const missing = await handler(new Request(`${BASE}/services/s-massage`));
      expect(missing.status).toBe(404);
      expect(await missing.json()).toEqual({ error: "Service nicht gefunden" });
    });

    it("antwortet mit JSON-404 auf unbekannte Pfade", async () => {
      const response = await createHandler(createDependencies())(
        new Request(`${BASE}/gibts-nicht`),
      );
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Nicht gefunden" });
    });
  });

  describe(`${label}: POST /bookings`, () => {
    it("erstellt eine Buchung", async () => {
      const deps = createDependencies();
      const response = await createHandler(deps)(
        post("/bookings", {
          serviceId: "s-combo",
          customerName: "  Melih ",
          start: "2026-11-20T10:00",
        }),
      );
      expect(response.status).toBe(201);
      const expected: Booking = {
        id: "b-1",
        serviceId: "s-combo",
        customerName: "Melih",
        start: "2026-11-20T10:00",
        end: "2026-11-20T10:45",
        createdAt: "2026-11-03T08:00:00.000Z",
      };
      expect(await response.json()).toEqual(expected);
      expect(deps.repository.findAll()).toEqual([expected]);
    });

    it("lehnt ungültiges JSON ab", async () => {
      const response = await createHandler(createDependencies())(post("/bookings", "{kaputt"));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "Ungültiges JSON" });
    });

    it("lehnt ungültige Daten mit Details ab", async () => {
      const response = await createHandler(createDependencies())(
        post("/bookings", { serviceId: "s-cut", customerName: "M", start: "morgen" }),
      );
      expect(response.status).toBe(400);
      const body = (await response.json()) as { error: string; details: { path: string }[] };
      expect(body.error).toBe("Ungültige Daten");
      expect(body.details.map((d) => d.path)).toEqual(["customerName", "start"]);
    });

    it("lehnt unbekannte Services ab", async () => {
      const response = await createHandler(createDependencies())(
        post("/bookings", {
          serviceId: "s-massage",
          customerName: "Melih",
          start: "2026-11-20T10:00",
        }),
      );
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Service nicht gefunden" });
    });

    it("lehnt Überschneidungen ab, erlaubt anschliessende Termine", async () => {
      const deps = createDependencies([booking()]); // 10:00–10:30
      const handler = createHandler(deps);

      const overlap = await handler(
        post("/bookings", { serviceId: "s-beard", customerName: "Bob", start: "2026-11-20T10:15" }),
      );
      expect(overlap.status).toBe(409);
      expect(await overlap.json()).toEqual({
        error: "Termin überschneidet sich mit einer bestehenden Buchung",
        conflictingId: "existing",
      });

      const before = await handler(
        post("/bookings", { serviceId: "s-cut", customerName: "Bob", start: "2026-11-20T09:30" }),
      );
      const after = await handler(
        post("/bookings", { serviceId: "s-beard", customerName: "Bob", start: "2026-11-20T10:30" }),
      );
      expect([before.status, after.status]).toEqual([201, 201]);
      expect(deps.repository.findAll()).toHaveLength(3);
    });
  });

  describe(`${label}: GET und DELETE /bookings`, () => {
    const initial = [
      booking({ id: "c", start: "2026-11-21T09:00", end: "2026-11-21T09:30" }),
      booking({ id: "a", start: "2026-11-20T14:00", end: "2026-11-20T14:30" }),
      booking({ id: "b", start: "2026-11-20T16:00", end: "2026-11-20T16:30" }),
    ];

    it("liefert alle Buchungen sortiert", async () => {
      const response = await createHandler(createDependencies(initial))(
        new Request(`${BASE}/bookings`),
      );
      expect(response.status).toBe(200);
      const body = (await response.json()) as Booking[];
      expect(body.map((b) => b.id)).toEqual(["a", "b", "c"]);
    });

    it("filtert nach Datum", async () => {
      const handler = createHandler(createDependencies(initial));
      const response = await handler(new Request(`${BASE}/bookings?date=2026-11-21`));
      expect(((await response.json()) as Booking[]).map((b) => b.id)).toEqual(["c"]);

      const invalid = await handler(new Request(`${BASE}/bookings?date=21.11.2026`));
      expect(invalid.status).toBe(400);
      expect(await invalid.json()).toEqual({ error: "Ungültiger Parameter: date" });
    });

    it("löscht Buchungen", async () => {
      const deps = createDependencies(initial);
      const handler = createHandler(deps);
      const deleted = await handler(new Request(`${BASE}/bookings/a`, { method: "DELETE" }));
      expect(deleted.status).toBe(204);
      expect(await deleted.text()).toBe("");
      expect(deps.repository.findById("a")).toBeUndefined();

      const again = await handler(new Request(`${BASE}/bookings/a`, { method: "DELETE" }));
      expect(again.status).toBe(404);
      expect(await again.json()).toEqual({ error: "Buchung nicht gefunden" });
    });
  });
}
