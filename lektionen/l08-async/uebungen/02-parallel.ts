// Aufgabe 2 – Parallel oder nacheinander?
// Tests: npm run test:watch -- l08-async/uebungen/02
//
// In allen Funktionen ist `load` eine asynchrone Funktion, die einen Datensatz
// lädt (im echten Leben: ein API- oder Datenbank-Aufruf).

/**
 * 2.1 Lädt alle IDs GLEICHZEITIG. Das Ergebnis hat die Reihenfolge der IDs –
 * egal, welcher Aufruf zuerst fertig ist.
 * Schlägt ein Aufruf fehl, schlägt die ganze Funktion fehl.
 */
export async function loadAllParallel<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<T[]> {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * 2.2 Lädt alle IDs NACHEINANDER: Der nächste Aufruf startet erst, wenn der
 * vorherige fertig ist. (Nötig z. B., wenn ein Server keine parallelen Anfragen erlaubt.)
 */
export async function loadAllSequential<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<T[]> {
  throw new Error("TODO: Aufgabe 2.2");
}

export type SettledSummary<T> = { values: T[]; errors: string[] };

/**
 * 2.3 Lädt alle IDs gleichzeitig, bricht bei Fehlern aber NICHT ab.
 * Liefert die erfolgreichen Werte (in ID-Reihenfolge) und die Fehlermeldungen
 * (ebenfalls in ID-Reihenfolge). Ist ein Fehler kein Error-Objekt, verwende String(reason).
 *
 * Hinweis: Promise.allSettled
 */
export async function loadAllSettled<T>(
  ids: readonly string[],
  load: (id: string) => Promise<T>,
): Promise<SettledSummary<T>> {
  throw new Error("TODO: Aufgabe 2.3");
}

/**
 * 2.4 Fragt mehrere Quellen gleichzeitig an (z. B. mehrere Spiegelserver) und liefert
 * das Ergebnis der SCHNELLSTEN ERFOLGREICHEN. Scheitern alle, wird ein Error mit der
 * Meldung "Alle Quellen fehlgeschlagen" geworfen.
 *
 * Hinweis: Promise.any wirft bei lauter Fehlern einen AggregateError – fang ihn ab
 * und wirf stattdessen deinen eigenen Error.
 */
export async function fastestSuccessful<T>(sources: ReadonlyArray<() => Promise<T>>): Promise<T> {
  throw new Error("TODO: Aufgabe 2.4");
}
