// Lösung B2 – Die Liste der Buchungen

import type { Booking, Service } from "../../../../../l11-backend/uebungen/daten";
import type { Remote } from "../../../buchung-state";
import { formatTime } from "../../../formatierung";

type BookingListProps = {
  bookings: Remote<Booking[]>;
  services: Service[];
  onDelete: (id: string) => void;
};

export function BookingList({ bookings, services, onDelete }: BookingListProps) {
  if (bookings.status === "loading") {
    return <p className="muted">Lade Termine …</p>;
  }
  if (bookings.status === "error") {
    return <p className="error">Termine konnten nicht geladen werden: {bookings.message}</p>;
  }
  if (bookings.data.length === 0) {
    return <p className="muted">Noch keine Termine</p>;
  }

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  return (
    <ul className="list">
      {bookings.data.map((booking) => (
        <li key={booking.id}>
          <span className="time">
            {formatTime(booking.start)}–{formatTime(booking.end)}
          </span>
          <span className="grow">
            {booking.customerName} · {serviceName(booking.serviceId)}
          </span>
          <button
            type="button"
            className="link"
            onClick={() => {
              if (confirm("Termin wirklich löschen?")) onDelete(booking.id);
            }}
          >
            Löschen
          </button>
        </li>
      ))}
    </ul>
  );
}
