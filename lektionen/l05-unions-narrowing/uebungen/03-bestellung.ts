// Aufgabe 3 – Eine Zustandsmaschine mit Discriminated Unions
// Tests: npm run test:watch -- l05-unions-narrowing/uebungen/03
//
// Eine Bestellung in einem Online-Shop durchläuft diese Zustände:
//
//   draft ──submit──▶ submitted ──ship──▶ shipped
//     │                  │
//     └──cancel──▶ cancelled ◀──cancel──┘
//
// Jeder Zustand hat genau die Felder, die in diesem Zustand Sinn ergeben.
// Eine versandte Bestellung OHNE Trackingnummer ist so gar nicht darstellbar.

export type Item = { product: string; quantity: number; priceInRappen: number };

export type DraftOrder = { status: "draft"; id: string; items: Item[] };
export type SubmittedOrder = {
  status: "submitted";
  id: string;
  items: Item[];
  submittedAt: string;
};
export type ShippedOrder = {
  status: "shipped";
  id: string;
  items: Item[];
  submittedAt: string;
  trackingNumber: string;
};
export type CancelledOrder = { status: "cancelled"; id: string; reason: string };

export type Order = DraftOrder | SubmittedOrder | ShippedOrder | CancelledOrder;

/** Ergebnis einer Operation, die fehlschlagen kann (siehe README Abschnitt 6) */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * 3.1 Schickt eine Bestellung ab.
 * - Nur aus "draft" möglich, sonst Fehler: `Bestellung ${id} kann nicht abgeschickt werden (Status: ${status})`
 * - Mindestens ein Artikel nötig, sonst Fehler: "Bestellung ist leer"
 * - Ergebnis: SubmittedOrder mit submittedAt = now
 *
 * Die Eingabe darf NICHT verändert werden.
 */
export function submit(order: Order, now: string): Result<SubmittedOrder> {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * 3.2 Versendet eine Bestellung.
 * - Nur aus "submitted" möglich
 * - trackingNumber darf nicht leer sein
 */
export function ship(order: Order, trackingNumber: string): Result<ShippedOrder> {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Storniert eine Bestellung.
 * - Möglich aus "draft" und "submitted"
 * - Bereits versendete oder stornierte Bestellungen → Fehler
 * - Ergebnis enthält nur noch status, id und reason (Artikel fallen weg)
 */
export function cancel(order: Order, reason: string): Result<CancelledOrder> {
  throw new Error("TODO: Aufgabe 3.3");
}

/**
 * 3.4 Gesamtbetrag in Rappen. Stornierte Bestellungen haben den Betrag 0.
 */
export function orderTotal(order: Order): number {
  throw new Error("TODO: Aufgabe 3.4");
}

/**
 * 3.5 Kurzer Statustext für die Übersicht:
 *   draft     → "Entwurf (2 Artikel)"        (Anzahl Positionen, nicht Stückzahl)
 *   submitted → "Bestellt am 2026-11-03"     (die ersten 10 Zeichen von submittedAt)
 *   shipped   → "Versendet (Tracking: CH123)"
 *   cancelled → "Storniert: Kunde hat es sich anders überlegt"
 */
export function statusLabel(order: Order): string {
  throw new Error("TODO: Aufgabe 3.5");
}
