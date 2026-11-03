// Aufgabe 4 – Ein Event-Bus mit Callbacks
// Tests: npm run test:watch -- l03-funktionen/uebungen/04
//
// Ein Event-Bus ist ein «Briefkasten» für Ereignisse: Teile eines Programms
// melden Interesse an einem Ereignis an (on), andere lösen es aus (emit).
// Genau so funktionieren Klick-Handler im Browser, Node.js-Streams und viele UIs.
//
// Ziel: Nur mit Funktionen und Closures – keine Klasse!

/** Eine Funktion, die bei einem Ereignis mit einem Text aufgerufen wird */
export type Handler = (payload: string) => void;

/** Ruft man diese Funktion auf, wird der Handler wieder abgemeldet */
export type Unsubscribe = () => void;

export type EventBus = {
  /** Meldet handler für event an. Gibt eine Funktion zum Abmelden zurück. */
  on: (event: string, handler: Handler) => Unsubscribe;

  /** Wie on, aber der Handler meldet sich nach dem ersten Aufruf selbst ab. */
  once: (event: string, handler: Handler) => Unsubscribe;

  /** Ruft alle Handler für event in Anmelde-Reihenfolge mit payload auf. */
  emit: (event: string, payload: string) => void;

  /** Anzahl aktuell angemeldeter Handler für event. */
  listenerCount: (event: string) => number;
};

/**
 * Regeln:
 * - Wird derselbe Handler zweimal angemeldet, wird er auch zweimal aufgerufen.
 * - Die Unsubscribe-Funktion entfernt nur DIESE eine Anmeldung.
 * - Unsubscribe zweimal aufrufen ist kein Fehler (passiert einfach nichts).
 * - emit für ein Ereignis ohne Handler ist kein Fehler.
 * - ★ Meldet sich ein Handler WÄHREND emit ab (z. B. bei once), sollen die
 *   anderen Handler trotzdem alle aufgerufen werden.
 *   Tipp: über eine Kopie der Liste iterieren: for (const h of [...handlers])
 *
 * Hinweis zur Datenstruktur: Record<string, Handler[]> oder Map<string, Handler[]>.
 * Zum Entfernen eines bestimmten Eintrags: indexOf + splice. Damit wirklich nur die
 * eigene Anmeldung entfernt wird, lohnt es sich, pro Anmeldung ein eigenes kleines
 * Objekt zu speichern (z. B. { handler }) und dieses per === zu suchen.
 */
export function createEventBus(): EventBus {
  throw new Error("TODO: Aufgabe 4");
}
