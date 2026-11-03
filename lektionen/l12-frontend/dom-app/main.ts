// Lektion 12 – Teil A: Die Buchungsseite mit purem TypeScript und DOM-APIs
//
// Starten: in Terminal 1  npm run api      (API aus Lektion 11)
//          in Terminal 2  npm run web:dom  → http://localhost:5173
//
// Vite lädt die Seite bei jedem Speichern automatisch neu (Hot Reload).
// Öffne die Entwicklertools im Browser (F12): Konsole und Netzwerk-Tab!
//
// Schritt A0 ist als Beispiel fertig. A1–A4 machst du.

import type { Booking, Service } from "../../l11-backend/uebungen/daten";
import { createApiClient } from "../uebungen/api-client";
import { formatChf, formatDuration, formatTime } from "../uebungen/formatierung";

const api = createApiClient("/api");

/**
 * Findet ein Element – oder wirft einen verständlichen Fehler.
 * Das <T> erlaubt, den genauen Element-Typ anzugeben:
 *   const input = $<HTMLInputElement>("#date");   → input.value ist verfügbar
 * (querySelector liefert sonst nur Element | null)
 */
function $<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Element nicht gefunden: ${selector}`);
  return element;
}

const serviceList = $<HTMLUListElement>("#service-list");
const serviceSelect = $<HTMLSelectElement>("#service-select");
const dateInput = $<HTMLInputElement>("#date");
const bookingList = $<HTMLUListElement>("#booking-list");
const form = $<HTMLFormElement>("#booking-form");
const formMessage = $<HTMLDivElement>("#form-message");

let services: Service[] = [];

// ─── A0 (Beispiel): Services laden und anzeigen ──────────────────────────────

function renderServices(): void {
  // replaceChildren() leert das Element und fügt die neuen Kinder ein
  serviceList.replaceChildren(
    ...services.map((service) => {
      const li = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = service.name; // textContent statt innerHTML → kein HTML-Injection-Risiko!
      const info = document.createElement("span");
      info.className = "muted";
      info.textContent = `${formatDuration(service.durationMinutes)} · ${formatChf(service.priceInRappen)}`;
      li.append(name, info);
      return li;
    }),
  );

  serviceSelect.replaceChildren(...services.map((service) => new Option(service.name, service.id)));
}

async function loadServices(): Promise<void> {
  try {
    services = await api.getServices();
    renderServices();
  } catch (error) {
    serviceList.textContent = `Services konnten nicht geladen werden: ${String(error)}`;
    serviceList.className = "error";
  }
}

// ─── A1: Buchungen eines Tages anzeigen ──────────────────────────────────────
//
// Schreib renderBookings(bookings) und loadBookings():
// - loadBookings lädt api.getBookings(dateInput.value) und ruft renderBookings auf
// - Jede Buchung wird ein <li> mit:
//     <span class="time">10:00–10:30</span>   (formatTime für start und end)
//     <span class="grow">Melih · Haarschnitt</span>  (Service-Name über die services-Liste finden)
//     <button class="link" data-id="…">Löschen</button>
// - Keine Buchungen → ein <li class="muted">Noch keine Termine</li>
// - Fehler beim Laden → Fehlermeldung in der Liste anzeigen

function renderBookings(bookings: Booking[]): void {
  // TODO: A1
}

async function loadBookings(): Promise<void> {
  // TODO: A1
}

// ─── A2: Datum wählen ───────────────────────────────────────────────────────
//
// - Setze dateInput.value beim Start auf heute (new Date().toISOString().slice(0, 10))
// - Bei jeder Änderung (Ereignis "change") die Buchungen neu laden
//   dateInput.addEventListener("change", () => { … });

// TODO: A2

// ─── A3: Formular absenden ──────────────────────────────────────────────────
//
// form.addEventListener("submit", async (event) => { … })
// - event.preventDefault() – sonst lädt der Browser die Seite neu!
// - Werte auslesen: const data = new FormData(form); data.get("customerName") …
//   (FormData.get liefert FormDataEntryValue | null – mit String(…) umwandeln)
// - Button während des Sendens deaktivieren (submitButton.disabled = true)
// - api.createBooking({ serviceId, customerName, start: `${dateInput.value}T${time}` })
// - Erfolg: Meldung "✅ Termin gebucht" (class "success"), Formular leeren (form.reset()),
//   Buchungen neu laden
// - Fehler (ok: false): Meldung + details anzeigen (class "error")
// - Exception: allgemeine Fehlermeldung anzeigen
// - Button am Ende wieder aktivieren (finally!)

// TODO: A3

// ─── A4: Löschen ────────────────────────────────────────────────────────────
//
// Statt an jeden Button einzeln einen Listener zu hängen, verwenden wir
// «Event Delegation»: EIN Listener auf der Liste, der schaut, worauf geklickt wurde.
//
// bookingList.addEventListener("click", async (event) => {
//   const target = event.target;
//   if (!(target instanceof HTMLButtonElement) || !target.dataset.id) return;
//   …
// });
// Vor dem Löschen: if (!confirm("Termin wirklich löschen?")) return;

// TODO: A4

// ─── Start ──────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  await loadServices(); // zuerst die Services – die Buchungsliste braucht ihre Namen
  await loadBookings();
}

void start(); // void: «Ich warte bewusst nicht auf dieses Promise»
