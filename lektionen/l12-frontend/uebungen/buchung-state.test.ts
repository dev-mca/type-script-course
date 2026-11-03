import { describe, expect, it } from "vitest";
import type { Booking, Service } from "../../l11-backend/uebungen/daten";
import { type PageState, initialState, pageReducer, validateForm } from "./buchung-state";

const DATE = "2026-11-20";
const SERVICES: Service[] = [
  { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  { id: "s-beard", name: "Bart", durationMinutes: 15, priceInRappen: 2500 },
];
const booking = (id: string, start: string): Booking => ({
  id,
  serviceId: "s-cut",
  customerName: "Test",
  start,
  end: start,
  createdAt: "2026-11-01T00:00:00.000Z",
});

/** Hilfsfunktion: mehrere Aktionen hintereinander anwenden */
function apply(state: PageState, ...actions: Parameters<typeof pageReducer>[1][]): PageState {
  return actions.reduce(pageReducer, state);
}

describe("3.1 initialState", () => {
  it("startet mit Laden und leerem Formular", () => {
    expect(initialState(DATE)).toEqual({
      date: DATE,
      services: { status: "loading" },
      bookings: { status: "loading" },
      form: { serviceId: "", customerName: "", time: "" },
      submit: { status: "idle" },
    });
  });
});

describe("3.2 pageReducer", () => {
  it("übernimmt Services und wählt den ersten vor", () => {
    const state = apply(initialState(DATE), { type: "servicesLoaded", services: SERVICES });
    expect(state.services).toEqual({ status: "success", data: SERVICES });
    expect(state.form.serviceId).toBe("s-cut");
  });

  it("überschreibt eine bestehende Service-Auswahl nicht", () => {
    const state = apply(
      initialState(DATE),
      { type: "formChanged", field: "serviceId", value: "s-beard" },
      { type: "servicesLoaded", services: SERVICES },
    );
    expect(state.form.serviceId).toBe("s-beard");
  });

  it("speichert Ladefehler", () => {
    const state = apply(
      initialState(DATE),
      { type: "servicesFailed", message: "offline" },
      { type: "bookingsFailed", message: "auch offline" },
    );
    expect(state.services).toEqual({ status: "error", message: "offline" });
    expect(state.bookings).toEqual({ status: "error", message: "auch offline" });
  });

  it("sortiert geladene Buchungen", () => {
    const state = apply(initialState(DATE), {
      type: "bookingsLoaded",
      bookings: [booking("b", `${DATE}T14:00`), booking("a", `${DATE}T09:00`)],
    });
    expect(state.bookings.status === "success" && state.bookings.data.map((b) => b.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("lädt bei einem neuen Datum neu und setzt submit zurück", () => {
    const state = apply(
      initialState(DATE),
      { type: "bookingsLoaded", bookings: [] },
      { type: "submitFailed", message: "x" },
      { type: "dateChanged", date: "2026-11-21" },
    );
    expect(state.date).toBe("2026-11-21");
    expect(state.bookings).toEqual({ status: "loading" });
    expect(state.submit).toEqual({ status: "idle" });
  });

  it("ändert einzelne Formularfelder und setzt submit zurück", () => {
    const state = apply(
      initialState(DATE),
      { type: "submitFailed", message: "Name fehlt", details: ["customerName: zu kurz"] },
      { type: "formChanged", field: "customerName", value: "Melih" },
    );
    expect(state.form).toEqual({ serviceId: "", customerName: "Melih", time: "" });
    expect(state.submit).toEqual({ status: "idle" });
  });

  it("durchläuft den Ablauf einer erfolgreichen Buchung", () => {
    const created = booking("b-new", `${DATE}T11:00`);
    const state = apply(
      initialState(DATE),
      { type: "servicesLoaded", services: SERVICES },
      {
        type: "bookingsLoaded",
        bookings: [booking("a", `${DATE}T09:00`), booking("c", `${DATE}T15:00`)],
      },
      { type: "formChanged", field: "customerName", value: "Melih" },
      { type: "formChanged", field: "time", value: "11:00" },
      { type: "submitStarted" },
    );
    expect(state.submit).toEqual({ status: "submitting" });

    const done = pageReducer(state, { type: "submitSucceeded", booking: created });
    expect(done.submit).toEqual({ status: "success", bookingId: "b-new" });
    expect(done.bookings.status === "success" && done.bookings.data.map((b) => b.id)).toEqual([
      "a",
      "b-new",
      "c",
    ]);
    expect(done.form).toEqual({ serviceId: "s-cut", customerName: "", time: "" });
  });

  it("fügt Buchungen an einem anderen Tag nicht in die Liste ein", () => {
    const state = apply(
      initialState(DATE),
      { type: "bookingsLoaded", bookings: [] },
      { type: "submitSucceeded", booking: booking("x", "2026-11-21T10:00") },
    );
    expect(state.bookings).toEqual({ status: "success", data: [] });
  });

  it("speichert Fehler beim Buchen", () => {
    const state = apply(initialState(DATE), { type: "submitFailed", message: "Belegt" });
    expect(state.submit).toEqual({ status: "error", message: "Belegt", details: [] });
  });

  it("entfernt gelöschte Buchungen", () => {
    const state = apply(
      initialState(DATE),
      {
        type: "bookingsLoaded",
        bookings: [booking("a", `${DATE}T09:00`), booking("b", `${DATE}T10:00`)],
      },
      { type: "bookingDeleted", id: "a" },
    );
    expect(state.bookings.status === "success" && state.bookings.data.map((b) => b.id)).toEqual([
      "b",
    ]);
  });

  it("verändert den alten Zustand nie", () => {
    const before = apply(initialState(DATE), {
      type: "bookingsLoaded",
      bookings: [booking("a", `${DATE}T09:00`)],
    });
    const snapshot = structuredClone(before);
    pageReducer(before, { type: "bookingDeleted", id: "a" });
    pageReducer(before, { type: "formChanged", field: "time", value: "10:00" });
    pageReducer(before, { type: "submitSucceeded", booking: booking("z", `${DATE}T08:00`) });
    expect(before).toEqual(snapshot);
  });
});

describe("3.3 validateForm", () => {
  it("akzeptiert ein vollständiges Formular", () => {
    expect(validateForm({ serviceId: "s-cut", customerName: "Melih", time: "10:00" })).toEqual([]);
  });

  it("meldet alle Probleme", () => {
    expect(validateForm({ serviceId: "", customerName: " M ", time: "" })).toEqual([
      "Bitte einen Service wählen",
      "Bitte einen Namen angeben",
      "Bitte eine Uhrzeit wählen",
    ]);
    expect(validateForm({ serviceId: "s-cut", customerName: "Melih", time: "10" })).toEqual([
      "Bitte eine Uhrzeit wählen",
    ]);
  });
});
