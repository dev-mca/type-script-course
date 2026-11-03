// Lösung Aufgabe 1 – Typen modellieren

export type Size = "S" | "M" | "L" | "XL";

export type Point = [number, number];
// Mit Labels (gleicher Typ, bessere Lesbarkeit in IntelliJ):
// export type Point = [x: number, y: number];

export type Address = {
  street: string;
  zip: string;
  city: string;
  country?: string;
};

export type Customer = {
  readonly id: number;
  name: string;
  email?: string;
  address: Address;
  tags: string[];
};

export type PriceList = Record<string, number>;
// Alternative mit Index-Signatur: { [product: string]: number }

export type CartItem = {
  product: string;
  quantity: number;
  size: Size | null; // muss vorhanden sein, darf aber null sein (≠ size?: Size)
};

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – identisch zur Aufgabe
// ─────────────────────────────────────────────────────────────────────────────

export function checks(): void {
  const size1: Size = "M";
  const size2: Size = "XL";
  // @ts-expect-error – "XXL" ist keine gültige Grösse
  const size3: Size = "XXL";
  // @ts-expect-error – Kleinbuchstaben sind nicht erlaubt
  const size4: Size = "m";

  const point1: Point = [3, 4];
  // @ts-expect-error – drei Werte sind zu viel
  const point2: Point = [1, 2, 3];
  // @ts-expect-error – Strings sind keine Koordinaten
  const point3: Point = ["1", "2"];

  const address1: Address = { street: "Bahnhofstrasse 1", zip: "5000", city: "Aarau" };
  const address2: Address = { street: "Seestrasse 3", zip: "8001", city: "Zürich", country: "CH" };
  // @ts-expect-error – zip muss ein String sein
  const address3: Address = { street: "Rathausgasse 2", zip: 5000, city: "Aarau" };
  // @ts-expect-error – city fehlt
  const address4: Address = { street: "Rathausgasse 2", zip: "5000" };

  const customer1: Customer = { id: 1, name: "Melih", address: address1, tags: ["vip"] };
  const customer2: Customer = {
    id: 2,
    name: "Anna",
    email: "anna@example.ch",
    address: address2,
    tags: [],
  };
  // @ts-expect-error – id darf nicht geändert werden
  customer1.id = 99;
  customer1.name = "Melih Can"; // name darf geändert werden
  // @ts-expect-error – tags fehlt
  const customer3: Customer = { id: 3, name: "Bob", address: address1 };
  // @ts-expect-error – address muss eine vollständige Address sein
  const customer4: Customer = { id: 4, name: "Eva", address: { city: "Baden" }, tags: [] };

  const prices: PriceList = { Haarschnitt: 4500, Bart: 2500 };
  prices["Färben"] = 8000;
  // @ts-expect-error – Preise sind Zahlen
  const wrongPrices: PriceList = { Haarschnitt: "45.00" };

  const item1: CartItem = { product: "T-Shirt", quantity: 2, size: "L" };
  const item2: CartItem = { product: "Shampoo", quantity: 1, size: null };
  // @ts-expect-error – size muss angegeben werden (auch wenn es null ist)
  const item3: CartItem = { product: "Shampoo", quantity: 1 };
  // @ts-expect-error – "XXL" ist keine Size
  const item4: CartItem = { product: "Hoodie", quantity: 1, size: "XXL" };

  console.log(size1, size2, size3, size4, point1, point2, point3, address3, address4);
  console.log(customer2, customer3, customer4, wrongPrices, item1, item2, item3, item4);
}
