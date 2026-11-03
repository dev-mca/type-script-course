// Projekt A – Demo-Programm (vorgegeben). Ausführen mit: npm run projekt-a
//
// Funktioniert, sobald deine Salon-Klasse fertig ist.

import { BARBERS, DEMO_DATE, DEMO_REQUESTS, SERVICES } from "./demo-daten";
import { Salon } from "./salon";
import type { BookingError } from "./typen";

function describeError(error: BookingError): string {
  switch (error.type) {
    case "invalid-time":
      return "ungültige Uhrzeit";
    case "unknown-service":
      return "unbekannter Service";
    case "unknown-barber":
      return "unbekannter Barber";
    case "outside-working-hours":
      return "ausserhalb der Arbeitszeit";
    case "overlap":
      return `überschneidet sich mit ${error.conflictingAppointmentId}`;
  }
}

const salon = new Salon(SERVICES, BARBERS);

for (const request of DEMO_REQUESTS) {
  const result = salon.book(request);
  if (result.ok) {
    console.log(`✅ ${request.customerName}: ${result.value.id} um ${result.value.start}`);
  } else {
    console.log(`❌ ${request.customerName}: ${describeError(result.error)}`);
  }
}

console.log();
console.log(salon.daySummary(DEMO_DATE));
console.log();
console.log(
  "Freie Bart-Termine bei Anna:",
  salon.freeSlots("b-anna", DEMO_DATE, "s-beard", 30).join(", "),
);
