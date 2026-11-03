// Lösung Aufgabe 1 – Narrowing

export function formatCell(value: string | number | boolean | Date | null): string {
  if (value === null) return "–";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number") return value.toFixed(2);
  if (typeof value === "boolean") return value ? "ja" : "nein";
  // Hier bleibt nur noch Date übrig – TypeScript weiss das!
  return value.toISOString().slice(0, 10);
}

export function toNumericId(id: string | number): number {
  // Bei number ist Number(id) einfach id – wir können beide Fälle gleich behandeln
  const numeric = typeof id === "string" && id.trim() === "" ? NaN : Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    throw new Error(`Ungültige ID: ${id}`);
  }
  return numeric;
}

export type Circle = { radius: number };
export type Rect = { width: number; height: number };

export function areaOf(shape: Circle | Rect): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2; // shape: Circle
  }
  return shape.width * shape.height; // shape: Rect
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export type Admin = { role: "admin"; name: string; permissions: string[] };
export type Customer = { role: "customer"; name: string; loyaltyPoints: number };
export type Guest = { role: "guest" };
export type Visitor = Admin | Customer | Guest;

export function greetVisitor(visitor: Visitor): string {
  switch (visitor.role) {
    case "admin":
      return `Willkommen zurück, ${visitor.name} (${visitor.permissions.length} Berechtigungen)`;
    case "customer":
      return `Hallo ${visitor.name}, du hast ${visitor.loyaltyPoints} Treuepunkte`;
    case "guest":
      return "Hallo Gast!";
  }
}

export function onlyCustomers(visitors: Visitor[]): Customer[] {
  return visitors.filter((v): v is Customer => v.role === "customer");
  // Ab TS 5.5 reicht auch: visitors.filter((v) => v.role === "customer")
  // («Inferred Type Predicates»)
}
