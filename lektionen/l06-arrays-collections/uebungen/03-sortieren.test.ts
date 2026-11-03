import { describe, expect, it } from "vitest";
import { ORDERS, type Order } from "./daten";
import { rankPlayers, sortByDateDesc, sortNames, sortOrders } from "./03-sortieren";

const ids = (orders: Order[]) => orders.map((o) => o.id);
const snapshot = JSON.stringify(ORDERS);

describe("3.1 sortByDateDesc", () => {
  it("sortiert die neuesten Bestellungen nach vorne", () => {
    expect(ids(sortByDateDesc(ORDERS))).toEqual([
      "B-1008",
      "B-1007",
      "B-1006",
      "B-1005",
      "B-1004",
      "B-1003",
      "B-1002",
      "B-1001",
    ]);
  });

  it("verändert das Original nicht", () => {
    const copy = [...ORDERS];
    sortByDateDesc(copy);
    expect(ids(copy)[0]).toBe("B-1001");
  });
});

describe("3.2 sortNames", () => {
  it("sortiert nach deutschen Regeln", () => {
    expect(sortNames(["Zürich", "Ärzte", "Bern", "anna", "Aarau"])).toEqual([
      "Aarau",
      "anna",
      "Ärzte",
      "Bern",
      "Zürich",
    ]);
  });

  it("verändert das Original nicht", () => {
    const names = ["b", "a"];
    sortNames(names);
    expect(names).toEqual(["b", "a"]);
  });
});

describe("3.3 sortOrders", () => {
  it("sortiert nach Datum", () => {
    expect(ids(sortOrders(ORDERS, "date", "asc"))).toEqual([
      "B-1001",
      "B-1002",
      "B-1003",
      "B-1004",
      "B-1005",
      "B-1006",
      "B-1007",
      "B-1008",
    ]);
  });

  it("sortiert nach Kunde, bei Gleichstand nach id", () => {
    expect(ids(sortOrders(ORDERS, "customer", "asc"))).toEqual([
      "B-1002",
      "B-1006",
      "B-1003",
      "B-1008",
      "B-1005",
      "B-1007",
      "B-1001",
      "B-1004",
    ]);
  });

  it("sortiert nach Betrag absteigend, bei Gleichstand trotzdem id aufsteigend", () => {
    expect(ids(sortOrders(ORDERS, "total", "desc"))).toEqual([
      "B-1005",
      "B-1004",
      "B-1006",
      "B-1001",
      "B-1007",
      "B-1003",
      "B-1002",
      "B-1008",
    ]);
  });

  it("sortiert nach Kunde absteigend", () => {
    expect(ids(sortOrders(ORDERS, "customer", "desc"))).toEqual([
      "B-1001",
      "B-1004",
      "B-1007",
      "B-1005",
      "B-1003",
      "B-1008",
      "B-1002",
      "B-1006",
    ]);
  });
});

describe("3.4 rankPlayers", () => {
  it("vergibt olympische Ränge", () => {
    const players = [
      { name: "Anna", points: 50 },
      { name: "Bob", points: 80 },
      { name: "Chiara", points: 80 },
      { name: "Dario", points: 30 },
      { name: "Eva", points: 50 },
    ];
    expect(rankPlayers(players)).toEqual([
      { name: "Bob", points: 80, rank: 1 },
      { name: "Chiara", points: 80, rank: 1 },
      { name: "Anna", points: 50, rank: 3 },
      { name: "Eva", points: 50, rank: 3 },
      { name: "Dario", points: 30, rank: 5 },
    ]);
    expect(players[0]).toEqual({ name: "Anna", points: 50 }); // Original unverändert
  });

  it("funktioniert mit leerer Liste und ohne Gleichstände", () => {
    expect(rankPlayers([])).toEqual([]);
    expect(
      rankPlayers([
        { name: "A", points: 1 },
        { name: "B", points: 2 },
      ]),
    ).toEqual([
      { name: "B", points: 2, rank: 1 },
      { name: "A", points: 1, rank: 2 },
    ]);
  });
});

describe("Unveränderlichkeit", () => {
  it("hat die Eingabedaten nicht verändert", () => {
    expect(JSON.stringify(ORDERS)).toBe(snapshot);
  });
});
