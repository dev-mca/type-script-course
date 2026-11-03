// Lösung Teil A – Die Buchungsseite mit purem TypeScript und DOM-APIs
//
// Diese Lösung lässt sich direkt starten:
//   npx vite lektionen/l12-frontend/loesungen/dom-app   (API muss laufen: npm run api)

import type { Booking, Service } from "../../../l11-backend/uebungen/daten";
import { createApiClient } from "../api-client";
import { formatChf, formatDuration, formatTime } from "../formatierung";

const api = createApiClient("/api");

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
const submitButton = form.querySelector<HTMLButtonElement>("button[type=submit]")!;

let services: Service[] = [];

// ─── A0: Services ───────────────────────────────────────────────────────────

function renderServices(): void {
  serviceList.replaceChildren(
    ...services.map((service) => {
      const li = document.createElement("li");
      const name = document.createElement("strong");
      name.textContent = service.name;
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

// ─── A1: Buchungen ──────────────────────────────────────────────────────────

/** Kleiner Helfer, damit das Erzeugen von Elementen kürzer wird */
function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  return el;
}

function renderBookings(bookings: Booking[]): void {
  if (bookings.length === 0) {
    bookingList.replaceChildren(element("li", "muted", "Noch keine Termine"));
    return;
  }
  bookingList.replaceChildren(
    ...bookings.map((booking) => {
      const serviceName =
        services.find((s) => s.id === booking.serviceId)?.name ?? booking.serviceId;
      const li = document.createElement("li");
      const deleteButton = element("button", "link", "Löschen");
      deleteButton.type = "button";
      deleteButton.dataset.id = booking.id; // → Attribut data-id="…"
      li.append(
        element("span", "time", `${formatTime(booking.start)}–${formatTime(booking.end)}`),
        element("span", "grow", `${booking.customerName} · ${serviceName}`),
        deleteButton,
      );
      return li;
    }),
  );
}

async function loadBookings(): Promise<void> {
  try {
    renderBookings(await api.getBookings(dateInput.value));
  } catch (error) {
    bookingList.replaceChildren(
      element("li", "error", `Termine konnten nicht geladen werden: ${String(error)}`),
    );
  }
}

// ─── A2: Datum ──────────────────────────────────────────────────────────────

dateInput.value = new Date().toISOString().slice(0, 10);
dateInput.addEventListener("change", () => {
  void loadBookings();
});

// ─── A3: Formular ───────────────────────────────────────────────────────────

function showMessage(text: string, kind: "success" | "error", details: string[] = []): void {
  formMessage.className = kind;
  formMessage.replaceChildren(
    element("p", "", text),
    ...details.map((detail) => element("p", "muted", detail)),
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const serviceId = String(data.get("serviceId") ?? "");
  const customerName = String(data.get("customerName") ?? "");
  const time = String(data.get("time") ?? "");

  submitButton.disabled = true;
  try {
    const result = await api.createBooking({
      serviceId,
      customerName,
      start: `${dateInput.value}T${time}`,
    });
    if (result.ok) {
      showMessage(`✅ Termin gebucht: ${formatTime(result.booking.start)} Uhr`, "success");
      form.reset();
      serviceSelect.value = serviceId; // reset würde sonst auch den Service zurücksetzen
      await loadBookings();
    } else {
      showMessage(result.message, "error", result.details);
    }
  } catch (error) {
    showMessage(`Unerwarteter Fehler: ${String(error)}`, "error");
  } finally {
    submitButton.disabled = false;
  }
});

// ─── A4: Löschen (Event Delegation) ─────────────────────────────────────────

bookingList.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.id) return;
  if (!confirm("Termin wirklich löschen?")) return;

  target.disabled = true;
  try {
    await api.deleteBooking(target.dataset.id);
    await loadBookings();
  } catch (error) {
    alert(`Löschen fehlgeschlagen: ${String(error)}`);
    target.disabled = false;
  }
});

// ─── Start ──────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  await loadServices();
  await loadBookings();
}

void start();
