// Projekt A – Gemeinsame Typen (vorgegeben, darfst du erweitern)

/** Uhrzeit im Format "HH:MM", z. B. "09:30" */
export type Time = string;

/** Datum im Format "JJJJ-MM-TT", z. B. "2026-11-20" */
export type DateString = string;

export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  priceInRappen: number;
};

export type Barber = {
  id: string;
  name: string;
  /** Arbeitsbeginn, z. B. "09:00" */
  start: Time;
  /** Arbeitsende, z. B. "18:00" – ein Termin darf genau bis hierhin dauern */
  end: Time;
};

export type Appointment = {
  id: string;
  barberId: string;
  serviceId: string;
  customerName: string;
  date: DateString;
  start: Time;
  end: Time;
};

/** Was ein Kunde für eine Buchung angibt */
export type BookingRequest = {
  barberId: string;
  serviceId: string;
  customerName: string;
  date: DateString;
  start: Time;
};

/** Alle Gründe, warum eine Buchung abgelehnt werden kann */
export type BookingError =
  | { type: "invalid-time" }
  | { type: "unknown-service" }
  | { type: "unknown-barber" }
  | { type: "outside-working-hours" }
  | { type: "overlap"; conflictingAppointmentId: string };

/** Ergebnis einer Operation, die fehlschlagen kann (kennst du aus Lektion 5 und 7) */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
