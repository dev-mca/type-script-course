// Projekt B – Gemeinsame Typen (vorgegeben, darfst du erweitern)

export type Service = {
  id: string;
  name: string;
  priceInRappen: number;
  durationMinutes: number;
};

export const BOOKING_STATUSES = ["erledigt", "storniert", "nicht-erschienen"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Eine gültige, geprüfte Buchung – egal, ob sie aus CSV oder JSON stammt */
export type Booking = {
  id: string;
  date: string; // JJJJ-MM-TT, garantiert ein echtes Datum
  time: string; // HH:MM
  barber: string;
  serviceId: string; // garantiert ein bekannter Service
  customer: string;
  status: BookingStatus;
};

/** Ein Problem mit einem einzelnen Eintrag in einer Datei */
export type ParseError = {
  /** Dateiname ohne Pfad, z. B. "buchungen-2026-09.csv" */
  source: string;
  /** CSV: Zeilennummer in der Datei (Kopfzeile = 1). JSON: Position im Array (erster Eintrag = 1). */
  line: number;
  message: string;
};

export type ParseResult = {
  bookings: Booking[];
  errors: ParseError[];
};

export type Report = {
  /** Erstes und letztes Datum aller gültigen Buchungen (null, wenn es keine gibt) */
  period: { from: string; to: string } | null;
  totals: {
    bookings: number;
    completed: number;
    cancelled: number;
    noShows: number;
  };
  /** noShows / (completed + noShows), auf 3 Nachkommastellen gerundet; 0, wenn der Nenner 0 ist */
  noShowRate: number;
  /** Umsatz aller ERLEDIGTEN Buchungen */
  revenueInRappen: number;
  /** aufsteigend nach Monat ("JJJJ-MM"), nur Monate mit Buchungen */
  revenueByMonth: { month: string; revenueInRappen: number }[];
  /** absteigend nach Umsatz, bei Gleichstand nach Name */
  revenueByBarber: { barber: string; revenueInRappen: number }[];
  /** die 3 häufigsten Services (erledigte Buchungen), absteigend nach Anzahl, bei Gleichstand nach Name */
  topServices: { serviceId: string; name: string; count: number; revenueInRappen: number }[];
  /** Wochentag mit den meisten erledigten Buchungen (deutscher Name, z. B. "Samstag") */
  busiestWeekday: { weekday: string; count: number } | null;
  /** Kunden mit mindestens 2 erledigten Buchungen, alphabetisch */
  returningCustomers: string[];
};
