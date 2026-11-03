// Ausführen: npx tsx lektionen/l11-backend/beispiele/01-request-response.ts
//
// Request und Response sind Web-Standard-Klassen. Du kennst sie schon aus
// Lektion 8 (fetch). Auf dem Server drehen wir die Rollen einfach um:
// Wir BEKOMMEN einen Request und ERZEUGEN eine Response.

// Ein «Server» ist im Kern nur diese Funktion:
async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/hallo") {
    const name = url.searchParams.get("name") ?? "Welt";
    return Response.json({ message: `Hallo ${name}!` }); // Kurzform für JSON
  }

  if (request.method === "POST" && url.pathname === "/echo") {
    const body: unknown = await request.json();
    return Response.json({ received: body }, { status: 201 });
  }

  return new Response("Nicht gefunden", { status: 404 });
}

// Wir können ihn testen, ohne einen echten Server zu starten:
const responses = await Promise.all([
  handler(new Request("http://localhost/hallo?name=Melih")),
  handler(
    new Request("http://localhost/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: "Haarschnitt" }),
    }),
  ),
  handler(new Request("http://localhost/gibts-nicht")),
]);

for (const response of responses) {
  console.log(response.status, response.headers.get("content-type"), await response.text());
}

// Genau dieses Prinzip nutzen Hono, Cloudflare Workers, Deno, Bun und Next.js.
// Express (das bekannteste Node-Framework) ist älter und verwendet stattdessen
// eigene req/res-Objekte – das Konzept ist aber dasselbe.

// 🔧 Experiment: Ergänze eine Route DELETE /echo, die mit Status 204 und
// leerem Body antwortet (new Response(null, { status: 204 })).
