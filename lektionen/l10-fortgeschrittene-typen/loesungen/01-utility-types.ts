// Lösung Aufgabe 1 – Utility Types

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export const STATUSES = ["requested", "confirmed", "done", "cancelled"] as const;

export type Booking = {
  id: string;
  customerName: string;
  serviceId: string;
  start: string;
  durationMinutes: number;
  status: (typeof STATUSES)[number];
  note?: string;
  createdAt: string;
};

export type BookingStatus = (typeof STATUSES)[number];
// oder: Booking["status"]

export type NewBooking = Omit<Booking, "id" | "status" | "createdAt">;

export type BookingUpdate = Partial<
  Pick<Booking, "customerName" | "start" | "durationMinutes" | "note">
>;

export type BookingListItem = Pick<Booking, "id" | "customerName" | "start" | "status">;

export type FrozenBooking = Readonly<Booking>;

export type StatusCounts = Record<BookingStatus, number>;

export type ActiveStatus = Exclude<BookingStatus, "done" | "cancelled">;

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

export type FetchBookingArgs = Parameters<typeof fetchBooking>;

export type FetchedBooking = Awaited<ReturnType<typeof fetchBooking>>;

// ─────────────────────────────────────────────────────────────────────────────
// Prüfungen – identisch zur Aufgabe
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
  update.note = "geht";

  const counts: StatusCounts = { requested: 1, confirmed: 2, done: 3, cancelled: 0 };
  // @ts-expect-error – es fehlen Status
  const incomplete: StatusCounts = { requested: 1 };
  console.log(counts, incomplete);
}
