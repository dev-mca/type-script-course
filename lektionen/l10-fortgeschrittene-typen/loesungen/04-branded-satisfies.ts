// Lösung Aufgabe 4 – Branded Types und satisfies

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type Rappen = Brand<number, "Rappen">;
export type Email = Brand<string, "Email">;

export function toRappen(value: number): Rappen {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Ungültiger Rappen-Betrag: ${value}`);
  }
  return value as Rappen;
}

export function addRappen(a: Rappen, b: Rappen): Rappen {
  // Die Summe zweier nicht-negativer Ganzzahlen ist wieder eine – der Cast ist sicher.
  return (a + b) as Rappen;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEmail(input: string): Email {
  const normalized = input.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    throw new Error(`Ungültige E-Mail-Adresse: "${input}"`);
  }
  return normalized as Email;
}

export function welcomeMessage(email: Email): string {
  return `Willkommen! Wir haben eine Bestätigung an ${email} geschickt.`;
}

export type ServiceDefinition = {
  label: string;
  durationMinutes: 15 | 30 | 45 | 60 | 90;
  priceInRappen: number;
};

export const SERVICES = {
  haircut: { label: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  beard: { label: "Bart", durationMinutes: 15, priceInRappen: 2500 },
  color: { label: "Färben", durationMinutes: 90, priceInRappen: 9000 },
} satisfies Record<string, ServiceDefinition>;

export type ServiceKey = keyof typeof SERVICES;

export function totalPrice(keys: readonly ServiceKey[]): Rappen {
  return keys.reduce(
    (sum, key) => addRappen(sum, toRappen(SERVICES[key].priceInRappen)),
    toRappen(0),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – identisch zur Aufgabe
// ─────────────────────────────────────────────────────────────────────────────

export type Checks = [Expect<Equal<ServiceKey, "haircut" | "beard" | "color">>];

export function checks(): void {
  // @ts-expect-error – normale Zahlen sind keine Rappen
  addRappen(100, 200);
  // @ts-expect-error – normale Strings sind keine Email
  welcomeMessage("melih@example.ch");
  // @ts-expect-error – "massage" ist kein Service
  totalPrice(["haircut", "massage"]);

  const price: number = toRappen(500);
  console.log(price, welcomeMessage(parseEmail("a@b.ch")));
}
