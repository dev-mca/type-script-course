// Lösung Teil A – Ein eigener Mini-Router

export type Params = Record<string, string>;

export type RouteHandler = (request: Request, params: Params) => Response | Promise<Response>;

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

type Route = { method: Method; segments: string[]; handler: RouteHandler };

/** "/services/:id/" → ["services", ":id"] */
function toSegments(path: string): string[] {
  return path.split("/").filter((segment) => segment !== "");
}

/** Liefert die Parameter, wenn der Pfad zur Route passt – sonst null. */
function matchPath(
  routeSegments: readonly string[],
  pathSegments: readonly string[],
): Params | null {
  if (routeSegments.length !== pathSegments.length) return null;
  const params: Params = {};
  for (const [i, routeSegment] of routeSegments.entries()) {
    const pathSegment = pathSegments[i]!;
    if (routeSegment.startsWith(":")) {
      params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (routeSegment !== pathSegment) {
      return null;
    }
  }
  return params;
}

export class Router {
  readonly #routes: Route[] = [];

  #add(method: Method, path: string, handler: RouteHandler): this {
    this.#routes.push({ method, segments: toSegments(path), handler });
    return this;
  }

  get(path: string, handler: RouteHandler): this {
    return this.#add("GET", path, handler);
  }

  post(path: string, handler: RouteHandler): this {
    return this.#add("POST", path, handler);
  }

  delete(path: string, handler: RouteHandler): this {
    return this.#add("DELETE", path, handler);
  }

  async handle(request: Request): Promise<Response> {
    const pathSegments = toSegments(new URL(request.url).pathname);
    const allowedMethods: Method[] = [];

    for (const route of this.#routes) {
      const params = matchPath(route.segments, pathSegments);
      if (params === null) continue;
      if (route.method !== request.method) {
        allowedMethods.push(route.method);
        continue;
      }
      try {
        // await ist wichtig: Nur so landen auch asynchrone Fehler im catch
        return await route.handler(request, params);
      } catch {
        return json({ error: "Interner Serverfehler" }, 500);
      }
    }

    if (allowedMethods.length > 0) {
      const response = json({ error: "Methode nicht erlaubt" }, 405);
      response.headers.set("Allow", [...new Set(allowedMethods)].join(", "));
      return response;
    }
    return json({ error: "Nicht gefunden" }, 404);
  }
}
