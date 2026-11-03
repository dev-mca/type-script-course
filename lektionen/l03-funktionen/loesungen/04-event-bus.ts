// Lösung Aufgabe 4 – Ein Event-Bus mit Callbacks

export type Handler = (payload: string) => void;
export type Unsubscribe = () => void;

export type EventBus = {
  on: (event: string, handler: Handler) => Unsubscribe;
  once: (event: string, handler: Handler) => Unsubscribe;
  emit: (event: string, payload: string) => void;
  listenerCount: (event: string) => number;
};

// Jede Anmeldung bekommt ein eigenes Objekt. So kann sie per === eindeutig
// gefunden werden – auch wenn derselbe Handler mehrfach angemeldet ist.
type Registration = { handler: Handler };

export function createEventBus(): EventBus {
  const registrations = new Map<string, Registration[]>();

  function on(event: string, handler: Handler): Unsubscribe {
    const registration: Registration = { handler };
    const list = registrations.get(event) ?? [];
    list.push(registration);
    registrations.set(event, list);

    // Closure über event und registration
    return () => {
      const current = registrations.get(event);
      if (!current) return;
      const index = current.indexOf(registration);
      if (index !== -1) {
        current.splice(index, 1); // genau diesen einen Eintrag entfernen
      }
    };
  }

  function once(event: string, handler: Handler): Unsubscribe {
    const unsubscribe = on(event, (payload) => {
      unsubscribe(); // sich selbst abmelden – zuerst, falls handler wirft
      handler(payload);
    });
    return unsubscribe;
  }

  function emit(event: string, payload: string): void {
    const list = registrations.get(event) ?? [];
    // Über eine Kopie iterieren: Abmeldungen während des Durchlaufs
    // verändern so nicht die Liste, über die wir gerade laufen.
    for (const { handler } of [...list]) {
      handler(payload);
    }
  }

  function listenerCount(event: string): number {
    return registrations.get(event)?.length ?? 0;
  }

  // Kurzschreibweise: { on } bedeutet { on: on }
  return { on, once, emit, listenerCount };
}
