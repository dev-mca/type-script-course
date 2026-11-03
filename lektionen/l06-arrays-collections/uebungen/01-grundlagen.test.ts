import { describe, expect, it } from "vitest";
import {
  allHaveItems,
  averagePaidOrderValue,
  findOrder,
  hasRefunds,
  orderTotal,
  ordersOf,
  productNames,
  totalRevenue,
} from "./01-grundlagen";
import { ORDERS, type Order } from "./daten";

const ids = (orders: Order[]) => orders.map((o) => o.id);
const snapshot = JSON.stringify(ORDERS);

describe("1.1 orderTotal", () => {
  it("summiert Preis × Menge", () => {
    expect(orderTotal(findById("B-1001"))).toBe(5200);
    expect(orderTotal(findById("B-1005"))).toBe(8100);
  });

  it("liefert 0 für leere Bestellungen", () => {
    expect(orderTotal(findById("B-1008"))).toBe(0);
  });
});

describe("1.2 totalRevenue", () => {
  it("summiert nur bezahlte Bestellungen", () => {
    expect(totalRevenue(ORDERS)).toBe(24400);
    expect(totalRevenue([])).toBe(0);
  });
});

describe("1.3 ordersOf", () => {
  it("findet alle Bestellungen eines Kunden", () => {
    expect(ids(ordersOf(ORDERS, "Melih"))).toEqual(["B-1001", "B-1004"]);
    expect(ids(ordersOf(ORDERS, "Bob"))).toEqual(["B-1003", "B-1008"]);
    expect(ordersOf(ORDERS, "Niemand")).toEqual([]);
  });
});

describe("1.4 findOrder", () => {
  it("findet eine Bestellung", () => {
    expect(findOrder(ORDERS, "B-1005")?.customer).toBe("Chiara");
  });

  it("liefert undefined, wenn es sie nicht gibt", () => {
    expect(findOrder(ORDERS, "B-9999")).toBeUndefined();
  });
});

describe("1.5 hasRefunds und 1.6 allHaveItems", () => {
  it("prüft Bedingungen über alle Bestellungen", () => {
    expect(hasRefunds(ORDERS)).toBe(true);
    expect(hasRefunds(ORDERS.filter((o) => o.status === "paid"))).toBe(false);
    expect(allHaveItems(ORDERS)).toBe(false);
    expect(allHaveItems(ORDERS.slice(0, 7))).toBe(true);
  });
});

describe("1.7 productNames", () => {
  it("liefert alle Produktnamen flach", () => {
    expect(productNames(ORDERS)).toEqual([
      "Shampoo",
      "Bartöl",
      "Haarwachs",
      "Gesichtscreme",
      "Shampoo",
      "Bartbalsam",
      "Bartöl",
      "Shampoo",
      "Gesichtscreme",
      "Shampoo",
      "Bartöl",
    ]);
  });
});

describe("1.8 averagePaidOrderValue", () => {
  it("berechnet den Durchschnitt der bezahlten Bestellungen", () => {
    expect(averagePaidOrderValue(ORDERS)).toBe(4880);
  });

  it("liefert undefined ohne bezahlte Bestellungen", () => {
    expect(averagePaidOrderValue(ORDERS.filter((o) => o.status === "open"))).toBeUndefined();
  });
});

describe("Unveränderlichkeit", () => {
  it("hat die Eingabedaten nicht verändert", () => {
    expect(JSON.stringify(ORDERS)).toBe(snapshot);
  });
});

function findById(id: string): Order {
  const order = ORDERS.find((o) => o.id === id);
  if (!order) throw new Error(`Testdaten: ${id} fehlt`);
  return order;
}
