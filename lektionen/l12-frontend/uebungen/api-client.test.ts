import { describe, expect, it, vi } from "vitest";
import { ApiError, type FetchFn, createApiClient } from "./api-client";

const SERVICE = { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 };
const BOOKING = {
  id: "b-1",
  serviceId: "s-cut",
  customerName: "Melih",
  start: "2026-11-20T10:00",
  end: "2026-11-20T10:30",
  createdAt: "2026-11-03T08:00:00.000Z",
};

const respond = (body: unknown, status = 200) =>
  new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function clientWith(response: Response) {
  const fetchFn = vi.fn<FetchFn>(async () => response);
  return { client: createApiClient("/api", fetchFn), fetchFn };
}

describe("2 getServices", () => {
  it("lädt und prüft Services", async () => {
    const { client, fetchFn } = clientWith(respond([SERVICE]));
    expect(await client.getServices()).toEqual([SERVICE]);
    expect(fetchFn.mock.calls[0]?.[0]).toBe("/api/services");
  });

  it("wirft ApiError, wenn die Antwort nicht passt", async () => {
    const { client } = clientWith(respond([{ id: "s-cut" }]));
    await expect(client.getServices()).rejects.toBeInstanceOf(ApiError);
  });

  it("wirft ApiError bei Serverfehlern", async () => {
    const { client } = clientWith(respond({ error: "kaputt" }, 500));
    await expect(client.getServices()).rejects.toMatchObject({ name: "ApiError", status: 500 });
  });
});

describe("2 getBookings", () => {
  it("lädt alle oder nach Datum gefilterte Buchungen", async () => {
    const { client, fetchFn } = clientWith(respond([BOOKING]));
    expect(await client.getBookings("2026-11-20")).toEqual([BOOKING]);
    expect(fetchFn.mock.calls[0]?.[0]).toBe("/api/bookings?date=2026-11-20");

    const second = clientWith(respond([]));
    await second.client.getBookings();
    expect(second.fetchFn.mock.calls[0]?.[0]).toBe("/api/bookings");
  });
});

describe("2 createBooking", () => {
  const input = { serviceId: "s-cut", customerName: "Melih", start: "2026-11-20T10:00" };

  it("schickt JSON und liefert die Buchung", async () => {
    const { client, fetchFn } = clientWith(respond(BOOKING, 201));
    expect(await client.createBooking(input)).toEqual({ ok: true, booking: BOOKING });

    const [url, init] = fetchFn.mock.calls[0]!;
    expect(url).toBe("/api/bookings");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual(input);
  });

  it("liefert erwartbare Fehler als Ergebnis", async () => {
    const conflict = clientWith(
      respond({ error: "Termin überschneidet sich", conflictingId: "x" }, 409),
    );
    expect(await conflict.client.createBooking(input)).toEqual({
      ok: false,
      status: 409,
      message: "Termin überschneidet sich",
      details: [],
    });

    const invalid = clientWith(
      respond(
        {
          error: "Ungültige Daten",
          details: [
            { path: "customerName", message: "Name zu kurz" },
            { path: "start", message: "Format falsch" },
          ],
        },
        400,
      ),
    );
    expect(await invalid.client.createBooking(input)).toEqual({
      ok: false,
      status: 400,
      message: "Ungültige Daten",
      details: ["customerName: Name zu kurz", "start: Format falsch"],
    });
  });

  it("wirft ApiError bei unerwarteten Antworten", async () => {
    await expect(
      clientWith(respond({ error: "?" }, 500)).client.createBooking(input),
    ).rejects.toBeInstanceOf(ApiError);
    await expect(
      clientWith(respond({ nope: true }, 201)).client.createBooking(input),
    ).rejects.toBeInstanceOf(ApiError);
  });
});

describe("2 deleteBooking", () => {
  it("löscht mit DELETE", async () => {
    const { client, fetchFn } = clientWith(new Response(null, { status: 204 }));
    await client.deleteBooking("b-1");
    expect(fetchFn.mock.calls[0]?.[0]).toBe("/api/bookings/b-1");
    expect(fetchFn.mock.calls[0]?.[1]?.method).toBe("DELETE");
  });

  it("wirft ApiError, wenn die Buchung nicht existiert", async () => {
    const { client } = clientWith(respond({ error: "Buchung nicht gefunden" }, 404));
    await expect(client.deleteBooking("b-x")).rejects.toMatchObject({ status: 404 });
  });

  it("kodiert die ID für die URL", async () => {
    const { client, fetchFn } = clientWith(new Response(null, { status: 204 }));
    await client.deleteBooking("a/b c");
    expect(fetchFn.mock.calls[0]?.[0]).toBe("/api/bookings/a%2Fb%20c");
  });
});
