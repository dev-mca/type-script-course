import { describe, expect, it } from "vitest";
import { chunk, groupBy, last, maxBy, pluck, uniqueBy } from "./01-funktionen";

// Diese Zuweisungen kompilieren nur, wenn deine Signaturen generisch sind.
// Solange sie rot sind, stimmt die Signatur noch nicht.
const typeChecks = () => {
  const n: number | undefined = last([1, 2, 3]);
  const chunks: string[][] = chunk(["a", "b"], 1);
  const groups: Partial<Record<"even" | "odd", number[]>> = groupBy([1, 2], (x) =>
    x % 2 === 0 ? "even" : "odd",
  );
  const names: string[] = pluck([{ name: "A", age: 1 }], "name");
  const ages: number[] = pluck([{ name: "A", age: 1 }], "age");
  // @ts-expect-error – "email" ist kein Schlüssel
  pluck([{ name: "A" }], "email");
  const best: string | undefined = maxBy(["a"], (s) => s.length);
  const unique: { id: number }[] = uniqueBy([{ id: 1 }], (u) => u.id);
  return [n, chunks, groups, names, ages, best, unique];
};

describe("1.1 last", () => {
  it("liefert das letzte Element", () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(last(["a"])).toBe("a");
    expect(last([])).toBeUndefined();
  });
});

describe("1.2 chunk", () => {
  it("teilt in Stücke", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    expect(chunk([], 2)).toEqual([]);
  });

  it("wirft bei ungültiger Grösse", () => {
    expect(() => chunk([1], 0)).toThrow();
  });
});

describe("1.3 groupBy", () => {
  it("gruppiert nach Schlüssel", () => {
    expect(groupBy(["Anna", "Ali", "Bob"], (s) => s[0] ?? "")).toEqual({
      A: ["Anna", "Ali"],
      B: ["Bob"],
    });
  });

  it("funktioniert mit leerer Liste", () => {
    expect(groupBy([], () => "x")).toEqual({});
  });
});

describe("1.4 pluck", () => {
  it("holt ein Feld aus jedem Objekt", () => {
    const users = [
      { name: "Melih", age: 25 },
      { name: "Anna", age: 31 },
    ];
    expect(pluck(users, "name")).toEqual(["Melih", "Anna"]);
    expect(pluck(users, "age")).toEqual([25, 31]);
  });
});

describe("1.5 maxBy", () => {
  it("findet das Element mit der höchsten Bewertung", () => {
    expect(maxBy(["ab", "abcd", "abc"], (s) => s.length)).toBe("abcd");
    expect(maxBy([{ p: 3 }, { p: 7 }, { p: 5 }], (x) => x.p)).toEqual({ p: 7 });
  });

  it("nimmt bei Gleichstand das erste", () => {
    expect(maxBy(["xx", "yy"], (s) => s.length)).toBe("xx");
  });

  it("liefert undefined bei leerer Liste", () => {
    expect(maxBy([], () => 1)).toBeUndefined();
  });

  it("funktioniert auch mit negativen Bewertungen", () => {
    expect(maxBy([-5, -2, -9], (n) => n)).toBe(-2);
  });
});

describe("1.6 uniqueBy", () => {
  it("entfernt Duplikate anhand des Schlüssels", () => {
    const users = [
      { email: "a@x.ch", name: "Anna" },
      { email: "b@x.ch", name: "Bob" },
      { email: "a@x.ch", name: "Anna (doppelt)" },
    ];
    expect(uniqueBy(users, (u) => u.email)).toEqual([
      { email: "a@x.ch", name: "Anna" },
      { email: "b@x.ch", name: "Bob" },
    ]);
  });

  it("vergleicht Schlüssel mit === (Zahlen und Strings sind verschieden)", () => {
    expect(uniqueBy([1, "1", 1], (x) => x)).toEqual([1, "1"]);
  });
});

describe("Typen", () => {
  it("die Typprüfungen oben existieren (der Compiler prüft sie)", () => {
    expect(typeof typeChecks).toBe("function");
  });
});
