// Beispiel-Komponente (vorgegeben) – schau sie dir genau an, bevor du die anderen baust.

import type { Service } from "../../../../l11-backend/uebungen/daten";
import type { Remote } from "../../../uebungen/buchung-state";
import { formatChf, formatDuration } from "../../../uebungen/formatierung";

// Props sind einfach ein Objekt-Typ. Kein Interface, keine Klasse nötig.
type ServiceListProps = {
  services: Remote<Service[]>;
};

// Eine Komponente ist eine Funktion: Props rein, JSX raus.
export function ServiceList({ services }: ServiceListProps) {
  // Die Discriminated Union aus Lektion 5 in Aktion:
  if (services.status === "loading") {
    return <p className="muted">Lade Services …</p>;
  }
  if (services.status === "error") {
    return <p className="error">Services konnten nicht geladen werden: {services.message}</p>;
  }

  return (
    <ul className="cards">
      {services.data.map((service) => (
        // key: React braucht pro Listeneintrag einen eindeutigen, stabilen Schlüssel
        <li key={service.id}>
          <strong>{service.name}</strong>
          <span className="muted">
            {formatDuration(service.durationMinutes)} · {formatChf(service.priceInRappen)}
          </span>
        </li>
      ))}
    </ul>
  );
}
