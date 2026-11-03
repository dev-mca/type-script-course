// Ausführen: npx tsx lektionen/l07-generics/beispiele/01-keyof.ts
// Am meisten lernst du hier aber in IntelliJ: Fahre über die Variablen und
// probiere die Autovervollständigung in den Aufrufen aus.

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceInRappen: number;
  active: boolean;
};

const services: Service[] = [
  { id: "s1", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500, active: true },
  { id: "s2", name: "Bart", durationMinutes: 15, priceInRappen: 2500, active: true },
  { id: "s3", name: "Färben", durationMinutes: 90, priceInRappen: 9000, active: false },
];

// Eine Spalte aus einer Liste von Objekten holen – typsicher
function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const names = pluck(services, "name"); // string[]
const prices = pluck(services, "priceInRappen"); // number[]
const flags = pluck(services, "active"); // boolean[]
console.log(names, prices, flags);
// pluck(services, "color"); // ← entkommentieren: Fehler, "color" ist kein Schlüssel

// Nach beliebigem Feld sortieren
function sortBy<T, K extends keyof T>(items: readonly T[], key: K): T[] {
  return items.toSorted((a, b) => {
    const x = a[key];
    const y = b[key];
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

console.log(sortBy(services, "durationMinutes").map((s) => s.name));
console.log(sortBy(services, "name").map((s) => s.name));

// Ein Objekt nur mit bestimmten Feldern – auch der Rückgabetyp ist präzise
function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const preview = pick(services[0]!, ["name", "priceInRappen"]);
console.log(preview); // Typ: { name: string; priceInRappen: number }
// preview.id; // ← Fehler: id wurde nicht ausgewählt

// 🔧 Experiment: Schreib eine Funktion
//   countBy<T, K extends keyof T>(items: readonly T[], key: K): Map<T[K], number>
// und zähle damit, wie viele Services active bzw. inactive sind.
