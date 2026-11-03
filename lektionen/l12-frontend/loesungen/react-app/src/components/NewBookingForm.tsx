// Lösung B3 – Das Buchungsformular

import type { Service } from "../../../../../l11-backend/uebungen/daten";
import type { BookingForm, SubmitState } from "../../../buchung-state";

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
  return (
    <form
      className="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label>
        Service
        <select
          value={form.serviceId}
          onChange={(event) => onChange("serviceId", event.target.value)}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Name
        <input
          value={form.customerName}
          autoComplete="name"
          onChange={(event) => onChange("customerName", event.target.value)}
        />
      </label>

      <label>
        Uhrzeit
        <input
          type="time"
          step={900}
          value={form.time}
          onChange={(event) => onChange("time", event.target.value)}
        />
      </label>

      <button type="submit" disabled={submit.status === "submitting"}>
        {submit.status === "submitting" ? "Wird gebucht …" : "Buchen"}
      </button>

      <SubmitMessage submit={submit} />
    </form>
  );
}

/** Kleine Hilfskomponente – auch Komponenten dürfen in einer Datei «privat» sein */
function SubmitMessage({ submit }: { submit: SubmitState }) {
  switch (submit.status) {
    case "idle":
    case "submitting":
      return null; // null = nichts anzeigen
    case "success":
      return <p className="success">✅ Termin gebucht</p>;
    case "error":
      return (
        <div className="error" role="alert">
          <p>{submit.message}</p>
          {submit.details.map((detail) => (
            <p key={detail} className="muted">
              {detail}
            </p>
          ))}
        </div>
      );
  }
}
