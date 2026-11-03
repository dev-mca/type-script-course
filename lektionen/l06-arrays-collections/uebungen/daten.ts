// Beispieldaten für die Aufgaben dieser Lektion.
// Ein kleiner Online-Shop für Pflegeprodukte. Alle Preise in Rappen.
//
// Diese Datei NICHT verändern – die Tests rechnen mit genau diesen Daten.

export type Category = "Haar" | "Bart" | "Haut";
export type OrderStatus = "paid" | "open" | "refunded";

export type OrderItem = {
  product: string;
  category: Category;
  priceInRappen: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer: string;
  date: string; // JJJJ-MM-TT
  status: OrderStatus;
  items: OrderItem[];
};

export const ORDERS: readonly Order[] = [
  {
    id: "B-1001",
    customer: "Melih",
    date: "2026-09-02",
    status: "paid",
    items: [
      { product: "Shampoo", category: "Haar", priceInRappen: 1500, quantity: 2 },
      { product: "Bartöl", category: "Bart", priceInRappen: 2200, quantity: 1 },
    ],
  },
  {
    id: "B-1002",
    customer: "Anna",
    date: "2026-09-15",
    status: "paid",
    items: [{ product: "Haarwachs", category: "Haar", priceInRappen: 1800, quantity: 1 }],
  },
  {
    id: "B-1003",
    customer: "Bob",
    date: "2026-09-28",
    status: "refunded",
    items: [{ product: "Gesichtscreme", category: "Haut", priceInRappen: 3500, quantity: 1 }],
  },
  {
    id: "B-1004",
    customer: "Melih",
    date: "2026-10-05",
    status: "paid",
    items: [
      { product: "Shampoo", category: "Haar", priceInRappen: 1500, quantity: 1 },
      { product: "Bartbalsam", category: "Bart", priceInRappen: 2500, quantity: 2 },
    ],
  },
  {
    id: "B-1005",
    customer: "Chiara",
    date: "2026-10-11",
    status: "open",
    items: [
      { product: "Bartöl", category: "Bart", priceInRappen: 2200, quantity: 3 },
      { product: "Shampoo", category: "Haar", priceInRappen: 1500, quantity: 1 },
    ],
  },
  {
    id: "B-1006",
    customer: "Anna",
    date: "2026-10-20",
    status: "paid",
    items: [
      { product: "Gesichtscreme", category: "Haut", priceInRappen: 3500, quantity: 1 },
      { product: "Shampoo", category: "Haar", priceInRappen: 1500, quantity: 2 },
    ],
  },
  {
    id: "B-1007",
    customer: "Dario",
    date: "2026-11-01",
    status: "paid",
    items: [{ product: "Bartöl", category: "Bart", priceInRappen: 2200, quantity: 2 }],
  },
  {
    id: "B-1008",
    customer: "Bob",
    date: "2026-11-02",
    status: "open",
    items: [],
  },
];
