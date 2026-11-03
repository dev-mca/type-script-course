// Lösung Aufgabe 1 – nur Typen, kein Laufzeitcode

export type Row = Record<string, string>;

export type Column = {
  key: string;
  title: string;
  align?: "left" | "right";
};
