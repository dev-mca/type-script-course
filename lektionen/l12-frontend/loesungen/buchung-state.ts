// Lösung Aufgabe 3 – Der Zustand der Buchungsseite als Reducer

import type { Booking, Service } from "../../l11-backend/uebungen/daten";

export type Remote<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export type BookingForm = {
  serviceId: string;
  customerName: string;
  time: string;
};

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; bookingId: string }
  | { status: "error"; message: string; details: string[] };

export type PageState = {
  date: string;
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

export function initialState(date: string): PageState {
  return {
    date,
    services: { status: "loading" },
    bookings: { status: "loading" },
    form: { serviceId: "", customerName: "", time: "" },
    submit: { status: "idle" },
  };
}

const byStart = (a: Booking, b: Booking) => a.start.localeCompare(b.start);

/** Wendet fn auf die Daten an – aber nur, wenn sie erfolgreich geladen sind */
function mapSuccess<T>(remote: Remote<T>, fn: (data: T) => T): Remote<T> {
  return remote.status === "success" ? { status: "success", data: fn(remote.data) } : remote;
}

export function pageReducer(state: PageState, action: PageAction): PageState {
  switch (action.type) {
    case "servicesLoaded":
      return {
        ...state,
        services: { status: "success", data: action.services },
        form: {
          ...state.form,
          serviceId: state.form.serviceId || (action.services[0]?.id ?? ""),
        },
      };

    case "servicesFailed":
      return { ...state, services: { status: "error", message: action.message } };

    case "dateChanged":
      return {
        ...state,
        date: action.date,
        bookings: { status: "loading" },
        submit: { status: "idle" },
      };

    case "bookingsLoaded":
      return { ...state, bookings: { status: "success", data: action.bookings.toSorted(byStart) } };

    case "bookingsFailed":
      return { ...state, bookings: { status: "error", message: action.message } };

    case "formChanged":
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        submit: { status: "idle" },
      };

    case "submitStarted":
      return { ...state, submit: { status: "submitting" } };

    case "submitSucceeded": {
      const isSameDay = action.booking.start.startsWith(`${state.date}T`);
      return {
        ...state,
        submit: { status: "success", bookingId: action.booking.id },
        bookings: isSameDay
          ? mapSuccess(state.bookings, (list) => [...list, action.booking].toSorted(byStart))
          : state.bookings,
        form: { ...state.form, customerName: "", time: "" },
      };
    }

    case "submitFailed":
      return {
        ...state,
        submit: { status: "error", message: action.message, details: action.details ?? [] },
      };

    case "bookingDeleted":
      return {
        ...state,
        bookings: mapSuccess(state.bookings, (list) => list.filter((b) => b.id !== action.id)),
      };
  }
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateForm(form: BookingForm): string[] {
  const errors: string[] = [];
  if (form.serviceId === "") errors.push("Bitte einen Service wählen");
  if (form.customerName.trim().length < 2) errors.push("Bitte einen Namen angeben");
  if (!TIME.test(form.time)) errors.push("Bitte eine Uhrzeit wählen");
  return errors;
}
