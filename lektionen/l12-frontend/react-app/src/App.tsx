// Teil B: Die Buchungsseite mit React
//
// Starten: Terminal 1  npm run api
//          Terminal 2  npm run web:react  → http://localhost:5174
//
// Der gesamte Zustand liegt in EINEM Reducer (uebungen/buchung-state.ts, Aufgabe 3).
// Die Komponenten zeigen nur an und melden Ereignisse – die Logik ist getestet
// und steckt nicht in der Oberfläche.

import { useEffect, useReducer } from "react";
import { createApiClient } from "../../uebungen/api-client";
import { initialState, pageReducer } from "../../uebungen/buchung-state";
import { BookingList } from "./components/BookingList";
import { NewBookingForm } from "./components/NewBookingForm";
import { ServiceList } from "./components/ServiceList";

const api = createApiClient("/api");
const today = new Date().toISOString().slice(0, 10);

export function App() {
  // useReducer(reducer, Startwert, Init-Funktion) → initialState(today)
  const [state, dispatch] = useReducer(pageReducer, today, initialState);

  // Beispiel: Services EINMAL beim Start laden ([] = keine Abhängigkeiten)
  useEffect(() => {
    let cancelled = false; // verhindert Updates, nachdem die Komponente weg ist
    api
      .getServices()
      .then((services) => {
        if (!cancelled) dispatch({ type: "servicesLoaded", services });
      })
      .catch((error: unknown) => {
        if (!cancelled) dispatch({ type: "servicesFailed", message: String(error) });
      });
    return () => {
      cancelled = true; // «Aufräumfunktion»: läuft, bevor der Effekt erneut läuft oder die Komponente verschwindet
    };
  }, []);

  // TODO B1: Buchungen laden – und zwar jedes Mal, wenn sich state.date ändert.
  //          Genau wie oben, aber mit api.getBookings(state.date) und [state.date]
  //          als Abhängigkeit.

  // TODO B3: handleSubmit
  //   1. validateForm(state.form) – bei Fehlern dispatch submitFailed mit details und abbrechen
  //   2. dispatch submitStarted
  //   3. api.createBooking({ serviceId, customerName, start: `${state.date}T${state.form.time}` })
  //   4. Ergebnis ok → submitSucceeded, sonst submitFailed (message + details)
  //   5. Exception → submitFailed mit der Fehlermeldung
  async function handleSubmit(): Promise<void> {
    // TODO: B3
  }

  // TODO B4: handleDelete(id) – api.deleteBooking(id), danach bookingDeleted.
  //          Bei einem Fehler: alert(...) mit der Meldung.
  async function handleDelete(id: string): Promise<void> {
    // TODO: B4
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
