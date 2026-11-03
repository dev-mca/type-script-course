// Aufgabe 3 – Wiederholen, Timeout, begrenzte Parallelität
// Tests: npm run test:watch -- l08-async/uebungen/03
//
// Drei Werkzeuge, die du in jeder echten Anwendung brauchst, die mit
// unzuverlässigen Netzwerken oder Servern spricht.

export type RetryOptions = {
  /** Wie oft nach dem ersten Fehlschlag erneut versucht wird (0 = kein Retry) */
  retries: number;
  /** Wartezeit vor dem ersten Retry in ms. Danach verdoppelt sie sich jedes Mal. */
  delayMs: number;
  /** Zum Testen austauschbar. Standard: echtes Warten mit setTimeout. */
  sleep?: (ms: number) => Promise<void>;
};

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 3.1 Ruft fn auf. Schlägt es fehl, wird nach einer Pause erneut versucht –
 * höchstens `retries` Mal. Die Pausen verdoppeln sich («exponential backoff»):
 *   retries: 3, delayMs: 100  →  Pausen 100, 200, 400
 *
 * Gelingt ein Versuch, wird sein Ergebnis geliefert.
 * Scheitern alle Versuche, wird der Fehler des LETZTEN Versuchs weitergeworfen.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  { retries, delayMs, sleep = realSleep }: RetryOptions,
): Promise<T> {
  throw new Error("TODO: Aufgabe 3.1");
}

/** Fehler, der bei einer Zeitüberschreitung geworfen wird */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Zeitüberschreitung nach ${ms} ms`);
    this.name = "TimeoutError";
  }
}

/**
 * 3.2 Wartet höchstens `ms` Millisekunden auf das Promise.
 * - Ist es rechtzeitig fertig: sein Ergebnis (oder sein Fehler) wird weitergegeben.
 * - Sonst: Promise wird mit einem TimeoutError rejected.
 *
 * Hinweis: Promise.race mit einem zweiten Promise, das nach ms rejected.
 * ★ Räume den Timer auf (clearTimeout), sobald das Original fertig ist – sonst
 *   hält ein vergessener Timer z. B. einen Node-Prozess am Leben.
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Wendet fn auf alle Elemente an, aber höchstens `limit` gleichzeitig.
 * Das Ergebnis hat die Reihenfolge der Eingabe.
 *
 * Wozu? Wenn du 1000 Bilder hochladen willst, startest du nicht 1000 Uploads
 * gleichzeitig (der Server würde dich blockieren) – sondern z. B. immer 5.
 *
 * Ein bewährter Ansatz: Starte `limit` «Worker». Jeder Worker holt sich in einer
 * Schleife den nächsten noch nicht bearbeiteten Index, bis keiner mehr übrig ist.
 * Am Ende wartest du mit Promise.all auf alle Worker.
 * (Da JavaScript nur einen Thread hat, brauchst du kein Lock für den gemeinsamen Index!)
 *
 * limit < 1 → Error. Schlägt ein Aufruf fehl, schlägt das Ganze fehl.
 */
export async function mapWithConcurrency<T, U>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<U>,
): Promise<U[]> {
  throw new Error("TODO: Aufgabe 3.3");
}
