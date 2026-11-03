// Aufgabe 1 – Typen modellieren (wird vom COMPILER geprüft, nicht von Tests)
//
// Ersetze jedes `unknown` durch den passenden Typ.
// Fertig bist du, wenn diese Datei keine roten Markierungen mehr hat:
//   npx tsc --noEmit -p lektionen/l02-typsystem
//
// "Unused '@ts-expect-error' directive" heisst: Dein Typ ist zu locker.

// TODO 1.1: Eine Kleidergrösse – genau einer der Werte "S", "M", "L" oder "XL"
export type Size = unknown;

// TODO 1.2: Ein Punkt als Tupel aus genau zwei Zahlen: [x, y]
export type Point = unknown;

// TODO 1.3: Eine Adresse mit street, zip und city (alles Strings – Postleitzahlen
// können mit 0 beginnen!). country ist optional.
export type Address = unknown;

// TODO 1.4: Ein Kunde mit
//   - id: Zahl, darf nach dem Erstellen nicht mehr geändert werden
//   - name: String
//   - email: String, optional
//   - address: eine Address (verwende deinen Typ von oben!)
//   - tags: Liste von Strings
export type Customer = unknown;

// TODO 1.5: Eine Preisliste: beliebige Produktnamen → Preis in Rappen
export type PriceList = unknown;

// TODO 1.6: Ein Warenkorb-Eintrag: product (String), quantity (Zahl) und size,
// die entweder eine Size ist oder null (für Produkte ohne Grösse, z. B. Shampoo)
export type CartItem = unknown;

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – NICHT verändern. Zeilen ohne @ts-expect-error müssen kompilieren,
// Zeilen mit @ts-expect-error müssen einen Fehler erzeugen.
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

  // Damit IntelliJ nicht über unbenutzte Variablen meckert:
  console.log(size1, size2, size3, size4, point1, point2, point3, address3, address4);
  console.log(customer2, customer3, customer4, wrongPrices, item1, item2, item3, item4);
}
