// Projekt A – Meilensteine 2 bis 5: Die Salon-Klasse
//
// Die öffentliche Schnittstelle (Methoden-Signaturen) ist vorgegeben, weil die
// Abnahmetests sie verwenden. WIE du es intern umsetzt, entscheidest du:
// private Felder, Hilfsfunktionen, eigene Module – alles erlaubt.

import type {
  Appointment,
  Barber,
  BookingError,
  BookingRequest,
  DateString,
  Result,
  Service,
  Time,
} from "./typen";

export class Salon {
  constructor(services: readonly Service[], barbers: readonly Barber[]) {
    // TODO: Projekt A
  }

  /**
   * Bucht einen Termin. Prüfreihenfolge (die erste verletzte Regel gewinnt):
   *   1. start ist keine gültige Zeit          → { type: "invalid-time" }
   *   2. Service existiert nicht                → { type: "unknown-service" }
   *   3. Barber existiert nicht                 → { type: "unknown-barber" }
   *   4. Termin liegt nicht ganz in der Arbeitszeit → { type: "outside-working-hours" }
   *   5. Überschneidung mit einem Termin desselben Barbers am selben Tag
   *      → { type: "overlap", conflictingAppointmentId }
   *
   * Erfolgreiche Termine bekommen fortlaufende IDs "T-1", "T-2", … (pro Salon).
   * Zwei Termine überschneiden sich, wenn a.start < b.end UND b.start < a.end.
   * (Ein Termin, der um 10:30 endet, und einer, der um 10:30 beginnt, sind okay.)
   */
  book(request: BookingRequest): Result<Appointment, BookingError> {
    throw new Error("TODO: Projekt A – book");
  }

  /** Storniert einen Termin. true, wenn es ihn gab. */
  cancel(appointmentId: string): boolean {
    throw new Error("TODO: Projekt A – cancel");
  }

  /** Alle Termine eines Barbers an einem Tag, nach Startzeit sortiert. */
  appointmentsFor(barberId: string, date: DateString): Appointment[] {
    throw new Error("TODO: Projekt A – appointmentsFor");
  }

  /**
   * Alle möglichen Startzeiten für einen Service bei einem Barber an einem Tag.
   * Kandidaten: ab Arbeitsbeginn in Schritten von stepMinutes; der Termin muss
   * vor Arbeitsende fertig sein und darf sich mit keinem bestehenden überschneiden.
   * Unbekannter Barber oder Service → Error werfen.
   */
  freeSlots(barberId: string, date: DateString, serviceId: string, stepMinutes = 15): Time[] {
    throw new Error("TODO: Projekt A – freeSlots");
  }

  /** Summe der Service-Preise aller Termine an einem Tag (in Rappen). */
  dailyRevenue(date: DateString): number {
    throw new Error("TODO: Projekt A – dailyRevenue");
  }

  /**
   * Tagesplan als Text. Barber in der Reihenfolge des Konstruktors,
   * Termine nach Startzeit. Genaues Format (Gedankenstrich – zwischen den Zeiten):
   *
   *   Tagesplan 2026-11-20
   *   Anna
   *     09:00–09:30 Haarschnitt (Melih)
   *     10:00–10:15 Bart (Chiara)
   *   Bob
   *     (keine Termine)
   *   Umsatz: CHF 70.00
   *
   * Zeilen mit "\n" verbunden, kein Zeilenumbruch am Ende.
   */
  daySummary(date: DateString): string {
    throw new Error("TODO: Projekt A – daySummary");
  }
}
