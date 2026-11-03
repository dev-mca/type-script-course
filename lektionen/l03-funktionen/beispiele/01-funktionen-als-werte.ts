// Ausführen: npx tsx lektionen/l03-funktionen/beispiele/01-funktionen-als-werte.ts

// Ein Funktionstyp – das Pendant zu einem funktionalen Interface in Java
type Discount = (priceInRappen: number) => number;

// Funktionen in Variablen speichern
const noDiscount: Discount = (price) => price;
const studentDiscount: Discount = (price) => Math.round(price * 0.8);
const fixedDiscount: Discount = (price) => Math.max(0, price - 500);

// Funktionen in einem Objekt sammeln (eine Art «Strategy Pattern» ohne Klassen)
const discounts: Record<string, Discount> = {
  keiner: noDiscount,
  student: studentDiscount,
  gutschein: fixedDiscount,
};

for (const name in discounts) {
  const apply = discounts[name];
  if (apply) {
    console.log(`${name.padEnd(10)} → ${apply(4500)} Rappen`);
  }
}

// Eine Funktion, die eine Funktion zurückgibt
function percentOff(percent: number): Discount {
  return (price) => Math.round(price * (1 - percent / 100));
}

const blackFriday = percentOff(30);
console.log("Black Friday:", blackFriday(4500));

// Funktionen kombinieren: erst Gutschein, dann 10 %
function combine(first: Discount, second: Discount): Discount {
  return (price) => second(first(price));
}

const both = combine(fixedDiscount, percentOff(10));
console.log("Kombiniert:", both(4500)); // (4500 - 500) * 0.9 = 3600

// Callbacks an eingebaute Funktionen übergeben
const prices = [4500, 2500, 8000];
console.log(prices.map(studentDiscount)); // eine benannte Funktion direkt übergeben
console.log(prices.filter((p) => p > 3000)); // Arrow Function inline

// 🔧 Experiment 1: Schreib eine Funktion `cap(maxPrice: number): Discount`,
// die den Preis nach oben begrenzt, und kombiniere sie mit blackFriday.
//
// 🔧 Experiment 2: Ändere den Typ von studentDiscount auf `(p: string) => number`.
// Was meldet IntelliJ – und wo genau?
