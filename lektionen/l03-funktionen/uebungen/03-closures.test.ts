import { describe, expect, it, vi } from "vitest";
import { createCounter, createIdGenerator, memoize, once } from "./03-closures";

describe("3.1 createCounter", () => {
  it("zählt hoch und runter", () => {
    const counter = createCounter();
    expect(counter.value()).toBe(0);
    expect(counter.increment()).toBe(1);
    expect(counter.increment()).toBe(2);
    expect(counter.decrement()).toBe(1);
    expect(counter.value()).toBe(1);
  });

  it("startet beim angegebenen Wert und setzt darauf zurück", () => {
    const counter = createCounter(10);
    counter.increment();
    counter.increment();
    expect(counter.value()).toBe(12);
    counter.reset();
    expect(counter.value()).toBe(10);
  });

  it("erzeugt unabhängige Zähler", () => {
    const a = createCounter();
    const b = createCounter();
    a.increment();
    a.increment();
    b.increment();
    expect(a.value()).toBe(2);
    expect(b.value()).toBe(1);
  });

  it("speichert den Zustand nicht in einem sichtbaren Feld", () => {
    const counter = createCounter(5);
    // Nur die vier Funktionen sollen sichtbar sein
    expect(Object.keys(counter).sort()).toEqual(["decrement", "increment", "reset", "value"]);
  });
});

describe("3.2 createIdGenerator", () => {
  it("erzeugt fortlaufende IDs", () => {
    const nextUserId = createIdGenerator("u");
    expect(nextUserId()).toBe("u-1");
    expect(nextUserId()).toBe("u-2");
    expect(nextUserId()).toBe("u-3");
  });

  it("hat pro Generator einen eigenen Zähler", () => {
    const users = createIdGenerator("u");
    const orders = createIdGenerator("order");
    users();
    users();
    expect(orders()).toBe("order-1");
    expect(users()).toBe("u-3");
  });
});

describe("3.3 once", () => {
  it("ruft fn nur einmal auf und liefert immer dasselbe Ergebnis", () => {
    const fn = vi.fn(() => Math.random());
    const onceFn = once(fn);
    const first = onceFn();
    expect(onceFn()).toBe(first);
    expect(onceFn()).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("ruft fn nicht auf, bevor die Funktion benutzt wird", () => {
    const fn = vi.fn(() => 42);
    once(fn);
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it("funktioniert auch, wenn fn undefined zurückgibt", () => {
    const fn = vi.fn(() => undefined);
    const onceFn = once(fn);
    onceFn();
    onceFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("3.4 memoize", () => {
  it("liefert die richtigen Ergebnisse", () => {
    const square = memoize((n) => n * n);
    expect(square(4)).toBe(16);
    expect(square(5)).toBe(25);
    expect(square(4)).toBe(16);
  });

  it("ruft fn pro Argument nur einmal auf", () => {
    const slowSquare = vi.fn((n: number) => n * n);
    const fastSquare = memoize(slowSquare);
    fastSquare(3);
    fastSquare(3);
    fastSquare(3);
    fastSquare(4);
    expect(slowSquare).toHaveBeenCalledTimes(2);
  });

  it("speichert auch das Ergebnis 0 korrekt", () => {
    const fn = vi.fn((n: number) => n * 0);
    const memo = memoize(fn);
    expect(memo(7)).toBe(0);
    expect(memo(7)).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
