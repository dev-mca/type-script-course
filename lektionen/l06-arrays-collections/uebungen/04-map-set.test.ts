import { describe, expect, it } from "vitest";
import { ORDERS } from "./daten";
import {
  customersWhoBoughtBoth,
  difference,
  intersection,
  topWords,
  uniqueProducts,
  wordFrequency,
} from "./04-map-set";

const TEXT = "Der Hund und der Fuchs und der Hase";

describe("4.1 uniqueProducts", () => {
  it("liefert jedes Produkt einmal, sortiert", () => {
    expect(uniqueProducts(ORDERS)).toEqual([
      "Bartbalsam",
      "Bartöl",
      "Gesichtscreme",
      "Haarwachs",
      "Shampoo",
    ]);
  });
});

describe("4.2 wordFrequency", () => {
  it("zählt Wörter in einer Map", () => {
    const result = wordFrequency(TEXT);
    expect(result).toBeInstanceOf(Map);
    expect([...result]).toEqual([
      ["der", 3],
      ["hund", 1],
      ["und", 2],
      ["fuchs", 1],
      ["hase", 1],
    ]);
  });

  it("ignoriert mehrfache Leerzeichen", () => {
    expect(wordFrequency("  a  a ").get("a")).toBe(2);
    expect(wordFrequency("").size).toBe(0);
  });
});

describe("4.3 topWords", () => {
  it("liefert die häufigsten Wörter", () => {
    expect(topWords(TEXT, 2)).toEqual([
      ["der", 3],
      ["und", 2],
    ]);
  });

  it("sortiert Gleichstände alphabetisch", () => {
    expect(topWords(TEXT, 4)).toEqual([
      ["der", 3],
      ["und", 2],
      ["fuchs", 1],
      ["hase", 1],
    ]);
  });
});

describe("4.4 intersection und 4.5 difference", () => {
  it("bildet die Schnittmenge", () => {
    expect(intersection(["a", "b", "c", "b"], ["b", "c", "d"])).toEqual(["b", "c"]);
    expect(intersection(["a"], [])).toEqual([]);
  });

  it("bildet die Differenz", () => {
    expect(difference(["a", "b", "c", "a"], ["b"])).toEqual(["a", "c"]);
    expect(difference([], ["x"])).toEqual([]);
  });

  it("funktioniert auch mit grossen Listen schnell", () => {
    const big = Array.from({ length: 50_000 }, (_, i) => `x${i}`);
    const start = performance.now();
    expect(intersection(big, big)).toHaveLength(50_000);
    expect(difference(big, big)).toHaveLength(0);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});

describe("4.6 customersWhoBoughtBoth", () => {
  it("findet Kunden mit beiden Produkten", () => {
    expect(customersWhoBoughtBoth(ORDERS, "Shampoo", "Bartöl")).toEqual(["Chiara", "Melih"]);
    expect(customersWhoBoughtBoth(ORDERS, "Shampoo", "Gesichtscreme")).toEqual(["Anna"]);
  });

  it("ignoriert rückerstattete Bestellungen", () => {
    // Bob hat Gesichtscreme nur in einer rückerstatteten Bestellung
    expect(customersWhoBoughtBoth(ORDERS, "Gesichtscreme", "Gesichtscreme")).toEqual(["Anna"]);
  });
});
