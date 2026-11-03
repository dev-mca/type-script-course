// Teil B – Schritt B2: Die Liste der Buchungen
//
// Orientiere dich an ServiceList.tsx.
//
// Anzeige:
//   loading → <p className="muted">Lade Termine …</p>
//   error   → <p className="error">…</p>
//   leer    → <p className="muted">Noch keine Termine</p>
//   sonst   → <ul className="list"> mit einem <li key={booking.id}> pro Buchung:
//               <span className="time">10:00–10:30</span>
//               <span className="grow">Melih · Haarschnitt</span>
//               <button type="button" className="link" onClick={…}>Löschen</button>
//
// Den Service-Namen findest du über die services-Prop.
// Beim Klick auf «Löschen»: onDelete(booking.id) aufrufen.
// (Bonus: vorher mit confirm("Termin wirklich löschen?") nachfragen.)

import type { Booking, Service } from "../../../../l11-backend/uebungen/daten";
import type { Remote } from "../../../uebungen/buchung-state";

type BookingListProps = {
  bookings: Remote<Booking[]>;
  services: Service[];
  onDelete: (id: string) => void;
};

export function BookingList({ bookings, services, onDelete }: BookingListProps) {
  // TODO: B2
  return <p className="muted">TODO: BookingList ({bookings.status})</p>;
}
