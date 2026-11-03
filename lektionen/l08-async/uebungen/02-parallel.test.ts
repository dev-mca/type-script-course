import { describe, expect, it } from "vitest";
import {
  fastestSuccessful,
  loadAllParallel,
  loadAllSequential,
  loadAllSettled,
} from "./02-parallel";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Ein Test-Loader, der mitzählt, wie viele Aufrufe gleichzeitig laufen.
 * Die Dauer pro ID ist festgelegt – so sind manche schneller als andere.
 */
function createTrackingLoader(durations: Record<string, number>, failing: string[] = []) {
  let running = 0;
  let maxRunning = 0;
  const startOrder: string[] = [];

  async function load(id: string): Promise<string> {
    startOrder.push(id);
    running++;
    maxRunning = Math.max(maxRunning, running);
    try {
      await sleep(durations[id] ?? 10);
      if (failing.includes(id)) throw new Error(`${id} fehlgeschlagen`);
      return `Daten ${id}`;
    } finally {
      running--;
    }
  }

  return { load, stats: () => ({ maxRunning, startOrder }) };
}

describe("2.1 loadAllParallel", () => {
  it("lädt gleichzeitig und behält die Reihenfolge", async () => {
    const { load, stats } = createTrackingLoader({ a: 60, b: 10, c: 30 });
    const start = performance.now();
    expect(await loadAllParallel(["a", "b", "c"], load)).toEqual(["Daten a", "Daten b", "Daten c"]);
    expect(stats().maxRunning).toBe(3);
    expect(performance.now() - start).toBeLessThan(100 + 50); // nicht 60+10+30 nacheinander
  });

  it("schlägt fehl, wenn ein Aufruf fehlschlägt", async () => {
    const { load } = createTrackingLoader({}, ["b"]);
    await expect(loadAllParallel(["a", "b"], load)).rejects.toThrow("b fehlgeschlagen");
  });

  it("funktioniert mit leerer Liste", async () => {
    const { load } = createTrackingLoader({});
    expect(await loadAllParallel([], load)).toEqual([]);
  });
});

describe("2.2 loadAllSequential", () => {
  it("lädt nacheinander", async () => {
    const { load, stats } = createTrackingLoader({ a: 20, b: 5, c: 10 });
    expect(await loadAllSequential(["a", "b", "c"], load)).toEqual([
      "Daten a",
      "Daten b",
      "Daten c",
    ]);
    expect(stats().maxRunning).toBe(1);
    expect(stats().startOrder).toEqual(["a", "b", "c"]);
  });

  it("bricht beim ersten Fehler ab", async () => {
    const { load, stats } = createTrackingLoader({}, ["b"]);
    await expect(loadAllSequential(["a", "b", "c"], load)).rejects.toThrow("b fehlgeschlagen");
    expect(stats().startOrder).toEqual(["a", "b"]); // c wurde gar nicht mehr gestartet
  });
});

describe("2.3 loadAllSettled", () => {
  it("sammelt Werte und Fehler", async () => {
    const { load, stats } = createTrackingLoader({ a: 30, b: 10, c: 20, d: 5 }, ["b", "d"]);
    expect(await loadAllSettled(["a", "b", "c", "d"], load)).toEqual({
      values: ["Daten a", "Daten c"],
      errors: ["b fehlgeschlagen", "d fehlgeschlagen"],
    });
    expect(stats().maxRunning).toBe(4);
  });

  it("wandelt Nicht-Error-Gründe in Strings um", async () => {
    const load = async (id: string): Promise<string> => {
      if (id === "x") throw "kaputt"; // schlechter Stil, kommt aber vor
      return id;
    };
    expect(await loadAllSettled(["x", "y"], load)).toEqual({ values: ["y"], errors: ["kaputt"] });
  });
});

describe("2.4 fastestSuccessful", () => {
  it("liefert die schnellste erfolgreiche Quelle", async () => {
    const result = await fastestSuccessful([
      async () => {
        await sleep(50);
        return "langsam";
      },
      async () => {
        await sleep(5);
        throw new Error("schnell, aber kaputt");
      },
      async () => {
        await sleep(20);
        return "mittel";
      },
    ]);
    expect(result).toBe("mittel");
  });

  it("wirft, wenn alle scheitern", async () => {
    const fail = async (): Promise<string> => {
      throw new Error("nein");
    };
    await expect(fastestSuccessful([fail, fail])).rejects.toThrow("Alle Quellen fehlgeschlagen");
  });
});
