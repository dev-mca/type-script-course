// Startdaten für die Entwicklung (darfst du anpassen und erweitern)

import type { Service } from "../../shared/typen";

export const SEED_SERVICES: Service[] = [
  { id: "s-cut", name: "Haarschnitt", durationMinutes: 30, priceInRappen: 4500, active: true },
  { id: "s-beard", name: "Bart", durationMinutes: 15, priceInRappen: 2500, active: true },
  {
    id: "s-combo",
    name: "Haarschnitt + Bart",
    durationMinutes: 45,
    priceInRappen: 6500,
    active: true,
  },
  { id: "s-color", name: "Färben", durationMinutes: 90, priceInRappen: 9000, active: true },
  {
    id: "s-kids",
    name: "Kinderhaarschnitt",
    durationMinutes: 20,
    priceInRappen: 2800,
    active: false,
  },
];

// TODO M1: SEED_BARBERS (mindestens 2, mit unterschiedlichen Arbeitszeiten)
