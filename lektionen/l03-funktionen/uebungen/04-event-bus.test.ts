import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "./04-event-bus";

describe("4 createEventBus", () => {
  it("ruft angemeldete Handler mit dem Payload auf", () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.on("booking", handler);
    bus.emit("booking", "Termin um 10:00");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("Termin um 10:00");
  });

  it("ruft nur Handler des passenden Ereignisses auf", () => {
    const bus = createEventBus();
    const bookingHandler = vi.fn();
    const cancelHandler = vi.fn();
    bus.on("booking", bookingHandler);
    bus.on("cancel", cancelHandler);
    bus.emit("cancel", "Termin abgesagt");
    expect(bookingHandler).not.toHaveBeenCalled();
    expect(cancelHandler).toHaveBeenCalledWith("Termin abgesagt");
  });

  it("ruft mehrere Handler in Anmelde-Reihenfolge auf", () => {
    const bus = createEventBus();
    const calls: string[] = [];
    bus.on("x", () => calls.push("erster"));
    bus.on("x", () => calls.push("zweiter"));
    bus.on("x", () => calls.push("dritter"));
    bus.emit("x", "");
    expect(calls).toEqual(["erster", "zweiter", "dritter"]);
  });

  it("ist bei Ereignissen ohne Handler kein Fehler", () => {
    const bus = createEventBus();
    expect(() => bus.emit("niemand-hoert-zu", "hallo")).not.toThrow();
    expect(bus.listenerCount("niemand-hoert-zu")).toBe(0);
  });

  it("meldet Handler über die zurückgegebene Funktion ab", () => {
    const bus = createEventBus();
    const handler = vi.fn();
    const unsubscribe = bus.on("booking", handler);
    expect(bus.listenerCount("booking")).toBe(1);
    unsubscribe();
    expect(bus.listenerCount("booking")).toBe(0);
    bus.emit("booking", "Termin");
    expect(handler).not.toHaveBeenCalled();
  });

  it("entfernt beim Abmelden nur die eigene Anmeldung", () => {
    const bus = createEventBus();
    const handler = vi.fn();
    const unsubscribeFirst = bus.on("x", handler);
    bus.on("x", handler); // derselbe Handler ein zweites Mal
    bus.emit("x", "a");
    expect(handler).toHaveBeenCalledTimes(2);

    unsubscribeFirst();
    unsubscribeFirst(); // zweimal aufrufen darf nichts kaputt machen
    expect(bus.listenerCount("x")).toBe(1);
    bus.emit("x", "b");
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("once ruft den Handler nur beim ersten Mal auf", () => {
    const bus = createEventBus();
    const handler = vi.fn();
    bus.once("ready", handler);
    bus.emit("ready", "1");
    bus.emit("ready", "2");
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith("1");
    expect(bus.listenerCount("ready")).toBe(0);
  });

  it("once kann vor dem ersten Aufruf abgemeldet werden", () => {
    const bus = createEventBus();
    const handler = vi.fn();
    const unsubscribe = bus.once("ready", handler);
    unsubscribe();
    bus.emit("ready", "1");
    expect(handler).not.toHaveBeenCalled();
  });

  it("★ ruft alle Handler auf, auch wenn sich einer während emit abmeldet", () => {
    const bus = createEventBus();
    const second = vi.fn();
    bus.once("x", () => {});
    bus.on("x", second);
    bus.emit("x", "payload");
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("erzeugt unabhängige Busse", () => {
    const busA = createEventBus();
    const busB = createEventBus();
    const handler = vi.fn();
    busA.on("x", handler);
    busB.emit("x", "nur B");
    expect(handler).not.toHaveBeenCalled();
  });
});
