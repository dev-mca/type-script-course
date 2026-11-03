// Projekt A – Beispieldaten für main.ts (vorgegeben)

import type { Barber, BookingRequest, Service } from "./typen";

export const SERVICES: Service[] = [
  { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500 },
  { id: "s-beard", name: "Bart", durationMinutes: 15, priceInRappen: 2500 },
  { id: "s-color", name: "Färben", durationMinutes: 90, priceInRappen: 9000 },
];

export const BARBERS: Barber[] = [
  { id: "b-anna", name: "Anna", start: "09:00", end: "18:00" },
  { id: "b-bob", name: "Bob", start: "10:00", end: "16:00" },
];

export const DEMO_DATE = "2026-11-20";

export const DEMO_REQUESTS: BookingRequest[] = [
  {
    barberId: "b-anna",
    serviceId: "s-cut",
    customerName: "Melih",
    date: DEMO_DATE,
    start: "09:00",
  },
  {
    barberId: "b-anna",
    serviceId: "s-beard",
    customerName: "Chiara",
    date: DEMO_DATE,
    start: "10:00",
  },
  {
    barberId: "b-bob",
    serviceId: "s-color",
    customerName: "Dario",
    date: DEMO_DATE,
    start: "13:00",
  },
  // Diese beiden sollen abgelehnt werden:
  { barberId: "b-anna", serviceId: "s-cut", customerName: "Eva", date: DEMO_DATE, start: "09:15" },
  { barberId: "b-bob", serviceId: "s-cut", customerName: "Fabio", date: DEMO_DATE, start: "15:45" },
];
