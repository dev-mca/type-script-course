// Ausführen: npx tsx lektionen/l01-erste-schritte/beispiele/03-truthy-falsy.ts

const values: unknown[] = [0, 1, -1, "", "0", "false", " ", null, undefined, NaN, [], {}, false];

function show(value: unknown): string {
  // Zahlen direkt ausgeben (JSON.stringify(NaN) wäre "null"), sonst als JSON
  if (typeof value === "number" || value === undefined) return String(value);
  return JSON.stringify(value);
}

for (const value of values) {
  // Boolean(x) zeigt, wie sich ein Wert in einem if verhalten würde
  console.log(show(value).padEnd(10), "→", Boolean(value) ? "truthy" : "falsy");
}

console.log("--- || vs ?? ---");

function withOr(count: number | undefined): number {
  return count || 10;
}

function withNullish(count: number | undefined): number {
  return count ?? 10;
}

console.log(withOr(undefined), withNullish(undefined)); // 10 10
console.log(withOr(5), withNullish(5)); // 5 5
console.log(withOr(0), withNullish(0)); // ?? Welche Variante ist korrekt, wenn 0 erlaubt ist?

console.log("--- Optional Chaining ---");
const user: { address?: { city?: string } } = {};
// In Java: NullPointerException-Gefahr. Hier: ?. bricht einfach ab und liefert undefined.
console.log(user.address?.city); // undefined
console.log(user.address?.city ?? "Stadt unbekannt");

// 🔧 Experiment: Entferne das ? in user.address?.city.
// Was sagt IntelliJ? Was passiert, wenn du es trotzdem ausführst?
