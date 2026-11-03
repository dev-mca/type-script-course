// Lösung Aufgabe 2 – Parallel oder nacheinander?

export async function loadAllParallel<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<T[]> {
  // map startet ALLE Aufrufe sofort; Promise.all wartet auf alle
  // und behält die Reihenfolge der Eingabe bei.
  return Promise.all(ids.map((id) => load(id)));
}

export async function loadAllSequential<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<T[]> {
  const results: T[] = [];
  for (const id of ids) {
    results.push(await load(id)); // wartet, bevor die Schleife weiterläuft
  }
  return results;
}

export type SettledSummary<T> = { values: T[]; errors: string[] };

export async function loadAllSettled<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<SettledSummary<T>> {
  const results = await Promise.allSettled(ids.map((id) => load(id)));
  const summary: SettledSummary<T> = { values: [], errors: [] };
  for (const result of results) {
    if (result.status === "fulfilled") {
      summary.values.push(result.value);
    } else {
      const reason: unknown = result.reason;
      summary.errors.push(reason instanceof Error ? reason.message : String(reason));
    }
  }
  return summary;
}

export async function fastestSuccessful<T>(sources: ReadonlyArray<() => Promise<T>>): Promise<T> {
  try {
    return await Promise.any(sources.map((source) => source()));
    // «return await» statt «return»: nur so fängt das catch unten den Fehler ab!
  } catch {
    throw new Error("Alle Quellen fehlgeschlagen");
  }
}
