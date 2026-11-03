# Lektion 12 – Frontend: DOM und React

> ⏱ **ca. 7–9 Stunden** (gern auf 2 Wochen verteilt) · Voraussetzung: Lektion 11 · Schwierigkeit: ●●●●○

## Darum geht's

Deine API aus Lektion 11 bekommt jetzt eine Oberfläche: eine Seite, auf der man Services sieht, Termine eines Tages anschaut, neue Termine bucht und alte löscht. Du baust sie **zweimal**:

1. **Teil A – mit purem TypeScript und den DOM-APIs des Browsers.** So verstehst du, was im Browser wirklich passiert.
2. **Teil B – mit React.** Und du wirst merken, wie viel Arbeit dir React abnimmt – und warum fast alle modernen Web-Apps (auch Dashboards wie eures) so gebaut sind.

Die eigentliche Logik (Formatierung, API-Zugriff, Zustandsverwaltung) schreibst du vorher als **reine, getestete Funktionen** (Aufgaben 1–3). Beide Oberflächen verwenden dieselben Funktionen. Das ist ein wichtiges Prinzip: **Die Oberfläche ist dünn, die Logik ist testbar.**

**Nach dieser Lektion kannst du:**

- mit Vite eine TypeScript-Webseite entwickeln
- DOM-Elemente typsicher finden, erzeugen und auf Ereignisse reagieren
- einen typisierten API-Client mit Validierung schreiben
- React-Komponenten mit typisierten Props, `useReducer` und `useEffect` bauen
- Frontend und Backend lokal zusammen laufen lassen

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | ✍️ Üben | Aufgabe 1 `formatierung.ts` (Aufwärmen) | 30 min |
| 2 | 📖 Lesen | Abschnitt 1 (Vite) + Abschnitt 2 (DOM) | 30 min |
| 3 | ✍️ Üben | Aufgabe 2 `api-client.ts` | 60 min |
| 4 | ✍️ Teil A | `dom-app/main.ts` – Schritte A1–A4 | 90 min |
| 5 | 📖 Lesen | Abschnitt 3 (React) | 40 min |
| 6 | 🌐 Doku | react.dev «Quick Start» + «Thinking in React» | 45 min |
| 7 | ✍️ Üben | Aufgabe 3 `buchung-state.ts` (Reducer) | 60 min |
| 8 | ✍️ Teil B | `react-app/` – Schritte B1–B4 | 120 min |
| 9 | ✅ Abschluss | Vergleich DOM vs. React, Selbstcheck | 20 min |

---

## 1. Vite – TypeScript im Browser

Browser verstehen kein TypeScript und keine `import`s von npm-Paketen. **Vite** ist ein Entwicklungsserver und Build-Tool, das beides löst:

- `npm run web:dom` startet einen Server auf `http://localhost:5173`. Vite übersetzt jede `.ts`/`.tsx`-Datei beim Abruf blitzschnell.
- Speicherst du eine Datei, aktualisiert sich der Browser sofort (*Hot Module Replacement*).
- `npx vite build <ordner>` erzeugt optimierte Dateien für den Produktivbetrieb.

**Zwei Server, ein Ursprung:** Deine API läuft auf Port 3000, die Webseite auf 5173. Würde der Browser direkt `http://localhost:3000` aufrufen, käme die **CORS**-Sperre ins Spiel (der Recherche-Auftrag aus Lektion 11). Darum leitet Vite alle Anfragen an `/api/…` an Port 3000 weiter – schau dir `dom-app/vite.config.ts` an. Für den Browser kommt alles vom selben Server.

```text
Browser ──► Vite :5173 ──┬─► /index.html, /main.ts  (dein Frontend)
                         └─► /api/services  ──► Proxy ──► API :3000 /services
```

**Starten (zwei Terminals in IntelliJ):**

```bash
npm run api        # Terminal 1: API aus Lektion 11
npm run web:dom    # Terminal 2: Teil A   (oder: npm run web:react für Teil B)
```

> 💡 Öffne im Browser die **Entwicklertools (F12)**. Der Tab *Netzwerk* zeigt jede Anfrage an `/api`, der Tab *Konsole* Fehler und `console.log`-Ausgaben. Für Frontend-Arbeit sind sie so wichtig wie der Debugger in IntelliJ.

In `tsconfig.json` dieser Lektion steht übrigens `"lib": ["es2024", "DOM", "DOM.Iterable"]` – erst dadurch kennt TypeScript `document`, `HTMLElement` und Co.

## 2. Der DOM mit TypeScript

Das **DOM** (*Document Object Model*) ist die Baumstruktur der HTML-Seite als Objekte. Du kannst sie lesen, verändern und auf Ereignisse reagieren.

### Elemente finden

```ts
const input = document.querySelector("#date");           // Element | null
input.value;                                             // ❌ 'input' is possibly 'null' / kein value auf Element

const date = document.querySelector<HTMLInputElement>("#date");  // HTMLInputElement | null
if (date) date.value = "2026-11-20";                     // ✅
```

TypeScript weiss nicht, welches Element zu `#date` gehört – und ob es überhaupt existiert. Darum der generische Typparameter und die `null`-Prüfung. In `main.ts` steht dafür ein kleiner Helfer `$<T>(selector)`.

### Elemente erzeugen

```ts
const li = document.createElement("li");    // HTMLLIElement – Typ aus dem Tag-Namen hergeleitet!
li.textContent = booking.customerName;      // ✅ sicher
li.innerHTML = booking.customerName;        // ⚠️ GEFÄHRLICH bei Benutzereingaben
list.append(li);
list.replaceChildren(...neueElemente);      // alles ersetzen
```

> ⚠️ **Sicherheit:** Setze Benutzereingaben **nie** mit `innerHTML` ein. Heisst ein Kunde `<img src=x onerror="alert('gehackt')">`, würde dieser Code im Browser jedes Besuchers ausgeführt (*Cross-Site Scripting, XSS*). `textContent` zeigt den Text immer nur als Text an. (React schützt dich davor übrigens automatisch.)

### Ereignisse

```ts
button.addEventListener("click", (event) => { … });           // event: MouseEvent
form.addEventListener("submit", (event) => {
  event.preventDefault();                                      // sonst lädt der Browser die Seite neu!
  const data = new FormData(form);
  const name = String(data.get("customerName") ?? "");
});
```

**`event.target` ist nur `EventTarget | null`** – TypeScript kann nicht wissen, welches Element geklickt wurde. Darum prüft man mit `instanceof`:

```ts
list.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement) {
    const id = event.target.dataset.id;   // liest das Attribut data-id="…"
  }
});
```

Das ist gleichzeitig das Muster **Event Delegation**: ein einziger Listener auf der Liste statt einer pro Button. Funktioniert auch für Buttons, die erst später eingefügt werden.

> 🌐 **Doku (Nachschlagen):** [MDN: Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

> ✍️ **Jetzt Aufgabe 2** (`uebungen/api-client.ts`), **dann Teil A** (`dom-app/main.ts`).

### Abnahme Teil A (manuell im Browser)

- [ ] Services werden als Karten angezeigt
- [ ] Datum wechseln lädt die passenden Termine
- [ ] Buchen funktioniert; der neue Termin erscheint in der Liste
- [ ] Doppelbuchung → verständliche Fehlermeldung; zu kurzer Name → Details vom Server
- [ ] Löschen funktioniert (mit Rückfrage)
- [ ] Keine Fehler in der Browser-Konsole

---

## 3. React

Hast du Teil A gemacht, kennst du das Problem: Jedes Mal, wenn sich Daten ändern, musst du **von Hand** herausfinden, welche Elemente du anpassen musst (`replaceChildren`, `className`, `disabled` …). Bei einer grösseren App wird das schnell unübersichtlich.

React dreht das um: Du beschreibst, **wie die Oberfläche für einen bestimmten Zustand aussehen soll**. Ändert sich der Zustand, rechnet React selbst aus, was im DOM zu tun ist.

```text
     Zustand (state)  ──►  Komponenten (Funktionen)  ──►  JSX  ──►  React aktualisiert das DOM
          ▲                                                                   │
          └──────────────────── Ereignis (Klick, Eingabe) ◄───────────────────┘
```

Wenn du JavaFX oder Swing kennst: Statt Controls zu erzeugen und später ihre Eigenschaften zu setzen, schreibst du eine Funktion, die für einen Zustand **die ganze Ansicht neu beschreibt**.

### Komponenten und JSX

```tsx
type GreetingProps = { name: string; visits?: number };

export function Greeting({ name, visits = 0 }: GreetingProps) {
  return (
    <p className="muted">                       {/* className statt class */}
      Hallo {name}!                             {/* {…} = beliebiger TS-Ausdruck */}
      {visits > 0 && <strong> Willkommen zurück</strong>}
    </p>
  );
}

<Greeting name="Melih" visits={3} />            // Verwendung – Props werden vom Compiler geprüft
```

- Eine Komponente ist eine **Funktion**, die Props bekommt und JSX zurückgibt. Ihr Name beginnt mit einem Grossbuchstaben.
- **JSX** sieht aus wie HTML, ist aber TypeScript: Attribute heissen `className`, `onClick`, Werte in `{ }`.
- Listen mit `.map()`, jedes Element braucht einen eindeutigen `key`.
- Bedingungen mit `&&`, `? :` oder frühem `return`.

### Zustand: `useState` und `useReducer`

```tsx
const [count, setCount] = useState(0);         // Typ number wird hergeleitet
<button onClick={() => setCount(count + 1)}>{count}</button>
```

Für eine ganze Seite mit vielen zusammenhängenden Werten ist **`useReducer`** übersichtlicher. Den Reducer – eine reine Funktion `(state, action) => newState` – schreibst und testest du in Aufgabe 3 ohne React. In der Komponente:

```tsx
const [state, dispatch] = useReducer(pageReducer, today, initialState);
dispatch({ type: "dateChanged", date: "2026-11-21" });   // Aktionen sind typsicher (Discriminated Union!)
```

**Regel Nummer 1 in React:** Zustand wird **nie verändert**, sondern immer ersetzt – genau die unveränderlichen Updates aus Lektion 4. React erkennt Änderungen am neuen Objekt (`alt !== neu`).

### Effekte: `useEffect`

Alles, was «nach aussen» geht – Daten laden, Timer, Event-Listener auf `window` –, gehört in einen Effekt:

```tsx
useEffect(() => {
  let cancelled = false;
  api.getBookings(date).then((bookings) => {
    if (!cancelled) dispatch({ type: "bookingsLoaded", bookings });
  });
  return () => { cancelled = true; };   // Aufräumen: läuft vor dem nächsten Effekt
}, [date]);                              // Abhängigkeiten: Effekt läuft erneut, wenn sich date ändert
```

Das `cancelled`-Flag verhindert, dass eine **langsame alte Antwort** eine neuere überschreibt (wählt jemand schnell nacheinander zwei Daten). Ein klassischer Fehler, den viele Apps haben.

> 💡 Im Entwicklungsmodus führt React mit `<StrictMode>` Effekte absichtlich **zweimal** aus, um vergessenes Aufräumen sichtbar zu machen. Siehst du jede Anfrage doppelt im Netzwerk-Tab: Das ist Absicht.

### Formulare: kontrollierte Eingaben

```tsx
<input
  value={form.customerName}                                    // Wert kommt aus dem State
  onChange={(event) => onChange("customerName", event.target.value)}  // Änderung geht in den State
/>
```

Fahr in IntelliJ über `event`: TypeScript kennt den Typ `React.ChangeEvent<HTMLInputElement>` – darum ist `event.target.value` hier ohne `instanceof` verfügbar.

> 🌐 **Jetzt in der Doku lesen (45 min):** [react.dev – Quick Start](https://react.dev/learn) (ganz) und [Thinking in React](https://react.dev/learn/thinking-in-react). Danach [Using TypeScript](https://react.dev/learn/typescript) überfliegen.

> ✍️ **Jetzt Aufgabe 3** (`uebungen/buchung-state.ts`), **dann Teil B** (`react-app/`).

### Teil B – Schritte

| Schritt | Datei | Was |
|---------|-------|-----|
| B0 | `src/components/ServiceList.tsx` | ✅ vorgegeben – lies sie genau |
| B1 | `src/App.tsx` | Buchungen laden, wenn sich das Datum ändert (`useEffect`) |
| B2 | `src/components/BookingList.tsx` | Liste mit Lade-/Fehler-/Leerzustand und Löschen-Button |
| B3 | `src/components/NewBookingForm.tsx` + `handleSubmit` in `App.tsx` | Kontrolliertes Formular, Validierung, Buchen |
| B4 | `handleDelete` in `App.tsx` | Löschen |

### Abnahme Teil B

- [ ] Dieselben Punkte wie bei Teil A
- [ ] Ein zu kurzer Name wird **schon im Browser** abgefangen (`validateForm`), ohne Anfrage an den Server
- [ ] Der Button zeigt während des Buchens einen Ladezustand
- [ ] Schnelles Wechseln des Datums zeigt nie Termine des falschen Tages

---

## 4. ✍️ Übersicht der Übungen

```bash
npm run test:watch -- l12
npx tsc --noEmit -p lektionen/l12-frontend
```

| Nr | Datei | Thema | Prüfung | ★ |
|----|-------|-------|---------|---|
| 1 | `uebungen/formatierung.ts` | Formatieren, Gruppieren | Tests | ★☆☆ |
| 2 | `uebungen/api-client.ts` | typisierter API-Client mit Zod | Tests | ★★★ |
| 3 | `uebungen/buchung-state.ts` | Reducer, Formularvalidierung | Tests | ★★★ |
| A | `dom-app/main.ts` | DOM, Events, Event Delegation | Browser | ★★☆ |
| B | `react-app/src/…` | React-Komponenten, Hooks | Browser | ★★★ |

Die Musterlösungen für Teil A und B lassen sich direkt starten – praktisch, um zu sehen, wie es am Ende aussehen soll:

```bash
npx vite lektionen/l12-frontend/loesungen/dom-app
npx vite lektionen/l12-frontend/loesungen/react-app
```

> 🔍 **Recherche-Auftrag:** Wie würdest du `formatDate` mit [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) und der Locale `"de-CH"` umsetzen? Was ist der Vorteil, was der Nachteil gegenüber der eigenen Version?

### 🪞 Reflexion (schreib es in `FORTSCHRITT.md`)

Vergleiche `dom-app/main.ts` mit deiner React-Version: Wie viele Zeilen? Wo musstest du in der DOM-Version an «das Aktualisieren» denken, wo nicht in React? Was war in welcher Version leichter zu debuggen?

---

## 5. ✅ Selbstcheck

<details>
<summary>1. Warum liefert <code>document.querySelector("#x")</code> <code>Element | null</code>?</summary>

TypeScript kann HTML nicht lesen: Es weiss weder, ob ein Element mit dieser ID existiert, noch welcher Typ es ist. Darum die Null-Prüfung und der Typparameter `querySelector<HTMLInputElement>(…)`.
</details>

<details>
<summary>2. Warum ist <code>innerHTML = eingabe</code> gefährlich?</summary>

Der Browser interpretiert den Text als HTML. Enthält er Script-Code (z. B. in einem `onerror`-Attribut), wird dieser ausgeführt (XSS). `textContent` ist sicher.
</details>

<details>
<summary>3. Was macht der Vite-Proxy, und warum brauchen wir ihn?</summary>

Er leitet Anfragen an `/api/…` an den API-Server weiter. So kommen Frontend und API für den Browser vom selben Ursprung, und CORS-Einschränkungen greifen nicht.
</details>

<details>
<summary>4. Wofür ist die Aufräumfunktion in <code>useEffect</code> da?</summary>

Sie läuft, bevor der Effekt erneut ausgeführt wird oder die Komponente verschwindet. Damit kann man z. B. veraltete Antworten ignorieren, Timer stoppen oder Listener entfernen.
</details>

<details>
<summary>5. Warum darf man den State in React nicht direkt verändern?</summary>

React erkennt Änderungen über neue Referenzen. Wird ein Objekt verändert statt ersetzt, bleibt die Referenz gleich – React merkt nichts und aktualisiert die Oberfläche nicht.
</details>

## 6. Weiterführend (optional)

- [react.dev – You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) – sehr lehrreich, sobald du die Grundlagen hast
- [Testing Library – React](https://testing-library.com/docs/react-testing-library/intro/) – wie man Komponenten testet (mit Vitest und `jsdom`)
- [TanStack Query](https://tanstack.com/query/latest) – die verbreitetste Bibliothek fürs Laden von Server-Daten in React (Caching, Wiederholen, Ladezustände)
- [Vite Guide](https://vite.dev/guide/)

---

### Abschluss-Checkliste

- [ ] Aufgaben 1–3: alle Tests grün
- [ ] Teil A und Teil B im Browser abgenommen
- [ ] Reflexion in `FORTSCHRITT.md`
- [ ] `FORTSCHRITT.md` aktualisiert und committet

🎓 **Jetzt kommt das [Abschlussprojekt](../../projekte/abschlussprojekt/README.md)!**
