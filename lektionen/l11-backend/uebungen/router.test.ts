import { describe, expect, it } from "vitest";
import { Router, json } from "./router";

const BASE = "http://localhost";
const get = (path: string) => new Request(`${BASE}${path}`);

describe("A.1 json", () => {
  it("erzeugt eine JSON-Antwort", async () => {
    const response = json({ ok: true });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await response.json()).toEqual({ ok: true });
  });

  it("übernimmt den Status", () => {
    expect(json({ error: "weg" }, 404).status).toBe(404);
  });
});

describe("A.2 Router", () => {
  it("ruft den passenden Handler auf", async () => {
    const router = new Router().get("/health", () => json({ status: "ok" }));
    const response = await router.handle(get("/health"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("unterscheidet Methoden", async () => {
    const router = new Router()
      .get("/items", () => json("get"))
      .post("/items", () => json("post", 201))
      .delete("/items", () => new Response(null, { status: 204 }));
    expect(await (await router.handle(get("/items"))).json()).toBe("get");
    expect((await router.handle(new Request(`${BASE}/items`, { method: "POST" }))).status).toBe(
      201,
    );
    expect((await router.handle(new Request(`${BASE}/items`, { method: "DELETE" }))).status).toBe(
      204,
    );
  });

  it("liest Pfad-Parameter", async () => {
    const router = new Router().get("/shops/:shop/services/:id", (_req, params) => json(params));
    const response = await router.handle(get("/shops/aarau/services/s-cut"));
    expect(await response.json()).toEqual({ shop: "aarau", id: "s-cut" });
  });

  it("dekodiert Parameter", async () => {
    const router = new Router().get("/kunden/:name", (_req, params) => json(params.name));
    expect(await (await router.handle(get("/kunden/Ren%C3%A9"))).json()).toBe("René");
  });

  it("ignoriert Query-Parameter und abschliessende Schrägstriche", async () => {
    const router = new Router().get("/bookings", (req) =>
      json(new URL(req.url).searchParams.get("date")),
    );
    expect(await (await router.handle(get("/bookings?date=2026-11-20"))).json()).toBe("2026-11-20");
    expect((await router.handle(get("/bookings/"))).status).toBe(200);
  });

  it("verlangt für Parameter einen Wert und die richtige Segmentanzahl", async () => {
    const router = new Router().get("/services/:id", () => json("x"));
    expect((await router.handle(get("/services"))).status).toBe(404);
    expect((await router.handle(get("/services/a/b"))).status).toBe(404);
  });

  it("nimmt bei mehreren Treffern die zuerst registrierte Route", async () => {
    const router = new Router()
      .get("/services/special", () => json("special"))
      .get("/services/:id", () => json("param"));
    expect(await (await router.handle(get("/services/special"))).json()).toBe("special");
    expect(await (await router.handle(get("/services/other"))).json()).toBe("param");
  });

  it("antwortet mit 404 bei unbekanntem Pfad", async () => {
    const response = await new Router().get("/a", () => json("a")).handle(get("/b"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Nicht gefunden" });
  });

  it("antwortet mit 405 bei falscher Methode", async () => {
    const router = new Router().get("/items", () => json("get")).post("/items", () => json("post"));
    const response = await router.handle(new Request(`${BASE}/items`, { method: "DELETE" }));
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, POST");
    expect(await response.json()).toEqual({ error: "Methode nicht erlaubt" });
  });

  it("fängt Fehler in Handlern ab – auch asynchrone", async () => {
    const router = new Router()
      .get("/sync", () => {
        throw new Error("kaputt");
      })
      .get("/async", async () => {
        await Promise.resolve();
        throw new Error("auch kaputt");
      });
    for (const path of ["/sync", "/async"]) {
      const response = await router.handle(get(path));
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: "Interner Serverfehler" });
    }
  });
});
