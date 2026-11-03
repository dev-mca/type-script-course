import { describe, expect, it, vi } from "vitest";
import { TimeoutError, mapWithConcurrency, retry, withTimeout } from "./03-retry-timeout";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Eine falsche sleep-Funktion: wartet nicht, merkt sich aber die gewünschten Pausen */
function createFakeSleep() {
  const pauses: number[] = [];
  const fakeSleep = async (ms: number) => {
    pauses.push(ms);
  };
  return { fakeSleep, pauses };
}

/** Eine Funktion, die die ersten n Male fehlschlägt */
function failTimes(n: number) {
  let calls = 0;
  return vi.fn(async () => {
    calls++;
    if (calls <= n) throw new Error(`Versuch ${calls} fehlgeschlagen`);
    return `Erfolg bei Versuch ${calls}`;
  });
}

describe("3.1 retry", () => {
  it("liefert direkt das Ergebnis, wenn der erste Versuch klappt", async () => {
    const { fakeSleep, pauses } = createFakeSleep();
    const fn = failTimes(0);
    expect(await retry(fn, { retries: 3, delayMs: 100, sleep: fakeSleep })).toBe(
      "Erfolg bei Versuch 1",
    );
    expect(fn).toHaveBeenCalledTimes(1);
    expect(pauses).toEqual([]);
  });

  it("versucht es erneut, mit verdoppelten Pausen", async () => {
    const { fakeSleep, pauses } = createFakeSleep();
    const fn = failTimes(2);
    expect(await retry(fn, { retries: 3, delayMs: 100, sleep: fakeSleep })).toBe(
      "Erfolg bei Versuch 3",
    );
    expect(fn).toHaveBeenCalledTimes(3);
    expect(pauses).toEqual([100, 200]);
  });

  it("wirft den letzten Fehler, wenn alle Versuche scheitern", async () => {
    const { fakeSleep, pauses } = createFakeSleep();
    const fn = failTimes(10);
    await expect(retry(fn, { retries: 3, delayMs: 50, sleep: fakeSleep })).rejects.toThrow(
      "Versuch 4 fehlgeschlagen",
    );
    expect(fn).toHaveBeenCalledTimes(4); // 1 + 3 Retries
    expect(pauses).toEqual([50, 100, 200]);
  });

  it("macht bei retries: 0 genau einen Versuch", async () => {
    const { fakeSleep } = createFakeSleep();
    const fn = failTimes(1);
    await expect(retry(fn, { retries: 0, delayMs: 50, sleep: fakeSleep })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("wartet ohne sleep-Option wirklich", async () => {
    const start = performance.now();
    await retry(failTimes(1), { retries: 1, delayMs: 30 });
    expect(performance.now() - start).toBeGreaterThanOrEqual(25);
  });
});

describe("3.2 withTimeout", () => {
  it("liefert das Ergebnis, wenn es rechtzeitig kommt", async () => {
    const fast = sleep(10).then(() => "fertig");
    await expect(withTimeout(fast, 200)).resolves.toBe("fertig");
  });

  it("reicht Fehler des Originals durch", async () => {
    const failing = sleep(10).then(() => {
      throw new Error("Original-Fehler");
    });
    await expect(withTimeout(failing, 200)).rejects.toThrow("Original-Fehler");
  });

  it("wirft einen TimeoutError, wenn es zu lange dauert", async () => {
    const slow = sleep(300).then(() => "zu spät");
    const start = performance.now();
    await expect(withTimeout(slow, 30)).rejects.toBeInstanceOf(TimeoutError);
    expect(performance.now() - start).toBeLessThan(200);
  });
});

describe("3.3 mapWithConcurrency", () => {
  it("behält die Reihenfolge und begrenzt die Parallelität", async () => {
    let running = 0;
    let maxRunning = 0;
    const durations = [40, 10, 30, 5, 20, 15, 25];

    const result = await mapWithConcurrency(durations, 3, async (ms, index) => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await sleep(ms);
      running--;
      return `#${index}:${ms}`;
    });

    expect(result).toEqual(["#0:40", "#1:10", "#2:30", "#3:5", "#4:20", "#5:15", "#6:25"]);
    expect(maxRunning).toBe(3);
  });

  it("nutzt die Parallelität auch aus", async () => {
    const start = performance.now();
    await mapWithConcurrency([50, 50, 50, 50], 4, (ms) => sleep(ms));
    expect(performance.now() - start).toBeLessThan(150); // nicht 4 × 50 nacheinander
  });

  it("funktioniert, wenn limit grösser als die Liste ist", async () => {
    expect(await mapWithConcurrency([1, 2], 10, async (x) => x * 2)).toEqual([2, 4]);
    expect(await mapWithConcurrency([], 2, async (x) => x)).toEqual([]);
  });

  it("schlägt fehl, wenn ein Aufruf fehlschlägt", async () => {
    await expect(
      mapWithConcurrency([1, 2, 3], 2, async (x) => {
        if (x === 2) throw new Error("zwei geht nicht");
        return x;
      }),
    ).rejects.toThrow("zwei geht nicht");
  });

  it("verlangt ein limit ≥ 1", async () => {
    await expect(mapWithConcurrency([1], 0, async (x) => x)).rejects.toThrow();
  });
});
