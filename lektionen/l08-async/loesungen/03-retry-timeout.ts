// Lösung Aufgabe 3 – Wiederholen, Timeout, begrenzte Parallelität

export type RetryOptions = {
  retries: number;
  delayMs: number;
  sleep?: (ms: number) => Promise<void>;
};

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  { retries, delayMs, sleep = realSleep }: RetryOptions,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await sleep(delayMs * 2 ** (attempt - 1)); // 1., 2., 4. … × delayMs
    }
    try {
      return await fn(); // «return await» – sonst würde catch den Fehler nicht sehen
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Zeitüberschreitung nach ${ms} ms`);
    this.name = "TimeoutError";
  }
}

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer); // läuft in jedem Fall – Erfolg, Fehler oder Timeout
  }
}

export async function mapWithConcurrency<T, U>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(`limit muss mindestens 1 sein, war: ${limit}`);
  }

  const results = new Array<U>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    // Kein Lock nötig: Zwischen dem Lesen und Erhöhen von nextIndex kann
    // kein anderer Code laufen – nur bei await wird unterbrochen.
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index]!, index);
    }
  }

  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}
