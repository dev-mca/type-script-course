// Verbindet Node.js' eingebauten HTTP-Server mit einem Web-Standard-Handler
// (Request → Response). Vorgegeben – du musst das nicht selbst schreiben,
// aber lies es einmal durch: So funktioniert «unter der Haube» auch
// @hono/node-server.

import { type IncomingMessage, type Server, createServer } from "node:http";

export type FetchHandler = (request: Request) => Response | Promise<Response>;

async function readBody(message: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of message) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function toHeaders(message: IncomingMessage): Headers {
  const headers = new Headers();
  for (const [name, value] of Object.entries(message.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(name, v));
    else if (value !== undefined) headers.set(name, value);
  }
  return headers;
}

export function serve(handler: FetchHandler, port: number): Server {
  const server = createServer(async (incoming, outgoing) => {
    try {
      const method = incoming.method ?? "GET";
      const url = `http://${incoming.headers.host ?? "localhost"}${incoming.url ?? "/"}`;
      const hasBody = method !== "GET" && method !== "HEAD";
      const request = new Request(url, {
        method,
        headers: toHeaders(incoming),
        body: hasBody ? await readBody(incoming) : undefined,
      });

      const started = performance.now();
      const response = await handler(request);
      const duration = Math.round(performance.now() - started);
      console.log(`${method} ${incoming.url} → ${response.status} (${duration} ms)`);

      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(await response.text());
    } catch (error) {
      console.error("Unerwarteter Fehler im Adapter:", error);
      outgoing.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      outgoing.end(JSON.stringify({ error: "Interner Serverfehler" }));
    }
  });

  server.listen(port, () => {
    console.log(`🚀 API läuft auf http://localhost:${port}`);
  });
  return server;
}
