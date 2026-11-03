import { describe, expect, it, vi } from "vitest";
import { TtlCache } from "./04-ttl-cache";

/** Eine künstliche Uhr, die wir im Test von Hand vorstellen */
function createFakeClock(start = 1_000) {
  let time = start;
  return {
    now: () => time,
    advance: (ms: number) => {
      time += ms;
    },
  };
}

describe("4 TtlCache", () => {
  it("speichert und liefert Werte", () => {
    const clock = createFakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("a", 1);
    expect(cache.get("a")).toBe(1);
    expect(cache.has("a")).toBe(true);
    expect(cache.get("b")).toBeUndefined();
    expect(cache.has("b")).toBe(false);
  });

  it("lässt Einträge nach der TTL ablaufen", () => {
    const clock = createFakeClock();
    const cache = new TtlCache<string, string>({ ttlMs: 1000, now: clock.now });
    cache.set("token", "abc");
    clock.advance(999);
    expect(cache.get("token")).toBe("abc");
    clock.advance(1); // jetzt genau abgelaufen
    expect(cache.get("token")).toBeUndefined();
    expect(cache.has("token")).toBe(false);
  });

  it("setzt beim Überschreiben die Ablaufzeit neu", () => {
    const clock = createFakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    cache.set("a", 1);
    clock.advance(800);
    cache.set("a", 2);
    clock.advance(800);
    expect(cache.get("a")).toBe(2);
  });

  it("zählt nur gültige Einträge", () => {
    const clock = createFakeClock();
    const cache = new TtlCache<number, string>({ ttlMs: 100, now: clock.now });
    cache.set(1, "eins");
    clock.advance(50);
    cache.set(2, "zwei");
    expect(cache.size).toBe(2);
    clock.advance(60); // 1 ist abgelaufen, 2 noch nicht
    expect(cache.size).toBe(1);
  });

  it("kann Einträge löschen", () => {
    const cache = new TtlCache<string, number>({ ttlMs: 1000 });
    cache.set("a", 1);
    expect(cache.delete("a")).toBe(true);
    expect(cache.delete("a")).toBe(false);
    expect(cache.get("a")).toBeUndefined();
  });

  it("berechnet fehlende Werte mit getOrCompute nur einmal", () => {
    const clock = createFakeClock();
    const cache = new TtlCache<string, number>({ ttlMs: 1000, now: clock.now });
    const compute = vi.fn(() => 42);
    expect(cache.getOrCompute("answer", compute)).toBe(42);
    expect(cache.getOrCompute("answer", compute)).toBe(42);
    expect(compute).toHaveBeenCalledTimes(1);
    clock.advance(1000);
    expect(cache.getOrCompute("answer", compute)).toBe(42);
    expect(compute).toHaveBeenCalledTimes(2); // abgelaufen → neu berechnet
  });

  it("speichert auch falsy Werte korrekt", () => {
    const cache = new TtlCache<string, number | null>({ ttlMs: 1000 });
    const compute = vi.fn(() => 0);
    cache.getOrCompute("zero", compute);
    cache.getOrCompute("zero", compute);
    expect(compute).toHaveBeenCalledTimes(1);
    cache.set("nothing", null);
    expect(cache.has("nothing")).toBe(true);
  });

  it("funktioniert mit Objekten als Schlüssel (per Referenz)", () => {
    const cache = new TtlCache<object, string>({ ttlMs: 1000 });
    const key = { id: 1 };
    cache.set(key, "gefunden");
    expect(cache.get(key)).toBe("gefunden");
    expect(cache.get({ id: 1 })).toBeUndefined(); // anderes Objekt!
  });

  it("verlangt eine positive TTL", () => {
    expect(() => new TtlCache({ ttlMs: 0 })).toThrow();
  });
});
