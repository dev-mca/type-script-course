// Lösung Aufgabe 4 – Ein generischer Cache mit Ablaufzeit

export type CacheOptions = {
  ttlMs: number;
  now?: () => number;
};

type Entry<V> = { value: V; expiresAt: number };

export class TtlCache<K, V> {
  readonly #ttlMs: number;
  readonly #now: () => number;
  readonly #entries = new Map<K, Entry<V>>();

  constructor({ ttlMs, now = Date.now }: CacheOptions) {
    if (!(ttlMs > 0)) {
      throw new Error(`ttlMs muss grösser als 0 sein, war: ${ttlMs}`);
    }
    this.#ttlMs = ttlMs;
    this.#now = now;
  }

  set(key: K, value: V): void {
    this.#entries.set(key, { value, expiresAt: this.#now() + this.#ttlMs });
  }

  get(key: K): V | undefined {
    return this.#validEntry(key)?.value;
  }

  has(key: K): boolean {
    return this.#validEntry(key) !== undefined;
  }

  delete(key: K): boolean {
    return this.#entries.delete(key);
  }

  get size(): number {
    let count = 0;
    for (const key of [...this.#entries.keys()]) {
      if (this.#validEntry(key)) count++;
    }
    return count;
  }

  getOrCompute(key: K, compute: () => V): V {
    const entry = this.#validEntry(key);
    // Über den Eintrag prüfen, nicht über den Wert – sonst würden 0, null usw. neu berechnet
    if (entry) return entry.value;
    const value = compute();
    this.set(key, value);
    return value;
  }

  /** Liefert den Eintrag, wenn er existiert und gültig ist; räumt abgelaufene auf. */
  #validEntry(key: K): Entry<V> | undefined {
    const entry = this.#entries.get(key);
    if (!entry) return undefined;
    if (this.#now() >= entry.expiresAt) {
      this.#entries.delete(key);
      return undefined;
    }
    return entry;
  }
}
