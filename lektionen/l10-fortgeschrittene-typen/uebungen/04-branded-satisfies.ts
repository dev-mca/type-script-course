// Aufgabe 4 – Branded Types und satisfies
// Tests: npm run test:watch -- l10-fortgeschrittene-typen/uebungen/04
// Typen: npx tsc --noEmit -p lektionen/l10-fortgeschrittene-typen

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

/** Hilfstyp: «markiert» einen Basistyp mit einem Namen */
type Brand<T, Name extends string> = T & { readonly __brand: Name };

// ─── Teil A: Branded Types ───────────────────────────────────────────────────

/** Ein Geldbetrag in Rappen – garantiert ganzzahlig und ≥ 0 */
export type Rappen = Brand<number, "Rappen">;

/** Eine geprüfte, normalisierte E-Mail-Adresse (klein geschrieben, ohne Leerzeichen am Rand) */
export type Email = Brand<string, "Email">;

/**
 * 4.1 Prüft einen Betrag: ganze Zahl ≥ 0, sonst Error.
 * Dies ist (neben addRappen) der einzige Ort, an dem `as Rappen` stehen darf.
 */
export function toRappen(value: number): Rappen {
  throw new Error("TODO: Aufgabe 4.1");
}

/** 4.2 Addiert zwei Beträge. Das Ergebnis ist wieder ein gültiger Rappen-Betrag. */
export function addRappen(a: Rappen, b: Rappen): Rappen {
  throw new Error("TODO: Aufgabe 4.2");
}

/**
 * 4.3 Prüft und normalisiert eine E-Mail-Adresse:
 *   " Melih@Example.CH " → "melih@example.ch"
 * Gültig ist: etwas ohne Leerzeichen, ein @, etwas ohne Leerzeichen, ein Punkt, etwas.
 * Regulärer Ausdruck dafür: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * Ungültig → Error
 */
export function parseEmail(input: string): Email {
  throw new Error("TODO: Aufgabe 4.3");
}

/** Diese Funktion akzeptiert nur geprüfte Adressen – fertig, nicht verändern. */
export function welcomeMessage(email: Email): string {
  return `Willkommen! Wir haben eine Bestätigung an ${email} geschickt.`;
}

// ─── Teil B: satisfies ───────────────────────────────────────────────────────

export type ServiceDefinition = {
  label: string;
  durationMinutes: 15 | 30 | 45 | 60 | 90;
  priceInRappen: number;
};

// TODO 4.4: Ersetze die Typ-Annotation durch `satisfies`, sodass
//   - jeder Eintrag weiterhin geprüft wird (falsche Dauer → Fehler)
//   - ServiceKey genau die Schlüssel "haircut" | "beard" | "color" enthält
export const SERVICES: Record<string, ServiceDefinition> = {
  haircut: { label: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  beard: { label: "Bart", durationMinutes: 15, priceInRappen: 2500 },
  color: { label: "Färben", durationMinutes: 90, priceInRappen: 9000 },
};

export type ServiceKey = keyof typeof SERVICES;

/**
 * 4.5 Gesamtpreis mehrerer Services als Rappen-Betrag.
 * totalPrice(["haircut", "beard"]) → 7000
 * Verwende toRappen und addRappen.
 */
export function totalPrice(keys: readonly ServiceKey[]): Rappen {
  throw new Error("TODO: Aufgabe 4.5");
}

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – NICHT verändern
// ─────────────────────────────────────────────────────────────────────────────

export type Checks = [Expect<Equal<ServiceKey, "haircut" | "beard" | "color">>];

export function checks(): void {
  // @ts-expect-error – normale Zahlen sind keine Rappen
  addRappen(100, 200);
  // @ts-expect-error – normale Strings sind keine Email
  welcomeMessage("melih@example.ch");
  // @ts-expect-error – "massage" ist kein Service
  totalPrice(["haircut", "massage"]);

  const price: number = toRappen(500); // Rappen ist trotzdem eine Zahl – das geht
  console.log(price, welcomeMessage(parseEmail("a@b.ch")));
}
