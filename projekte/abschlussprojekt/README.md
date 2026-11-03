# 🎓 Abschlussprojekt – «Salon»: Eine Full-Stack-Buchungs-App

> ⏱ **ca. 20–30 Stunden** (realistisch: 4–6 Wochen neben dem Studium) · Nach Lektion 12 · Schwierigkeit: ●●●●●

## Worum geht's

Du baust eine vollständige Web-App für einen Barbershop – von der Datenstruktur bis zur Oberfläche. Kunden buchen online einen Termin, die Inhaberin verwaltet Services und sieht ein Dashboard mit Kennzahlen.

Dieses Projekt fasst den ganzen Kurs zusammen. Vieles hast du schon gebaut: die Buchungslogik (Projekt A), die Auswertung (Projekt B), die API (L11), die Oberfläche (L12). Jetzt verbindest du alles zu **einem** sauberen Projekt mit **gemeinsamen Typen** zwischen Server und Web.

Anders als bisher gibt es **keine vorgegebenen Abnahmetests**. Du bekommst Anforderungen wie in einem echten Projekt – und schreibst die Tests selbst. Genau das unterscheidet «eine Sprache kennen» von «damit Software bauen können».

## Architektur

```text
projekte/abschlussprojekt/
├── shared/                 Typen + Zod-Schemas – von Server UND Web importiert
│   └── typen.ts
├── server/                 Hono-API (Node.js)
│   ├── src/
│   │   ├── index.ts        Start, Konfiguration
│   │   ├── app.ts          Routen (dünn: validieren → Fachlogik aufrufen → antworten)
│   │   ├── domain/         Fachlogik ohne HTTP (Buchungsregeln, freie Zeiten, Statistik)
│   │   ├── repository/     Speichern/Laden (erst im Speicher, dann JSON-Datei)
│   │   └── seed.ts         Startdaten
│   ├── data/               Laufzeitdaten (nicht im Git)
│   └── tests/
└── web/                    React-App (Vite)
    └── src/
        ├── api/            API-Client (wie in L12, aber mit den shared-Schemas)
        ├── state/          Reducer, Hilfsfunktionen (getestet!)
        ├── components/
        └── pages/          Buchen, Stornieren, Admin
```

```text
   Browser (React)                    Server (Hono)                       Speicher
  ┌──────────────┐  HTTP /api/…   ┌────────────────────┐            ┌──────────────┐
  │ pages/       │ ─────────────► │ app.ts (Routen)    │            │ JSON-Datei   │
  │ components/  │                │   │                │            │ data/db.json │
  │ api/ client  │ ◄───────────── │   ▼                │            └──────▲───────┘
  └──────┬───────┘  JSON          │ domain/ (Regeln)   │ ──────────────────┘
         │                        │ repository/        │
         └──────── importieren ───┴────────┬───────────┘
                                           ▼
                                   shared/typen.ts  (eine Quelle der Wahrheit)
```

Die Ordner unter `server/src` und `web/src` sind Vorschläge. Du darfst sie anders aufteilen – begründe es dann kurz in deiner Projekt-Dokumentation (M7).

## Starten

```bash
npm run final:api                      # Terminal 1 → http://localhost:3000
npm run final:web                      # Terminal 2 → http://localhost:5175
npm run test:watch -- abschlussprojekt # Terminal 3
npx tsc --noEmit -p projekte/abschlussprojekt
```

Das Grundgerüst läuft schon: Die Web-App zeigt die Services an, die vom Server kommen.

---

## Anforderungen (User Stories)

### Kundinnen und Kunden

| ID | Als Kunde möchte ich … | Abnahmekriterien |
|----|------------------------|------------------|
| **K1** | die Services mit Dauer und Preis sehen | Nur aktive Services; Preis als «CHF 45.00», Dauer als «1 h 30 min» |
| **K2** | für einen Service, einen Barber und ein Datum die **freien Zeiten** sehen | Raster 15 min; Termin muss ganz in der Arbeitszeit liegen; keine Überschneidung; Zeiten in der Vergangenheit sind nicht buchbar |
| **K3** | einen freien Termin buchen | Name (2–80 Zeichen) und E-Mail Pflicht; Bestätigung mit Buchungsnummer (z. B. `SALON-7K3Q`) und Zusammenfassung |
| **K4** | einen Termin stornieren | Mit Buchungsnummer **und** E-Mail; nur bis 2 Stunden vor Beginn; danach eine verständliche Meldung |

### Inhaberin (Admin)

Für den Admin-Bereich reicht ein einfacher Schutz: Der Server liest ein Token aus der Umgebungsvariable `ADMIN_TOKEN`, das Web schickt es im Header `X-Admin-Token` mit (eingegeben auf einer Login-Seite, gespeichert im `sessionStorage`). Das ist **kein** produktionsreifes Login – aber gut genug, um das Prinzip von Middleware zu üben.

| ID | Als Admin möchte ich … | Abnahmekriterien |
|----|------------------------|------------------|
| **A1** | den Tagesplan aller Barber sehen | Pro Barber eine Spalte, Termine chronologisch, Tag wählbar |
| **A2** | Services verwalten | Anlegen, Preis/Dauer ändern, deaktivieren (nicht löschen – alte Buchungen verweisen darauf) |
| **A3** | ein Dashboard sehen | Umsatz dieser und letzte Woche, Anzahl Termine pro Barber, Top-3-Services, Stornoquote |
| **A4** | im Admin-Bereich ohne Token abgewiesen werden | Ohne/mit falschem Token → `401`; im Web zurück zur Login-Seite |

### Technische Anforderungen

- **T1** Alle Daten, die zwischen Server und Web fliessen, sind in `shared/typen.ts` als Zod-Schema definiert. Server **und** Web validieren damit.
- **T2** Kein `any`. Jedes `as` mit Kommentar begründet.
- **T3** Die Fachlogik (`domain/`) kennt kein HTTP und kein Hono und ist mit Unit-Tests abgedeckt.
- **T4** Mindestens **25 eigene Tests**: Fachlogik, API-Endpunkte (über `app.fetch`), Reducer/Hilfsfunktionen im Web.
- **T5** Uhrzeit und IDs werden injiziert (Dependency Injection) – Tests sind deterministisch.
- **T6** Konfiguration (`PORT`, `ADMIN_TOKEN`, `DATA_FILE`) aus Umgebungsvariablen, beim Start validiert.
- **T7** Daten überleben einen Neustart des Servers (JSON-Datei).
- **T8** Einheitliche Fehlerform `{ error, details? }`; im Web verständliche Meldungen, Ladezustände, keine Abstürze.
- **T9** `npx tsc --noEmit -p projekte/abschlussprojekt` ohne Fehler, Code mit Prettier formatiert.

---

## Meilensteine

Jeder Meilenstein endet mit etwas, das funktioniert. Committe nach jedem Meilenstein. ⭐ markiert die Stellen, an denen du mir den Stand für ein Review schicken solltest.

| # | Inhalt | Stories | Zeit |
|---|--------|---------|------|
| **M1** | `shared/typen.ts`: alle Schemas. Seed-Daten für Barber. `GET /barbers`. Tests für die Schemas. | T1 | 3 h |
| **M2** ⭐ | `domain/`: freie Zeiten berechnen (Code aus Projekt A übernehmen und anpassen). `GET /barbers/:id/slots`. Tests. | K2 | 4 h |
| **M3** | `POST /bookings`, `POST /bookings/:id/cancel`. Repository-Interface, erst im Speicher, dann als JSON-Datei (async!). Konfiguration. | K3, K4, T5–T7 | 5 h |
| **M4** ⭐ | Web: Services → Barber/Datum → freie Zeiten → Formular → Bestätigung. Stornieren-Seite. | K1–K4, T8 | 6 h |
| **M5** | Admin: Token-Middleware, Tagesplan-Endpunkt, Services verwalten (API + UI). | A1, A2, A4 | 5 h |
| **M6** | Dashboard: Statistik-Funktion in `domain/` (Projekt B lässt grüssen) + Endpunkt + UI. | A3 | 3 h |
| **M7** ⭐ | Aufräumen, fehlende Tests, eine kurze `DOKU.md` (Architektur, Entscheidungen, was du gelernt hast). | T2–T9 | 3 h |

### Hinweise pro Meilenstein

<details>
<summary>M1 – Wie verwende ich ein Schema für mehrere Zwecke?</summary>

Zod-Schemas lassen sich ableiten, genau wie Utility Types:

```ts
export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export const UpdateServiceSchema = CreateServiceSchema.partial();
```

Für Buchungen bietet sich an, ein Basis-Schema zu definieren und davon `CreateBookingSchema` (was der Client schickt) und `BookingSchema` (was gespeichert/zurückgegeben wird) abzuleiten.
</details>

<details>
<summary>M2 – Woher kommt «jetzt», damit Zeiten in der Vergangenheit nicht buchbar sind?</summary>

Injizieren! Die Funktion für freie Zeiten bekommt `now` als Parameter (z. B. als `"2026-11-20T09:47"`). Im Test gibst du eine feste Zeit mit, in der App `new Date()` umgerechnet in lokale Zeit. Achtung Zeitzonen: Am einfachsten rechnest du konsequent mit lokalen Strings `"JJJJ-MM-TTTHH:MM"` wie in Lektion 11.
</details>

<details>
<summary>M3 – Wie baue ich ein Datei-Repository?</summary>

Gleiches Interface wie das In-Memory-Repository, aber die Methoden werden `async` (Datei lesen/schreiben). Beim Schreiben: erst in eine temporäre Datei schreiben, dann umbenennen (`rename`) – so ist die Datei nie halb geschrieben, falls der Server mittendrin abstürzt. Für die Tests verwendest du weiterhin die In-Memory-Variante.

Wenn das Interface `async` wird, müssen auch die Routen `await` verwenden. Vergiss keins! (ESLint mit `no-floating-promises` hilft – siehe Lektion 9.)
</details>

<details>
<summary>M4 – Wie organisiere ich mehrere Seiten?</summary>

Für dieses Projekt reicht ein einfacher Zustand `page: "booking" | "cancel" | "admin"` im obersten Reducer und Buttons zum Umschalten. Wer mehr will: [React Router](https://reactrouter.com/) – aber erst, wenn alles andere läuft.
</details>

<details>
<summary>M5 – Wie schreibe ich eine Middleware in Hono?</summary>

```ts
app.use("/admin/*", async (c, next) => {
  if (c.req.header("X-Admin-Token") !== adminToken) {
    return c.json({ error: "Nicht angemeldet" }, 401);
  }
  await next();
});
```

Doku: [Hono – Middleware](https://hono.dev/docs/guides/middleware)
</details>

<details>
<summary>M6 – Diagramme ohne Bibliothek?</summary>

Für einfache Balkendiagramme reicht CSS: ein `<div>` mit `style={{ width: `${prozent}%` }}`. Für mehr gibt es z. B. [Recharts](https://recharts.org/) – optional.
</details>

---

## Bewertungsraster (so schaue ich beim Review)

| Bereich | Gut | Sehr gut |
|---------|-----|----------|
| **Funktion** | Alle Stories funktionieren im Normalfall | Auch Grenzfälle (gleichzeitige Buchung, Zeitzonen, leere Daten) sind bedacht |
| **Typen** | Kein `any`, Schemas in `shared/` | Ungültige Zustände sind nicht darstellbar (Unions statt optionaler Felder) |
| **Struktur** | Server und Web sind aufgeteilt | Fachlogik ist komplett unabhängig von HTTP und React |
| **Tests** | 25+ Tests, alle grün | Tests beschreiben das Verhalten verständlich; Regressionstests für gefundene Fehler |
| **Fehler** | Keine Abstürze | Jeder Fehler hat eine hilfreiche Meldung; erwartbare vs. unerwartete Fehler sauber getrennt |
| **Lesbarkeit** | Konsistente Namen, formatiert | Kurze Funktionen, sprechende Typen, Kommentare erklären das *Warum* |

## Bonus-Ideen

- ⭐ E-Mail-Bestätigung simulieren: Statt zu versenden, landet die «E-Mail» in einer Datei `data/outbox/`.
- ⭐ Barber haben Pausen und freie Tage.
- ⭐⭐ Persistenz mit SQLite über das eingebaute [`node:sqlite`](https://nodejs.org/api/sqlite.html)-Modul.
- ⭐⭐ Deployment: Den Server als Docker-Container auf deinem Homeserver laufen lassen (und das Web mit `vite build` als statische Dateien ausliefern).
- ⭐⭐⭐ Echtzeit: Neue Buchungen erscheinen im Admin-Tagesplan ohne Neuladen (Server-Sent Events).

## Review

Sende mir an den ⭐-Meilensteinen deinen Stand (siehe [`REVIEW.md`](../../REVIEW.md)). Schreib dazu:

1. was fertig ist und was noch fehlt,
2. wo du unsicher bist oder was du anders gemacht hast als vorgeschlagen,
3. was du als Nächstes vorhast.

Viel Erfolg – du hast alles gelernt, was du dafür brauchst. 💪
