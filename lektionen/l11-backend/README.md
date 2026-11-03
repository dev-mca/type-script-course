# Lektion 11 – Eine Backend-API

> ⏱ **ca. 6–8 Stunden** (gern auf 2 Wochen verteilt) · Voraussetzung: Lektion 10 · Schwierigkeit: ●●●●○

## Darum geht's

Jetzt wird es praktisch: Du baust eine **REST-API** für Terminbuchungen – genau die Art Backend, die hinter einem Dashboard oder einer Buchungs-App steckt. Und zwar in zwei Schritten:

1. **Zuerst ohne Framework.** Du baust einen kleinen Router selbst. Danach weisst du, was Frameworks eigentlich tun – und kein Framework wirkt mehr wie Magie.
2. **Dann mit Hono**, einem modernen TypeScript-Framework. Dieselben Tests laufen gegen beide Versionen.

Dazu kommt das wichtigste Werkzeug für Backends in TypeScript: **Zod** zur Validierung. Du erinnerst dich: Zur Laufzeit gibt es keine Typen. Was ein Client schickt, kann *alles* sein. Zod prüft die Daten und liefert dir gleichzeitig den passenden TypeScript-Typ.

**Nach dieser Lektion kannst du:**

- HTTP-Anfragen mit `Request`/`Response` verarbeiten und passende Statuscodes zurückgeben
- erklären, wie ein Router Pfade und Parameter zuordnet
- Eingaben mit Zod validieren und Typen daraus herleiten (`z.infer`)
- eine API in Schichten aufbauen und mit Dependency Injection testbar machen
- dieselbe API mit Hono umsetzen und starten

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 📖 Lesen | Abschnitte 1–2 (HTTP, Request/Response) | 25 min |
| 2 | ▶️ Ausprobieren | `beispiele/01-request-response.ts` | 10 min |
| 3 | ✍️ Teil A | `uebungen/router.ts` – eigener Router | 75 min |
| 4 | 📖 Lesen | Abschnitt 3 (Validierung) | 20 min |
| 5 | 🌐 Doku | Zod «Basic usage» + «Defining schemas» (Strings, Objekte) | 25 min |
| 6 | ✍️ Teil B | `uebungen/schemas.ts` | 40 min |
| 7 | 📖 Lesen | Abschnitt 4 (Architektur) | 15 min |
| 8 | ✍️ Teil C | `uebungen/app.ts` – die API | 90 min |
| 9 | ▶️ Ausprobieren | Server starten, `api.http` in IntelliJ | 20 min |
| 10 | 📖 + ✍️ Teil D | Abschnitt 5 + `uebungen/hono-app.ts` (optional, empfohlen) | 60 min |

---

## 1. HTTP in fünf Minuten

Eine HTTP-Anfrage besteht aus **Methode**, **Pfad** (mit optionaler **Query**), **Headern** und optional einem **Body**. Die Antwort aus **Statuscode**, **Headern** und **Body**.

```http
POST /bookings?notify=true HTTP/1.1
Content-Type: application/json

{ "serviceId": "s-cut", "customerName": "Melih", "start": "2026-11-20T10:00" }
```

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "id": "b-1", "serviceId": "s-cut", … }
```

### REST-Konventionen

| Methode | Pfad | Bedeutung | Erfolg |
|---------|------|-----------|--------|
| `GET` | `/bookings` | Liste lesen | `200` |
| `GET` | `/bookings/:id` | Einen Eintrag lesen | `200` |
| `POST` | `/bookings` | Neuen Eintrag erstellen | `201 Created` |
| `PUT`/`PATCH` | `/bookings/:id` | Ersetzen / teilweise ändern | `200` |
| `DELETE` | `/bookings/:id` | Löschen | `204 No Content` |

### Die wichtigsten Statuscodes

| Code | Bedeutung | Wann |
|------|-----------|------|
| `400` | Bad Request | Ungültige Eingabe (Validierung) |
| `401` / `403` | Unauthorized / Forbidden | Nicht angemeldet / keine Berechtigung |
| `404` | Not Found | Ressource gibt es nicht |
| `405` | Method Not Allowed | Pfad existiert, Methode nicht |
| `409` | Conflict | Widerspricht dem aktuellen Zustand (z. B. Doppelbuchung) |
| `500` | Internal Server Error | Fehler im Server – **nie** absichtlich zurückgeben |

**Konvention in diesem Kurs:** Fehler haben immer die Form `{ "error": "Meldung", …Zusatzinfos }`. Eine einheitliche Fehlerform macht das Leben im Frontend viel einfacher.

> 🌐 **Nachschlagen:** [MDN: HTTP-Statuscodes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## 2. Request und Response

`Request` und `Response` kennst du aus Lektion 8 (`fetch`). Auf dem Server drehen sich die Rollen um: Du bekommst einen `Request` und erzeugst eine `Response`. Ein Server ist im Kern nur eine Funktion:

```ts
type Handler = (request: Request) => Promise<Response>;
```

Das Schöne: Diese Funktion kannst du testen, **ohne einen Server zu starten**. Du baust einfach einen `new Request(...)`, rufst den Handler auf und prüfst die `Response`. Genau so funktionieren alle Tests in dieser Lektion.

```ts
const url = new URL(request.url);
url.pathname;                    // "/bookings"
url.searchParams.get("date");    // "2026-11-20" oder null
request.method;                  // "POST"
request.headers.get("content-type");
await request.json();            // Body als JSON (wirft bei ungültigem JSON!)
```

> ✍️ **Jetzt Teil A:** `uebungen/router.ts` – `npm run test:watch -- l11-backend/uebungen/router`

---

## 3. Validierung – weil Typen zur Laufzeit nicht existieren

```ts
router.post("/bookings", async (request) => {
  const body = (await request.json()) as CreateBookingInput;   // ❌ GEFÄHRLICH
  body.customerName.trim();   // stürzt ab, wenn der Client { } schickt
});
```

Das `as` ist eine Lüge: Der Client kann schicken, was er will – Tippfehler, falsche Typen, Angriffe. **Jede Eingabe von aussen muss geprüft werden.** Das von Hand zu tun (wie in Lektion 2 und 8) ist mühsam. Darum gibt es Bibliotheken wie **Zod**:

```ts
import { z } from "zod";

const CreateBookingSchema = z.object({
  serviceId: z.string().min(1),
  customerName: z.string().trim().min(2, "Name zu kurz"),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
});

// Der TypeScript-Typ wird AUS dem Schema hergeleitet – eine Quelle der Wahrheit:
type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

const result = CreateBookingSchema.safeParse(await request.json());
if (!result.success) {
  return json({ error: "Ungültige Daten", details: result.error.issues }, 400);
}
result.data.customerName;   // ✅ string – geprüft und typisiert
```

`safeParse` wirft nie, sondern liefert eine Discriminated Union (`success: true | false`) – genau das `Result`-Muster aus Lektion 5 und 7. (`parse` würde stattdessen werfen.)

> 🌐 **Doku (25 min):** [Zod – Basic usage](https://zod.dev/basics) und aus [Defining schemas](https://zod.dev/api) die Abschnitte zu Strings, Objects und Arrays.

> ✍️ **Jetzt Teil B:** `uebungen/schemas.ts`

---

## 4. Architektur: Schichten und Dependency Injection

```text
  HTTP-Request
       │
       ▼
  ┌──────────────┐   Router: Methode + Pfad → Handler
  │   Routing    │
  └──────┬───────┘
         ▼
  ┌──────────────┐   Validierung (Zod), Statuscodes, JSON
  │   Handler    │   «Übersetzt» zwischen HTTP und Fachlogik
  └──────┬───────┘
         ▼
  ┌──────────────┐   Regeln: Überschneidung, Dauer, …
  │  Fachlogik   │
  └──────┬───────┘
         ▼
  ┌──────────────┐   Speichern/Laden – hinter einem Interface
  │  Repository  │   (heute: Arbeitsspeicher, morgen: Datenbank)
  └──────────────┘
```

Das kennst du vielleicht von Spring Boot (`@RestController` → `@Service` → `@Repository`). In TypeScript macht man es meist ohne Annotationen und ohne DI-Container: `createApp` bekommt seine **Abhängigkeiten als Parameter** (mit sinnvollen Defaults):

```ts
export function createApp({ repository = new InMemoryBookingRepository(), now = () => new Date() } = {}) { … }

// Produktion:
const app = createApp();
// Test: feste Uhrzeit, vorbereitete Daten
const app = createApp({ now: () => new Date("2026-11-03T08:00:00Z"), repository: new InMemoryBookingRepository([…]) });
```

So bekommst du **deterministische Tests** (gleiche Eingabe → gleiche Ausgabe), ohne Mocking-Framework. Dieses Muster hast du schon beim Cache (L7) und bei `fetch`/`sleep` (L8) gesehen.

> ✍️ **Jetzt Teil C:** `uebungen/app.ts` – `npm run test:watch -- l11-backend/uebungen/app`

### Den Server starten

```bash
npm run api
```

Öffne dann `lektionen/l11-backend/api.http` in IntelliJ Ultimate und klicke auf ▶ neben einer Anfrage. Der eingebaute **HTTP Client** zeigt dir Status, Header und Body – wie Postman, aber direkt in der IDE. Alternativ im Terminal:

```bash
curl http://localhost:3000/services
curl -X POST http://localhost:3000/bookings -H "Content-Type: application/json" \
     -d '{"serviceId":"s-cut","customerName":"Melih","start":"2026-11-20T10:00"}'
```

Schau dir auch `node-adapter.ts` an: So wird Node.js' eingebauter HTTP-Server mit deinem `Request → Response`-Handler verbunden.

---

## 5. Teil D: Dasselbe mit Hono

Dein Router funktioniert – warum dann ein Framework? Weil es dir viel abnimmt: Middleware (Logging, CORS, Authentifizierung), Validierungs-Integration, Typsicherheit für Pfad-Parameter, bessere Performance, Dokumentation, eine Community. Hono ist dabei besonders nah an dem, was du gebaut hast:

| Dein Router | Hono |
|-------------|------|
| `router.get("/services/:id", (req, params) => …)` | `app.get("/services/:id", (c) => …)` |
| `params.id` | `c.req.param("id")` |
| `new URL(req.url).searchParams.get("date")` | `c.req.query("date")` |
| `await req.json()` | `await c.req.json()` |
| `json(data, 201)` | `c.json(data, 201)` |
| `router.handle(req)` | `app.fetch(req)` |

**Express** ist das bekannteste Node.js-Framework (seit 2010, riesige Verbreitung). Du wirst es in vielen bestehenden Projekten antreffen. Hono, Fastify und NestJS sind modernere Alternativen; NestJS wird dir mit Decorators und DI-Container übrigens sehr nach Spring vorkommen.

> 🌐 **Doku (20 min):** [Hono – Getting Started (Node.js)](https://hono.dev/docs/getting-started/nodejs), [Routing](https://hono.dev/docs/api/routing), [Context](https://hono.dev/docs/api/context), [Testing](https://hono.dev/docs/guides/testing)

> ✍️ **Teil D:** `uebungen/hono-app.ts`. In `hono-app.test.ts` `TEIL_D = true` setzen. Starten mit `npm run api:hono`.

---

## 6. Sicherheit – drei Regeln für den Anfang

1. **Vertraue keiner Eingabe.** Body, Query, Header, Pfad-Parameter: alles validieren. (Zod!)
2. **Keine Geheimnisse im Code.** Passwörter, API-Keys und Datenbank-URLs gehören in Umgebungsvariablen (siehe L9, Aufgabe 4) – und nicht ins Git-Repository.
3. **Keine internen Details in Fehlermeldungen.** Ein `500` sagt dem Client «Interner Serverfehler», den Stacktrace schreibst du nur ins Server-Log.

---

## 7. ✍️ Übersicht der Übungen

```bash
npm run test:watch -- l11
```

| Teil | Datei | Thema | ★ |
|------|-------|-------|---|
| A | `router.ts` | Routing, Pfad-Parameter, 404/405/500 | ★★★ |
| B | `schemas.ts` | Zod-Schemas, `z.infer`, Fehler formatieren | ★★☆ |
| C | `app.ts` | Die Booking-API (nutzt A, B und `daten.ts`) | ★★★ |
| D | `hono-app.ts` | Dieselbe API mit Hono (optional) | ★★☆ |

> 🔍 **Recherche-Auftrag:** Was ist **CORS**, und warum blockiert der Browser standardmässig Anfragen von `http://localhost:5173` an `http://localhost:3000`? ([MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) Das wird in Lektion 12 relevant – dort lösen wir es mit einem Proxy in Vite.

---

## 8. ✅ Selbstcheck

<details>
<summary>1. Welche Statuscodes gibt deine API für «ungültige Eingabe», «Service unbekannt» und «Doppelbuchung» zurück – und warum?</summary>

`400` (der Client hat etwas Ungültiges geschickt), `404` (die referenzierte Ressource existiert nicht), `409` (die Anfrage ist an sich gültig, widerspricht aber dem aktuellen Zustand).
</details>

<details>
<summary>2. Warum ist <code>(await request.json()) as CreateBookingInput</code> gefährlich?</summary>

`as` prüft nichts. Zur Laufzeit kann der Body beliebig aussehen. Der Code würde mit falschen Annahmen weiterlaufen und an einer ganz anderen Stelle abstürzen – oder falsche Daten speichern.
</details>

<details>
<summary>3. Was ist der Vorteil von <code>z.infer&lt;typeof Schema&gt;</code>?</summary>

Der Typ wird aus dem Schema hergeleitet. Es gibt nur eine Quelle der Wahrheit – Validierung und Typ können nicht auseinanderlaufen.
</details>

<details>
<summary>4. Wie testest du einen Handler, der die aktuelle Uhrzeit braucht?</summary>

Die Uhr als Abhängigkeit injizieren (`now: () => Date`) und im Test eine feste Zeit übergeben.
</details>

<details>
<summary>5. Warum laufen dieselben Tests gegen deinen Router und gegen Hono?</summary>

Weil beide denselben Vertrag erfüllen: `(request: Request) => Promise<Response>`. Die Tests prüfen nur das Verhalten von aussen, nicht die Umsetzung.
</details>

## 9. Weiterführend (optional)

- [Hono – Validation](https://hono.dev/docs/guides/validation) – wie man Zod direkt in Hono einbindet (`@hono/zod-validator`)
- [Express – Getting started](https://expressjs.com/en/starter/hello-world.html) – zum Vergleich
- [MDN: An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

---

### Abschluss-Checkliste

- [ ] Teil A–C: alle Tests grün
- [ ] Teil D (optional): Hono-Tests grün
- [ ] Server gestartet und mit `api.http` ausprobiert
- [ ] `FORTSCHRITT.md` aktualisiert und committet

➡️ Weiter mit [Lektion 12 – Frontend](../l12-frontend/README.md)
