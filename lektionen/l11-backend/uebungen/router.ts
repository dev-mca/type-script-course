// Lektion 11 – Teil A: Ein eigener Mini-Router
// Tests: npm run test:watch -- l11-backend/uebungen/router
//
// Ein Router ordnet eine Anfrage (Methode + Pfad) dem passenden Handler zu.
// Genau das machen Express, Hono & Co. – nur mit viel mehr Komfort. Wer es
// einmal selbst gebaut hat, versteht jedes Framework sofort.
//
// Alles basiert auf den Web-Standard-Klassen Request und Response, die es in
// Node.js, im Browser, in Deno, Bun und Cloudflare Workers gleichermassen gibt.

export type Params = Record<string, string>;

export type RouteHandler = (request: Request, params: Params) => Response | Promise<Response>;

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * A.1 Erzeugt eine JSON-Antwort.
 *   - Body: JSON.stringify(data)
 *   - Header "Content-Type": "application/json; charset=utf-8"
 *   - Status: Standard 200
 */
export function json(data: unknown, status = 200): Response {
  throw new Error("TODO: Teil A.1");
}

/**
 * A.2 Der Router
 *
 * Registrieren:
 *   router.get("/services", handler)
 *   router.get("/services/:id", handler)     → params = { id: "s-cut" }
 *   router.post(...), router.delete(...)
 *   Die Methoden geben `this` zurück, damit man sie verketten kann:
 *     router.get(…).post(…)
 *
 * Verarbeiten: router.handle(request) → Promise<Response>
 *   - Es zählt nur der Pfad (new URL(request.url).pathname), nicht die Query (?date=…)
 *   - Ein Schrägstrich am Ende wird ignoriert: "/services/" = "/services"
 *   - Segmente, die mit ":" beginnen, sind Parameter und passen auf jeden nicht-leeren Wert
 *   - Parameterwerte werden URL-dekodiert (decodeURIComponent): "/kunden/Ren%C3%A9" → "René"
 *   - Bei mehreren passenden Routen gewinnt die zuerst registrierte
 *   - Kein Pfad passt                       → 404, json({ error: "Nicht gefunden" })
 *   - Pfad passt, aber nicht die Methode     → 405, json({ error: "Methode nicht erlaubt" })
 *                                             plus Header "Allow" mit den erlaubten Methoden,
 *                                             z. B. "GET, POST" (in Registrier-Reihenfolge)
 *   - Wirft ein Handler (auch asynchron)     → 500, json({ error: "Interner Serverfehler" })
 *
 * Tipp: Speichere jede Route als { method, segments: string[], handler }.
 * Schreib eine Hilfsfunktion matchPath(routeSegments, pathSegments): Params | null.
 */
export class Router {
  // TODO: Teil A.2

  get(path: string, handler: RouteHandler): this {
    throw new Error("TODO: Teil A.2");
  }

  post(path: string, handler: RouteHandler): this {
    throw new Error("TODO: Teil A.2");
  }

  delete(path: string, handler: RouteHandler): this {
    throw new Error("TODO: Teil A.2");
  }

  async handle(request: Request): Promise<Response> {
    throw new Error("TODO: Teil A.2");
  }
}
