// Lektion 12 – Aufgabe 3: Der Zustand der Buchungsseite als Reducer
// Tests: npm run test:watch -- l12-frontend/uebungen/buchung-state
//
// In React kann man Zustand mit useState verwalten – bei komplexeren Seiten
// ist ein «Reducer» übersichtlicher: eine reine Funktion
//     (alterZustand, aktion) => neuerZustand
// Alle Änderungen laufen über klar benannte Aktionen (eine Discriminated Union!).
// Das ist leicht zu testen und zu verstehen – und genau so funktionieren
// React's useReducer und Bibliotheken wie Redux.
//
// Regel: Den alten Zustand NIE verändern, immer einen neuen zurückgeben (Lektion 4).

import type { Booking, Service } from "../../l11-backend/uebungen/daten";

/** Ladezustand – kennst du aus Lektion 5 */
export type Remote<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export type BookingForm = {
  serviceId: string;
  customerName: string;
  time: string; // "HH:MM"
};

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; bookingId: string }
  | { status: "error"; message: string; details: string[] };

export type PageState = {
  date: string; // JJJJ-MM-TT
  services: Remote<Service[]>;
  bookings: Remote<Booking[]>;
  form: BookingForm;
  submit: SubmitState;
};

export type PageAction =
  | { type: "servicesLoaded"; services: Service[] }
  | { type: "servicesFailed"; message: string }
  | { type: "dateChanged"; date: string }
  | { type: "bookingsLoaded"; bookings: Booking[] }
  | { type: "bookingsFailed"; message: string }
  | { type: "formChanged"; field: keyof BookingForm; value: string }
  | { type: "submitStarted" }
  | { type: "submitSucceeded"; booking: Booking }
  | { type: "submitFailed"; message: string; details?: string[] }
  | { type: "bookingDeleted"; id: string };

/** 3.1 Der Startzustand für ein Datum: alles lädt, Formular leer, submit idle */
export function initialState(date: string): PageState {
  throw new Error("TODO: Aufgabe 3.1");
}

/**
 * 3.2 Der Reducer. Regeln:
 *
 * servicesLoaded   → services: success. Ist im Formular noch kein Service gewählt,
 *                    wird der ERSTE Service vorausgewählt.
 * servicesFailed   → services: error
 * dateChanged      → neues Datum; bookings wieder "loading"; submit zurück auf idle
 * bookingsLoaded   → bookings: success (nach start sortiert)
 * bookingsFailed   → bookings: error
 * formChanged      → das eine Feld im Formular ändern; ein vorheriger Erfolg/Fehler
 *                    (submit) wird auf idle zurückgesetzt
 * submitStarted    → submit: submitting
 * submitSucceeded  → submit: success mit der ID; die Buchung wird in die Liste
 *                    eingefügt (sortiert), aber NUR, wenn bookings gerade "success" ist
 *                    UND die Buchung am angezeigten Datum liegt; Name und Uhrzeit im
 *                    Formular werden geleert (der Service bleibt gewählt)
 * submitFailed     → submit: error (details: [] wenn nicht angegeben)
 * bookingDeleted   → Buchung aus der Liste entfernen (wenn bookings "success" ist)
 */
export function pageReducer(state: PageState, action: PageAction): PageState {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Prüft das Formular im Browser, BEVOR es abgeschickt wird.
 * Liefert eine Liste von Fehlermeldungen (leer = alles gut):
 *   kein Service gewählt       → "Bitte einen Service wählen"
 *   Name (getrimmt) < 2 Zeichen → "Bitte einen Namen angeben"
 *   time nicht im Format HH:MM  → "Bitte eine Uhrzeit wählen"
 *
 * Wichtig: Diese Prüfung ist nur Komfort für den Benutzer. Der Server prüft
 * trotzdem selbst – dem Browser darf man nie vertrauen!
 */
export function validateForm(form: BookingForm): string[] {
  throw new Error("TODO: Aufgabe 3.3");
}
