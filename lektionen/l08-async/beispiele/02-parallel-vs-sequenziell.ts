// Ausführen: npx tsx lektionen/l08-async/beispiele/02-parallel-vs-sequenziell.ts

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Simuliert einen langsamen Datenbank- oder API-Aufruf
async function loadService(name: string): Promise<string> {
  await sleep(300);
  return `${name} geladen`;
}

async function sequential(): Promise<void> {
  const start = performance.now();
  const a = await loadService("Haarschnitt");
  const b = await loadService("Bart");
  const c = await loadService("Färben");
  console.log("Nacheinander:", [a, b, c], `${Math.round(performance.now() - start)} ms`);
}

async function parallel(): Promise<void> {
  const start = performance.now();
  const [a, b, c] = await Promise.all([
    loadService("Haarschnitt"),
    loadService("Bart"),
    loadService("Färben"),
  ]);
  console.log("Parallel:    ", [a, b, c], `${Math.round(performance.now() - start)} ms`);
}

async function withFailure(): Promise<void> {
  const failing = async () => {
    await sleep(100);
    throw new Error("Server down");
  };

  // Promise.all bricht beim ersten Fehler ab
  try {
    await Promise.all([loadService("A"), failing()]);
  } catch (error) {
    console.log("Promise.all:", (error as Error).message);
  }

  // Promise.allSettled sammelt alles
  const results = await Promise.allSettled([loadService("A"), failing()]);
  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log("  ✅", result.value);
    } else {
      console.log("  ❌", (result.reason as Error).message);
    }
  }
}

// Top-Level Await: In ES-Modulen darf await direkt auf oberster Ebene stehen
await sequential();
await parallel();
await withFailure();

// 🔧 Experiment: Was passiert, wenn du in `parallel` die drei Promises vorher in
// Variablen speicherst (const pa = loadService(...); …) und dann nacheinander
// awaitest (await pa; await pb; await pc)? Ist das parallel oder sequenziell? Warum?
