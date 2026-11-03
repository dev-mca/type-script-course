import { describe, expect, it, vi } from "vitest";
import {
  type FetchFn,
  HttpError,
  getJson,
  loadDashboardStats,
  loadServiceNames,
  postJson,
} from "./04-fetch";

const BASE = "https://api.test";

/** Hilfsfunktion: eine JSON-Antwort bauen, wie sie ein Server schicken würde */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Ein falsches fetch, das je nach URL eine vorbereitete Antwort liefert */
function fakeFetch(routes: Record<string, () => Response>) {
  return vi.fn<FetchFn>(async (url) => {
    const route = routes[url];
    return route ? route() : jsonResponse({ error: "not found" }, 404);
  });
}

describe("4.1 getJson", () => {
  it("liefert den geparsten Body", async () => {
    const fetchFn = fakeFetch({ [`${BASE}/ping`]: () => jsonResponse({ pong: true }) });
    expect(await getJson(`${BASE}/ping`, fetchFn)).toEqual({ pong: true });
    expect(fetchFn).toHaveBeenCalledWith(`${BASE}/ping`);
  });

  it("wirft HttpError bei Fehlerstatus", async () => {
    const fetchFn = fakeFetch({ [`${BASE}/kaputt`]: () => jsonResponse({}, 500) });
    const promise = getJson(`${BASE}/kaputt`, fetchFn);
    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(getJson(`${BASE}/gibts-nicht`, fetchFn)).rejects.toMatchObject({ status: 404 });
  });
});

describe("4.2 postJson", () => {
  it("schickt JSON mit dem richtigen Header", async () => {
    const fetchFn = vi.fn<FetchFn>(async () => jsonResponse({ id: "b-1" }, 201));
    const result = await postJson(`${BASE}/bookings`, { serviceId: "s1" }, fetchFn);
    expect(result).toEqual({ id: "b-1" });

    const [url, init] = fetchFn.mock.calls[0]!;
    expect(url).toBe(`${BASE}/bookings`);
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual({ serviceId: "s1" });
  });

  it("wirft HttpError bei Fehlerstatus", async () => {
    const fetchFn = vi.fn<FetchFn>(async () => jsonResponse({ error: "Konflikt" }, 409));
    await expect(postJson(`${BASE}/bookings`, {}, fetchFn)).rejects.toMatchObject({ status: 409 });
  });
});

describe("4.3 loadServiceNames", () => {
  it("liefert die Namen sortiert", async () => {
    const fetchFn = fakeFetch({
      [`${BASE}/services`]: () =>
        jsonResponse([
          { id: "s1", name: "Haarschnitt", price: 4500 },
          { id: "s2", name: "Bart", price: 2500 },
          { id: "s3", name: "Färben", price: 9000 },
        ]),
    });
    expect(await loadServiceNames(BASE, fetchFn)).toEqual(["Bart", "Färben", "Haarschnitt"]);
  });

  it("lehnt unerwartete Antworten ab", async () => {
    const cases: unknown[] = [{ services: [] }, [{ id: "s1" }], [{ name: 42 }], ["Bart"], [null]];
    for (const body of cases) {
      const fetchFn = fakeFetch({ [`${BASE}/services`]: () => jsonResponse(body) });
      await expect(loadServiceNames(BASE, fetchFn)).rejects.toThrow(
        "Unerwartete Antwort von /services",
      );
    }
  });
});

describe("4.4 loadDashboardStats", () => {
  it("lädt beide Endpunkte gleichzeitig", async () => {
    let running = 0;
    let maxRunning = 0;
    const fetchFn = vi.fn<FetchFn>(async (url) => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((resolve) => setTimeout(resolve, 20));
      running--;
      if (url === `${BASE}/services`) return jsonResponse([{}, {}, {}]);
      if (url === `${BASE}/bookings`) return jsonResponse([{}, {}]);
      return jsonResponse({}, 404);
    });

    expect(await loadDashboardStats(BASE, fetchFn)).toEqual({ services: 3, bookings: 2 });
    expect(maxRunning).toBe(2);
  });

  it("wirft, wenn eine Antwort kein Array ist", async () => {
    const fetchFn = fakeFetch({
      [`${BASE}/services`]: () => jsonResponse([]),
      [`${BASE}/bookings`]: () => jsonResponse({ count: 5 }),
    });
    await expect(loadDashboardStats(BASE, fetchFn)).rejects.toBeInstanceOf(TypeError);
  });
});
