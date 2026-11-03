import { describe, expect, it, vi } from "vitest";
import { createTypedEmitter } from "./03-typed-emitter";

type BookingEvents = {
  "booking:created": { id: string; customer: string };
  "booking:cancelled": { id: string; reason: string };
  "app:ready": undefined;
};

describe("3 createTypedEmitter", () => {
  it("ruft Handler mit dem Payload auf", () => {
    const events = createTypedEmitter<BookingEvents>();
    const handler = vi.fn();
    events.on("booking:created", handler);
    events.emit("booking:created", { id: "b1", customer: "Melih" });
    expect(handler).toHaveBeenCalledWith({ id: "b1", customer: "Melih" });
  });

  it("trennt die Ereignisse", () => {
    const events = createTypedEmitter<BookingEvents>();
    const created = vi.fn();
    const cancelled = vi.fn();
    events.on("booking:created", created);
    events.on("booking:cancelled", cancelled);
    events.emit("booking:cancelled", { id: "b1", reason: "krank" });
    expect(created).not.toHaveBeenCalled();
    expect(cancelled).toHaveBeenCalledTimes(1);
  });

  it("ruft Handler in Anmelde-Reihenfolge auf", () => {
    const events = createTypedEmitter<BookingEvents>();
    const order: number[] = [];
    events.on("app:ready", () => order.push(1));
    events.on("app:ready", () => order.push(2));
    events.emit("app:ready", undefined);
    expect(order).toEqual([1, 2]);
  });

  it("meldet Handler ab", () => {
    const events = createTypedEmitter<BookingEvents>();
    const handler = vi.fn();
    const off = events.on("booking:created", handler);
    expect(events.listenerCount("booking:created")).toBe(1);
    off();
    expect(events.listenerCount("booking:created")).toBe(0);
    events.emit("booking:created", { id: "b1", customer: "x" });
    expect(handler).not.toHaveBeenCalled();
  });

  it("entfernt Handler gezielt oder alle mit clear", () => {
    const events = createTypedEmitter<BookingEvents>();
    events.on("booking:created", () => {});
    events.on("booking:cancelled", () => {});
    events.on("booking:cancelled", () => {});
    events.clear("booking:cancelled");
    expect(events.listenerCount("booking:cancelled")).toBe(0);
    expect(events.listenerCount("booking:created")).toBe(1);
    events.clear();
    expect(events.listenerCount("booking:created")).toBe(0);
  });

  it("ist bei Ereignissen ohne Handler kein Fehler", () => {
    const events = createTypedEmitter<BookingEvents>();
    expect(() => events.emit("app:ready", undefined)).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Typ-Prüfungen: Diese Funktion wird nie ausgeführt, nur vom Compiler geprüft.
// ─────────────────────────────────────────────────────────────────────────────
export function typeChecks(): void {
  const events = createTypedEmitter<BookingEvents>();

  events.on("booking:created", (payload) => {
    const customer: string = payload.customer; // payload ist richtig typisiert
    // @ts-expect-error – created-Events haben kein reason
    console.log(payload.reason, customer);
  });

  // @ts-expect-error – unbekanntes Ereignis
  events.on("booking:moved", () => {});

  // @ts-expect-error – reason fehlt
  events.emit("booking:cancelled", { id: "b1" });

  // @ts-expect-error – falscher Payload-Typ
  events.emit("booking:created", "b1");
}
