// Zum Anschauen in IntelliJ (fahre über die Typen) – und zum Ausführen:
//   npx tsx lektionen/l10-fortgeschrittene-typen/beispiele/01-eine-quelle-der-wahrheit.ts
//
// Idee: Die Daten existieren EINMAL (als Wert). Alle Typen werden davon abgeleitet.

const ROLES = ["admin", "barber", "customer"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "barber" | "customer"

const PERMISSIONS = {
  admin: ["services:write", "bookings:write", "bookings:read", "reports:read"],
  barber: ["bookings:read", "bookings:write"],
  customer: ["bookings:read"],
} as const satisfies Record<Role, readonly string[]>;
// as const: Werte wörtlich nehmen · satisfies: prüfen, dass jede Rolle vorkommt

type Permission = (typeof PERMISSIONS)[Role][number];
// "services:write" | "bookings:write" | "bookings:read" | "reports:read"

function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[role] as readonly Permission[]).includes(permission);
}

console.log("Barber darf Reports lesen?", can("barber", "reports:read"));
console.log("Admin darf Services ändern?", can("admin", "services:write"));
// can("barber", "reports:delete"); // ← entkommentieren: diese Berechtigung gibt es nicht

// Template Literal Types: alle «Ressourcen» aus den Berechtigungen ableiten
type Resource = Permission extends `${infer R}:${string}` ? R : never;
// "services" | "bookings" | "reports"

const resources: Resource[] = ["services", "bookings", "reports"];
console.log("Ressourcen:", resources);

// Utility Types auf einem Objekttyp
type Booking = { id: string; customer: string; start: string; status: "open" | "done" };
type NewBooking = Omit<Booking, "id" | "status">;
type BookingPatch = Partial<Pick<Booking, "start" | "status">>;

const draft: NewBooking = { customer: "Melih", start: "2026-11-20T10:00" };
const patch: BookingPatch = { status: "done" };
console.log({ draft, patch });

// 🔧 Experiment: Füge in PERMISSIONS die Rolle "trainee" hinzu.
// Was passiert? Und was passiert, wenn du sie stattdessen in ROLES hinzufügst?
