// Aufgabe 4 – HTTP mit fetch
// Tests: npm run test:watch -- l08-async/uebungen/04
//
// Die Tests schleusen eine falsche fetch-Funktion ein – es gibt also kein echtes
// Netzwerk. Im echten Code würdest du den Parameter einfach weglassen.

/** Die Form von fetch, die wir brauchen (das echte fetch passt dazu) */
export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

/** Fehler für HTTP-Antworten mit Status ≥ 400 */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`HTTP ${status} bei ${url}`);
    this.name = "HttpError";
  }
}

/**
 * 4.1 Lädt JSON von einer URL.
 * - Ist response.ok false → HttpError mit dem Status werfen
 * - Sonst den Body als JSON zurückgeben (Typ unknown – wir trauen dem Server nicht!)
 */
export async function getJson(url: string, fetchFn: FetchFn = fetch): Promise<unknown> {
  throw new Error("TODO: Aufgabe 4.1");
}

/**
 * 4.2 Schickt `body` als JSON per POST und liefert die JSON-Antwort.
 * - Header "Content-Type: application/json"
 * - body mit JSON.stringify
 * - Fehlerbehandlung wie bei getJson
 */
export async function postJson(
  url: string,
  body: unknown,
  fetchFn: FetchFn = fetch,
): Promise<unknown> {
  throw new Error("TODO: Aufgabe 4.2");
}

/**
 * 4.3 Lädt die Services von `${baseUrl}/services` und liefert ihre Namen
 * alphabetisch sortiert.
 *
 * Der Server soll ein Array von Objekten mit einem String-Feld `name` liefern.
 * Ist die Antwort anders aufgebaut, wird ein TypeError mit der Meldung
 * "Unerwartete Antwort von /services" geworfen.
 */
export async function loadServiceNames(
  baseUrl: string,
  fetchFn: FetchFn = fetch,
): Promise<string[]> {
  throw new Error("TODO: Aufgabe 4.3");
}

export type DashboardStats = { services: number; bookings: number };

/**
 * 4.4 Lädt GLEICHZEITIG
 *   `${baseUrl}/services`   → Array (Anzahl Elemente zählt)
 *   `${baseUrl}/bookings`   → Array (Anzahl Elemente zählt)
 * und liefert { services: <Anzahl>, bookings: <Anzahl> }.
 * Ist eine der Antworten kein Array → TypeError.
 */
export async function loadDashboardStats(
  baseUrl: string,
  fetchFn: FetchFn = fetch,
): Promise<DashboardStats> {
  throw new Error("TODO: Aufgabe 4.4");
}
