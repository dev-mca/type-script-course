// Ausführen: npx tsx lektionen/l05-unions-narrowing/beispiele/01-ladezustand.ts
//
// Ein typisches Muster aus jeder Web-App: der Zustand eines Ladevorgangs.

type LoadState<T> =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: T }
  | { status: "error"; message: string; retryable: boolean };

function assertNever(value: never): never {
  throw new Error(`Unbehandelter Fall: ${JSON.stringify(value)}`);
}

function render(state: LoadState<string[]>): string {
  switch (state.status) {
    case "idle":
      return "⏸  Noch nichts geladen";
    case "loading":
      return `⏳ Lädt seit ${Date.now() - state.startedAt} ms …`;
    case "success":
      return `✅ ${state.data.length} Termine: ${state.data.join(", ")}`;
    case "error":
      return `❌ ${state.message}${state.retryable ? " (nochmals versuchen?)" : ""}`;
    default:
      return assertNever(state);
  }
}

const states: LoadState<string[]>[] = [
  { status: "idle" },
  { status: "loading", startedAt: Date.now() - 120 },
  { status: "success", data: ["09:00", "10:30", "14:00"] },
  { status: "error", message: "Server nicht erreichbar", retryable: true },
];

for (const state of states) {
  console.log(render(state));
}

// 🔧 Experiment 1: Fahre in IntelliJ mit der Maus über `state` in jedem case.
// Welcher Typ wird jeweils angezeigt?
//
// 🔧 Experiment 2: Versuche im case "loading" auf state.data zuzugreifen.
// Lies die Fehlermeldung.
//
// 🔧 Experiment 3: Füge { status: "cancelled" } zur Union hinzu. Wo meckert der Compiler?
