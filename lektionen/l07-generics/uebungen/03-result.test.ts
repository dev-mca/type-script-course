import { describe, expect, it, vi } from "vitest";
import { type Result, all, andThen, err, fromThrowable, map, ok, unwrapOr } from "./03-result";

function parseNumber(text: string): Result<number> {
  const n = Number(text);
  return Number.isNaN(n) || text.trim() === "" ? err(`Keine Zahl: ${text}`) : ok(n);
}

function positive(n: number): Result<number> {
  return n > 0 ? ok(n) : err(`Nicht positiv: ${n}`);
}

describe("3.1 ok und 3.2 err", () => {
  it("erzeugen die beiden Varianten", () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
    expect(err("kaputt")).toEqual({ ok: false, error: "kaputt" });
    expect(err({ code: 404 })).toEqual({ ok: false, error: { code: 404 } });
  });
});

describe("3.3 map", () => {
  it("wandelt erfolgreiche Werte um", () => {
    expect(map(ok(2), (n) => n * 10)).toEqual(ok(20));
    expect(map(ok("hallo"), (s) => s.length)).toEqual(ok(5));
  });

  it("reicht Fehler durch, ohne fn aufzurufen", () => {
    const fn = vi.fn((n: number) => n * 10);
    const input: Result<number> = err("x");
    expect(map(input, fn)).toEqual(err("x"));
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("3.4 andThen", () => {
  it("verkettet fehleranfällige Schritte", () => {
    expect(andThen(parseNumber("42"), positive)).toEqual(ok(42));
    expect(andThen(parseNumber("-3"), positive)).toEqual(err("Nicht positiv: -3"));
    expect(andThen(parseNumber("abc"), positive)).toEqual(err("Keine Zahl: abc"));
  });

  it("ruft fn bei einem Fehler nicht auf", () => {
    const fn = vi.fn(positive);
    andThen(parseNumber("abc"), fn);
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("3.5 unwrapOr", () => {
  it("liefert den Wert oder den Ersatz", () => {
    expect(unwrapOr(parseNumber("7"), 0)).toBe(7);
    expect(unwrapOr(parseNumber("x"), 0)).toBe(0);
  });
});

describe("3.6 all", () => {
  it("sammelt alle Werte, wenn alles ok ist", () => {
    expect(all([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
    expect(all([])).toEqual(ok([]));
  });

  it("liefert den ersten Fehler", () => {
    expect(all([ok(1), err("a"), err("b")])).toEqual(err("a"));
  });

  it("lässt sich mit map kombinieren", () => {
    const inputs = ["1", "2", "3"];
    expect(all(inputs.map(parseNumber))).toEqual(ok([1, 2, 3]));
    expect(all(["1", "zwei"].map(parseNumber))).toEqual(err("Keine Zahl: zwei"));
  });
});

describe("3.7 fromThrowable", () => {
  it("verpackt Rückgabewerte", () => {
    expect(fromThrowable(() => JSON.parse("[1]"))).toEqual(ok([1]));
  });

  it("verpackt Exceptions", () => {
    const result = fromThrowable(() => JSON.parse("{"));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(SyntaxError);
    }
  });
});
