// Teil B – Schritt B3: Das Buchungsformular
//
// Ein «kontrolliertes» Formular: Die Werte stehen im State (form-Prop), und
// jede Eingabe meldet die Änderung über onChange nach oben. So hat React immer
// den aktuellen Stand – und der Reducer entscheidet, was passiert.
//
// Aufbau (siehe dom-app/index.html für die CSS-Klassen):
//   <form className="form" onSubmit={…}>
//     <label>Service <select value={form.serviceId} onChange={…}> … <option> pro Service</select></label>
//     <label>Name <input value={form.customerName} onChange={…} /></label>
//     <label>Uhrzeit <input type="time" step={900} value={form.time} onChange={…} /></label>
//     <button type="submit" disabled={…}>Buchen</button>     ← deaktiviert während "submitting"
//     {Meldung je nach submit.status}
//   </form>
//
// Meldungen:
//   success → <p className="success">✅ Termin gebucht</p>
//   error   → <div className="error"><p>{message}</p>{details als <p>}</div>
//
// Events:
//   onChange={(event) => onChange("customerName", event.target.value)}
//   onSubmit={(event) => { event.preventDefault(); onSubmit(); }}
// Fahre in IntelliJ über `event` – TypeScript kennt den genauen Typ
// (React.ChangeEvent<HTMLInputElement>) automatisch.

import type { Service } from "../../../../l11-backend/uebungen/daten";
import type { BookingForm, SubmitState } from "../../../uebungen/buchung-state";

type NewBookingFormProps = {
  services: Service[];
  form: BookingForm;
  submit: SubmitState;
  onChange: (field: keyof BookingForm, value: string) => void;
  onSubmit: () => void;
};

export function NewBookingForm({
  services,
  form,
  submit,
  onChange,
  onSubmit,
}: NewBookingFormProps) {
  // TODO: B3
  return <p className="muted">TODO: NewBookingForm</p>;
}
