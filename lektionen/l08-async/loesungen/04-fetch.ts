// Lösung Aufgabe 4 – HTTP mit fetch

export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`HTTP ${status} bei ${url}`);
    this.name = "HttpError";
  }
}

async function parseOrThrow(response: Response, url: string): Promise<unknown> {
  if (!response.ok) {
    throw new HttpError(response.status, url);
  }
  return response.json() as Promise<unknown>;
}

export async function getJson(url: string, fetchFn: FetchFn = fetch): Promise<unknown> {
  const response = await fetchFn(url);
  return parseOrThrow(response, url);
}

export async function postJson(
  url: string,
  body: unknown,
  fetchFn: FetchFn = fetch,
): Promise<unknown> {
  const response = await fetchFn(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseOrThrow(response, url);
}

/** Type Guard: Ist value ein Objekt mit einem String-Feld name? */
function hasName(value: unknown): value is { name: string } {
  return (
    typeof value === "object" && value !== null && "name" in value && typeof value.name === "string"
  );
}

export async function loadServiceNames(
  baseUrl: string,
  fetchFn: FetchFn = fetch,
): Promise<string[]> {
  const data = await getJson(`${baseUrl}/services`, fetchFn);
  if (!Array.isArray(data) || !data.every(hasName)) {
    throw new TypeError("Unerwartete Antwort von /services");
  }
  // Nach every(hasName) weiss TypeScript: data ist { name: string }[]
  return data.map((service) => service.name).toSorted((a, b) => a.localeCompare(b, "de"));
}

export type DashboardStats = { services: number; bookings: number };

export async function loadDashboardStats(
  baseUrl: string,
  fetchFn: FetchFn = fetch,
): Promise<DashboardStats> {
  const [services, bookings] = await Promise.all([
    getJson(`${baseUrl}/services`, fetchFn),
    getJson(`${baseUrl}/bookings`, fetchFn),
  ]);
  if (!Array.isArray(services) || !Array.isArray(bookings)) {
    throw new TypeError("Unerwartete Antwort: Liste erwartet");
  }
  return { services: services.length, bookings: bookings.length };
}
