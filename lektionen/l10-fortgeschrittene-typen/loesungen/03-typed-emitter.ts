// Lösung Aufgabe 3 – Ein typsicherer Event-Emitter

export type EventMap = Record<string, unknown>;

export type Handler<P> = (payload: P) => void;

export type TypedEmitter<Events extends EventMap> = {
  on<K extends keyof Events>(event: K, handler: Handler<Events[K]>): () => void;
  emit<K extends keyof Events>(event: K, payload: Events[K]): void;
  listenerCount(event: keyof Events): number;
  clear(event?: keyof Events): void;
};

export function createTypedEmitter<Events extends EventMap>(): TypedEmitter<Events> {
  // Ein Set pro Ereignis. Hinweis: Ein Set speichert denselben Handler nur einmal.
  // Darum wickeln wir jeden Handler in ein eigenes Objekt – so funktioniert auch
  // das doppelte Anmelden desselben Handlers (wie in Lektion 3).
  const handlers = new Map<keyof Events, Set<{ handler: Handler<never> }>>();

  return {
    on(event, handler) {
      const entry = { handler: handler as Handler<never> };
      const set = handlers.get(event) ?? new Set();
      set.add(entry);
      handlers.set(event, set);
      return () => {
        handlers.get(event)?.delete(entry);
      };
    },

    emit(event, payload) {
      // Kopie, damit Abmeldungen während emit die Schleife nicht stören
      for (const { handler } of [...(handlers.get(event) ?? [])]) {
        (handler as Handler<typeof payload>)(payload);
      }
    },

    listenerCount(event) {
      return handlers.get(event)?.size ?? 0;
    },

    clear(event) {
      if (event === undefined) {
        handlers.clear();
      } else {
        handlers.delete(event);
      }
    },
  };
}
