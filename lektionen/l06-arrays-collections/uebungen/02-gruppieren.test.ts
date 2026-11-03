import { describe, expect, it } from "vitest";
import {
  countByStatus,
  monthlyRevenue,
  orderIdsByCustomer,
  revenueByCategory,
  topProducts,
} from "./02-gruppieren";
import { ORDERS } from "./daten";

const snapshot = JSON.stringify(ORDERS);

describe("2.1 countByStatus", () => {
  it("zählt die Bestellungen pro Status", () => {
    expect(countByStatus(ORDERS)).toEqual({ paid: 5, open: 2, refunded: 1 });
  });

  it("enthält alle Status auch bei 0", () => {
    expect(countByStatus([])).toEqual({ paid: 0, open: 0, refunded: 0 });
  });
});

describe("2.2 revenueByCategory", () => {
  it("summiert den Umsatz pro Kategorie", () => {
    expect(revenueByCategory(ORDERS)).toEqual({ Haar: 9300, Bart: 11600, Haut: 3500 });
  });

  it("enthält alle Kategorien auch bei 0", () => {
    expect(revenueByCategory([])).toEqual({ Haar: 0, Bart: 0, Haut: 0 });
  });
});

describe("2.3 orderIdsByCustomer", () => {
  it("gruppiert die IDs pro Kunde", () => {
    const result = orderIdsByCustomer(ORDERS);
    expect(result).toBeInstanceOf(Map);
    expect([...result.keys()]).toEqual(["Melih", "Anna", "Bob", "Chiara", "Dario"]);
    expect(result.get("Melih")).toEqual(["B-1001", "B-1004"]);
    expect(result.get("Bob")).toEqual(["B-1003", "B-1008"]);
    expect(result.get("Dario")).toEqual(["B-1007"]);
  });
});

describe("2.4 topProducts", () => {
  it("liefert die meistverkauften Produkte", () => {
    expect(topProducts(ORDERS, 3)).toEqual([
      { product: "Shampoo", quantity: 5 },
      { product: "Bartöl", quantity: 3 },
      { product: "Bartbalsam", quantity: 2 },
    ]);
  });

  it("sortiert Gleichstände alphabetisch", () => {
    expect(topProducts(ORDERS, 10)).toEqual([
      { product: "Shampoo", quantity: 5 },
      { product: "Bartöl", quantity: 3 },
      { product: "Bartbalsam", quantity: 2 },
      { product: "Gesichtscreme", quantity: 1 },
      { product: "Haarwachs", quantity: 1 },
    ]);
  });

  it("liefert bei n = 0 ein leeres Array", () => {
    expect(topProducts(ORDERS, 0)).toEqual([]);
  });
});

describe("2.5 monthlyRevenue", () => {
  it("summiert den Umsatz pro Monat", () => {
    expect(monthlyRevenue(ORDERS)).toEqual([
      { month: "2026-09", revenue: 7000 },
      { month: "2026-10", revenue: 13000 },
      { month: "2026-11", revenue: 4400 },
    ]);
  });

  it("sortiert nach Monat, auch wenn die Eingabe unsortiert ist", () => {
    const shuffled = [...ORDERS].reverse();
    expect(monthlyRevenue(shuffled).map((m) => m.month)).toEqual(["2026-09", "2026-10", "2026-11"]);
  });
});

describe("Unveränderlichkeit", () => {
  it("hat die Eingabedaten nicht verändert", () => {
    expect(JSON.stringify(ORDERS)).toBe(snapshot);
  });
});
