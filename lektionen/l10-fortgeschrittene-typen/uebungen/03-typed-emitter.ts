// Aufgabe 3 – Ein typsicherer Event-Emitter
// Tests: npm run test:watch -- l10-fortgeschrittene-typen/uebungen/03
//
// Erinnerst du dich an den Event-Bus aus Lektion 3? Dort war jeder Payload ein
// string. Jetzt wird es typsicher: Jedes Ereignis hat seinen EIGENEN Payload-Typ,
// und der Compiler prüft bei on() und emit(), dass alles zusammenpasst.
//
// Beispiel:
//   type BookingEvents = {
//     "booking:created": { id: string; customer: string };
//     "booking:cancelled": { id: string; reason: string };
//   };
//   const events = createTypedEmitter<BookingEvents>();
//   events.on("booking:created", (payload) => payload.customer);  // payload ist korrekt typisiert
//   events.emit("booking:cancelled", { id: "b1", reason: "krank" }); // ✅
//   events.emit("booking:cancelled", { id: "b1" });                  // ❌ reason fehlt
//   events.emit("booking:moved", {});                                // ❌ unbekanntes Ereignis
//
// Die Typen sind vorgegeben – du implementierst nur die Funktion.
// Die Typ-Prüfungen stehen in der Testdatei (@ts-expect-error).

export type EventMap = Record<string, unknown>;

export type Handler<P> = (payload: P) => void;

export type TypedEmitter<Events extends EventMap> = {
  /** Meldet einen Handler an und liefert eine Funktion zum Abmelden. */
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void;
  /** Ruft alle Handler des Ereignisses in Anmelde-Reihenfolge auf. */
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
  /** Anzahl Handler für ein Ereignis */
  listenerCount(event: keyof Events): number;
  /** Entfernt alle Handler eines Ereignisses – oder ohne Argument alle Handler überhaupt. */
  clear(event?: keyof Events): void;
};

/**
 * Tipp zur Implementierung: Speichere die Handler in einer
 *   Map<keyof Events, Set<Handler<never>>>
 * Handler<never> ist ein Trick: Jede Funktion (payload: X) => void ist an
 * (payload: never) => void zuweisbar. Beim Aufrufen in emit musst du dann
 * einmal casten: (handler as Handler<Events[K]>)(payload)
 * Das ist sicher, weil on() nur passende Handler zu einem Schlüssel einträgt.
 */
export function createTypedEmitter<Events extends EventMap>(): TypedEmitter<Events> {
  throw new Error("TODO: Aufgabe 3");
}
