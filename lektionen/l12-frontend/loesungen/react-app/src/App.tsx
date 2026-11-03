// Lösung Teil B – Die Buchungsseite mit React
//
// Direkt starten: npx vite lektionen/l12-frontend/loesungen/react-app   (API: npm run api)

import { useEffect, useReducer } from "react";
import { createApiClient } from "../../api-client";
import { initialState, pageReducer, validateForm } from "../../buchung-state";
import { BookingList } from "./components/BookingList";
import { NewBookingForm } from "./components/NewBookingForm";
import { ServiceList } from "./components/ServiceList";

const api = createApiClient("/api");
const today = new Date().toISOString().slice(0, 10);

const messageOf = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function App() {
  const [state, dispatch] = useReducer(pageReducer, today, initialState);

  useEffect(() => {
    let cancelled = false;
    api
      .getServices()
      .then((services) => {
        if (!cancelled) dispatch({ type: "servicesLoaded", services });
      })
      .catch((error: unknown) => {
        if (!cancelled) dispatch({ type: "servicesFailed", message: messageOf(error) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // B1: bei jedem neuen Datum die Buchungen laden
  useEffect(() => {
    let cancelled = false;
    api
      .getBookings(state.date)
      .then((bookings) => {
        if (!cancelled) dispatch({ type: "bookingsLoaded", bookings });
      })
      .catch((error: unknown) => {
        if (!cancelled) dispatch({ type: "bookingsFailed", message: messageOf(error) });
      });
    return () => {
      // Wechselt das Datum schnell hintereinander, wird die Antwort der alten
      // Anfrage ignoriert – sonst könnte eine langsame alte Antwort die neue überschreiben.
      cancelled = true;
    };
  }, [state.date]);

  // B3
  async function handleSubmit(): Promise<void> {
    const errors = validateForm(state.form);
    if (errors.length > 0) {
      dispatch({ type: "submitFailed", message: "Bitte Eingaben prüfen", details: errors });
      return;
    }

    dispatch({ type: "submitStarted" });
    try {
      const result = await api.createBooking({
        serviceId: state.form.serviceId,
        customerName: state.form.customerName,
        start: `${state.date}T${state.form.time}`,
      });
      if (result.ok) {
        dispatch({ type: "submitSucceeded", booking: result.booking });
      } else {
        dispatch({ type: "submitFailed", message: result.message, details: result.details });
      }
    } catch (error) {
      dispatch({ type: "submitFailed", message: messageOf(error) });
    }
  }

  // B4
  async function handleDelete(id: string): Promise<void> {
    try {
      await api.deleteBooking(id);
      dispatch({ type: "bookingDeleted", id });
    } catch (error) {
      alert(`Löschen fehlgeschlagen: ${messageOf(error)}`);
    }
  }

  const services = state.services.status === "success" ? state.services.data : [];

  return (
    <main>
      <h1>
        ✂️ Termin buchen <small>React-Version</small>
      </h1>

      <section>
        <h2>Unsere Services</h2>
        <ServiceList services={state.services} />
      </section>

      <section>
        <h2>
          Termine am{" "}
          <input
            type="date"
            value={state.date}
            onChange={(event) => dispatch({ type: "dateChanged", date: event.target.value })}
          />
        </h2>
        <BookingList
          bookings={state.bookings}
          services={services}
          onDelete={(id) => void handleDelete(id)}
        />
      </section>

      <section>
        <h2>Neuer Termin</h2>
        <NewBookingForm
          services={services}
          form={state.form}
          submit={state.submit}
          onChange={(field, value) => dispatch({ type: "formChanged", field, value })}
          onSubmit={() => void handleSubmit()}
        />
      </section>
    </main>
  );
}
