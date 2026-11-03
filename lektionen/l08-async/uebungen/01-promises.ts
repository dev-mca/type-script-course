// Aufgabe 1 – Promises erzeugen und verwenden
// Tests: npm run test:watch -- l08-async/uebungen/01

/**
 * 1.1 Wartet `ms` Millisekunden.
 * Hinweis: new Promise((resolve) => setTimeout(resolve, ms))
 */
export function sleep(ms: number): Promise<void> {
  throw new Error("TODO: Aufgabe 1.1");
}

/**
 * 1.2 Liefert `value` nach `ms` Millisekunden.
 * Schreib die Funktion als async-Funktion und verwende dein sleep.
 */
export async function delay<T>(value: T, ms: number): Promise<T> {
  throw new Error("TODO: Aufgabe 1.2");
}

/** Eine Callback-Funktion im klassischen Node.js-Stil: (Fehler, Ergebnis) */
export type NodeCallback<T> = (error: Error | null, result?: T) => void;

/**
 * 1.3 Wandelt eine Callback-basierte Funktion in ein Promise um.
 * `start` bekommt einen Callback übergeben und ruft ihn irgendwann auf:
 *   - mit einem Error als erstem Argument → Promise wird rejected
 *   - mit null und einem Ergebnis          → Promise wird mit dem Ergebnis resolved
 *
 * Beispiel:
 *   const content = await fromCallback<string>((cb) => legacyReadFile("a.txt", cb));
 *
 * Hinweis: new Promise((resolve, reject) => { start((error, result) => { … }); })
 * Im Erfolgsfall ist result vom Typ T | undefined – verwende `result as T`.
 */
export function fromCallback<T>(start: (callback: NodeCallback<T>) => void): Promise<T> {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Liest eine «Konfiguration» über zwei asynchrone Schritte:
 *   1. const raw = await loadText()       – liefert einen JSON-String
 *   2. JSON.parse(raw)                    – kann werfen!
 *   3. Das Ergebnis muss ein Objekt mit einem number-Feld `port` sein
 *
 * Gibt den Port zurück. Bei jedem Problem (loadText schlägt fehl, ungültiges JSON,
 * port fehlt oder ist keine Zahl) wird ein Error mit einer Meldung geworfen, die
 * mit "Konfiguration ungültig: " beginnt.
 *
 * Tipp: Ein einziges try/catch um alles herum reicht – await verwandelt rejected
 * Promises in throw, darum fängt catch beides ab.
 */
export async function loadPort(loadText: () => Promise<string>): Promise<number> {
  throw new Error("TODO: Aufgabe 1.4");
}
