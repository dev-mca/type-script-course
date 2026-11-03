// Aufgabe 1 – Destructuring und Spread
// Tests: npm run test:watch -- l04-objekte-klassen/uebungen/01
//
// Regel für die ganze Datei: Eingaben werden NIE verändert.
// Jede Funktion liefert neue Objekte/Arrays zurück.

/**
 * 1.1 Vertauscht die zwei Werte eines Tupels.
 * swap([1, "a"]) → ["a", 1]
 * Hinweis: Array-Destructuring.
 */
export function swap<A, B>(pair: [A, B]): [B, A] {
  throw new Error("TODO: Aufgabe 1.1");
}

export type Settings = {
  theme: "light" | "dark";
  language: "de" | "en" | "fr";
  notifications: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  language: "de",
  notifications: true,
};

/**
 * 1.2 Ergänzt fehlende Einstellungen mit den Standardwerten.
 * withDefaults({ theme: "dark" }) → { theme: "dark", language: "de", notifications: true }
 *
 * Partial<Settings> heisst: alle Felder von Settings, aber jedes optional.
 * (Solche «Utility Types» lernst du in Lektion 10 kennen.)
 *
 * ★ Bonus-Test: withDefaults({ theme: undefined }) soll trotzdem "light" liefern.
 *   Mit reinem Spread klappt das nicht – warum? Wie löst du es?
 */
export function withDefaults(partial: Partial<Settings>): Settings {
  throw new Error("TODO: Aufgabe 1.2");
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  address?: { street: string; city: string };
  tags: string[];
};

export type PublicUser = Omit<User, "password">; // User ohne password

/**
 * 1.3 Entfernt das Passwort aus einem Benutzer (z. B. bevor er an den Browser geht).
 * Hinweis: Rest bei Objekten – const { password, ...rest } = user;
 */
export function toPublicUser(user: User): PublicUser {
  throw new Error("TODO: Aufgabe 1.3");
}

/**
 * 1.4 Liefert die Stadt eines Benutzers oder "unbekannt", wenn keine Adresse da ist.
 * Hinweis: ?. und ??
 */
export function getCity(user: User): string {
  throw new Error("TODO: Aufgabe 1.4");
}

/**
 * 1.5 Gibt einen neuen Benutzer mit geänderter Stadt zurück.
 * - Hat der Benutzer schon eine Adresse: nur die Stadt ändern, Strasse behalten.
 * - Hat er keine: Adresse mit street "" und der neuen Stadt anlegen.
 * Das Original (inklusive seines address-Objekts) darf sich NICHT verändern!
 */
export function moveToCity(user: User, city: string): User {
  throw new Error("TODO: Aufgabe 1.5");
}

/**
 * 1.6 Fügt ein Tag hinzu, falls es noch nicht vorhanden ist.
 * Ist es schon vorhanden, wird das UNVERÄNDERTE Original-Objekt zurückgegeben
 * (gleiche Referenz – praktisch für React, das so «nichts hat sich geändert» erkennt).
 */
export function addTag(user: User, tag: string): User {
  throw new Error("TODO: Aufgabe 1.6");
}
