// Lösung Aufgabe 1 – Destructuring und Spread

export function swap<A, B>(pair: [A, B]): [B, A] {
  const [first, second] = pair;
  return [second, first];
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

export function withDefaults(partial: Partial<Settings>): Settings {
  // Einfache Variante (besteht alle Tests ausser dem ★-Test):
  //   return { ...DEFAULT_SETTINGS, ...partial };
  // Problem: { theme: undefined } überschreibt "light" mit undefined,
  // denn Spread kopiert jedes vorhandene Feld – auch wenn der Wert undefined ist.

  // Robuste Variante: jedes Feld einzeln mit ?? auffüllen
  return {
    theme: partial.theme ?? DEFAULT_SETTINGS.theme,
    language: partial.language ?? DEFAULT_SETTINGS.language,
    notifications: partial.notifications ?? DEFAULT_SETTINGS.notifications,
  };
  // Generische Variante (nach Lektion 6):
  //   const defined = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined));
  //   return { ...DEFAULT_SETTINGS, ...defined };
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  address?: { street: string; city: string };
  tags: string[];
};

export type PublicUser = Omit<User, "password">;

export function toPublicUser(user: User): PublicUser {
  // password wird "herausgezogen" und bewusst nicht verwendet
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

export function getCity(user: User): string {
  return user.address?.city ?? "unbekannt";
}

export function moveToCity(user: User, city: string): User {
  return {
    ...user,
    address: { street: user.address?.street ?? "", city },
  };
  // Alternative, wenn address mehr Felder hätte:
  //   address: user.address ? { ...user.address, city } : { street: "", city }
}

export function addTag(user: User, tag: string): User {
  if (user.tags.includes(tag)) {
    return user;
  }
  return { ...user, tags: [...user.tags, tag] };
}
