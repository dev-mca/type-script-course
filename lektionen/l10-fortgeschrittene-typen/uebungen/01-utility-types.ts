// Aufgabe 1 – Utility Types (wird vom COMPILER geprüft)
//
// Leite alle Typen von `Booking` ab – NICHT von Hand abschreiben!
// Wenn sich Booking später ändert, sollen sich alle Typen automatisch anpassen.
//
// Fertig, wenn keine roten Markierungen mehr da sind:
//   npx tsc --noEmit -p lektionen/l10-fortgeschrittene-typen

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export const STATUSES = ["requested", "confirmed", "done", "cancelled"] as const;

export type Booking = {
  id: string;
  customerName: string;
  serviceId: string;
  start: string; // ISO-Datum
  durationMinutes: number;
  status: (typeof STATUSES)[number];
  note?: string;
  createdAt: string;
};

// TODO 1.1: Alle möglichen Status als Union – aus STATUSES herleiten
export type BookingStatus = unknown;

// TODO 1.2: Was der Client beim Erstellen schickt: alles ausser id, status und createdAt
export type NewBooking = unknown;

// TODO 1.3: Was der Client bei einer Änderung schicken darf: customerName, start,
// durationMinutes und note – jedes davon optional
export type BookingUpdate = unknown;

// TODO 1.4: Eine Zeile in der Übersichtsliste: nur id, customerName, start und status
export type BookingListItem = unknown;

// TODO 1.5: Eine Buchung, die nicht mehr verändert werden darf (alle Felder readonly)
export type FrozenBooking = unknown;

// TODO 1.6: Anzahl Buchungen pro Status – ALLE Status als Pflicht-Schlüssel
export type StatusCounts = unknown;

// TODO 1.7: Die «aktiven» Status: alle ausser "done" und "cancelled"
export type ActiveStatus = unknown;

// Eine Funktion, deren Typen wir unten weiterverwenden
export async function fetchBooking(id: string, includeNotes: boolean): Promise<Booking> {
  return {
    id,
    customerName: "Test",
    serviceId: "s1",
    start: "2026-11-20T10:00",
    durationMinutes: 30,
    status: "requested",
    note: includeNotes ? "Notiz" : undefined,
    createdAt: "2026-11-01T08:00",
  };
}

// TODO 1.8: Die Parametertypen von fetchBooking als Tupel – aus der Funktion herleiten
export type FetchBookingArgs = unknown;

// TODO 1.9: Was fetchBooking NACH dem await liefert – aus der Funktion herleiten
//           (Tipp: ReturnType und Awaited kombinieren)
export type FetchedBooking = unknown;

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – NICHT verändern
// ─────────────────────────────────────────────────────────────────────────────

export type Checks = [
  Expect<Equal<BookingStatus, "requested" | "confirmed" | "done" | "cancelled">>,
  Expect<Equal<NewBooking, Omit<Booking, "id" | "status" | "createdAt">>>,
  Expect<
    Equal<
      BookingUpdate,
      { customerName?: string; start?: string; durationMinutes?: number; note?: string }
    >
  >,
  Expect<Equal<keyof BookingListItem, "id" | "customerName" | "start" | "status">>,
  Expect<Equal<StatusCounts, Record<BookingStatus, number>>>,
  Expect<Equal<ActiveStatus, "requested" | "confirmed">>,
  Expect<Equal<FetchBookingArgs, [id: string, includeNotes: boolean]>>,
  Expect<Equal<FetchedBooking, Booking>>,
];

export function checks(frozen: FrozenBooking, update: BookingUpdate): void {
  // @ts-expect-error – FrozenBooking ist readonly
  frozen.status = "done";
  update.note = "geht"; // BookingUpdate darf verändert werden

  const counts: StatusCounts = { requested: 1, confirmed: 2, done: 3, cancelled: 0 };
  // @ts-expect-error – es fehlen Status
  const incomplete: StatusCounts = { requested: 1 };
  console.log(counts, incomplete);
}
