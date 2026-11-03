// Lösung Aufgabe 3 – Closures

export type Counter = {
  increment: () => number;
  decrement: () => number;
  value: () => number;
  reset: () => void;
};

export function createCounter(start = 0): Counter {
  let count = start; // privat – nur die vier Funktionen unten sehen diese Variable

  return {
    increment: () => ++count, // ++count erhöht ZUERST und gibt dann den neuen Wert zurück
    decrement: () => --count,
    value: () => count,
    reset: () => {
      count = start;
    },
  };
}

export function createIdGenerator(prefix: string): () => string {
  let next = 0;
  return () => {
    next++;
    return `${prefix}-${next}`;
  };
}

export function once<T>(fn: () => T): () => T {
  let called = false;
  let result: T;

  return () => {
    if (!called) {
      result = fn();
      called = true;
    }
    // TypeScript prüft über Closures hinweg nicht, ob result schon zugewiesen ist.
    // Wir wissen es dank `called` – darum ist das hier sicher.
    return result;
  };
}

export function memoize(fn: (n: number) => number): (n: number) => number {
  const cache = new Map<number, number>();

  return (n) => {
    const cached = cache.get(n);
    if (cached !== undefined) {
      // NICHT `if (cached)` – sonst würde das Ergebnis 0 nie aus dem Cache kommen
      return cached;
    }
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}
