// Lektion 11 – Typen, Startdaten und Repository (vorgegeben)

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceInRappen: number;
};

export type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  /** Lokale Zeit im Format JJJJ-MM-TTTHH:MM, z. B. "2026-11-20T10:00" */
  start: string;
  end: string;
  /** Zeitpunkt der Buchung als ISO-String */
  createdAt: string;
};

export const SERVICES: readonly Service[] = [
  { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  { id: "s-beard", name: "Bart", durationMinutes: 15, priceInRappen: 2500 },
  { id: "s-combo", name: "Haarschnitt + Bart", durationMinutes: 45, priceInRappen: 6500 },
  { id: "s-color", name: "Färben", durationMinutes: 90, priceInRappen: 9000 },
];

/**
 * Speicherschicht. Im Kurs liegt alles im Arbeitsspeicher. In einer echten
 * Anwendung stünde hier eine Datenbank – der Rest der App bliebe gleich,
 * weil er nur dieses Interface kennt (Dependency Inversion).
 */
export interface BookingRepository {
  findAll(): Booking[];
  findById(id: string): Booking | undefined;
  add(booking: Booking): void;
  remove(id: string): boolean;
}

export class InMemoryBookingRepository implements BookingRepository {
  #bookings: Booking[] = [];

  constructor(initial: readonly Booking[] = []) {
    this.#bookings = [...initial];
  }

  findAll(): Booking[] {
    return [...this.#bookings];
  }

  findById(id: string): Booking | undefined {
    return this.#bookings.find((b) => b.id === id);
  }

  add(booking: Booking): void {
    this.#bookings.push(booking);
  }

  remove(id: string): boolean {
    const before = this.#bookings.length;
    this.#bookings = this.#bookings.filter((b) => b.id !== id);
    return this.#bookings.length < before;
  }
}

/**
 * Addiert Minuten zu einer lokalen Zeit "JJJJ-MM-TTTHH:MM".
 * addMinutes("2026-11-20T23:45", 30) → "2026-11-21T00:15"
 */
export function addMinutes(localDateTime: string, minutes: number): string {
  // Wir rechnen in UTC, damit Sommer-/Winterzeit nichts verschiebt
  const date = new Date(`${localDateTime}:00Z`);
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString().slice(0, 16);
}
