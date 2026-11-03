import { describe, expect, it } from "vitest";
import { applyTwice, between, compose, countWhere, pipe, times } from "./02-higher-order";

const plusOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

describe("2.1 applyTwice", () => {
  it("wendet die Funktion zweimal an", () => {
    expect(applyTwice((n) => n + 3, 10)).toBe(16);
    expect(applyTwice(double, 5)).toBe(20);
  });
});

describe("2.2 compose", () => {
  it("wendet zuerst g, dann f an", () => {
    expect(compose(double, plusOne)(5)).toBe(12);
    expect(compose(plusOne, double)(5)).toBe(11);
  });

  it("liefert eine Funktion", () => {
    expect(typeof compose(double, plusOne)).toBe("function");
  });
});

describe("2.3 pipe", () => {
  it("wendet die Funktionen von links nach rechts an", () => {
    expect(pipe(plusOne, double, square)(2)).toBe(36);
    expect(pipe(square, double, plusOne)(2)).toBe(9);
  });

  it("funktioniert mit einer einzigen Funktion", () => {
    expect(pipe(double)(21)).toBe(42);
  });

  it("gibt ohne Funktionen den Wert unverändert zurück", () => {
    expect(pipe()(7)).toBe(7);
  });
});

describe("2.4 times", () => {
  it("sammelt die Ergebnisse", () => {
    expect(times(3, (i) => `Zeile ${i}`)).toEqual(["Zeile 0", "Zeile 1", "Zeile 2"]);
  });

  it("liefert bei 0 ein leeres Array", () => {
    expect(times(0, () => "x")).toEqual([]);
  });
});

describe("2.5 between", () => {
  it("prüft den Bereich inklusive Grenzen", () => {
    const isValidAge = between(0, 150);
    expect(isValidAge(42)).toBe(true);
    expect(isValidAge(0)).toBe(true);
    expect(isValidAge(150)).toBe(true);
    expect(isValidAge(151)).toBe(false);
    expect(isValidAge(-1)).toBe(false);
  });
});

describe("2.6 countWhere", () => {
  it("zählt passende Zahlen", () => {
    expect(countWhere([1, 5, 10, 15], between(4, 11))).toBe(2);
    expect(countWhere([1, 2, 3, 4], (n) => n % 2 === 0)).toBe(2);
    expect(countWhere([], () => true)).toBe(0);
  });
});
