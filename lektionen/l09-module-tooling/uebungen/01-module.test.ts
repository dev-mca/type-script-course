import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as lib from "./01-module/bibliothek";

const dir = path.join(import.meta.dirname, "01-module", "bibliothek");
const read = (file: string) => readFileSync(path.join(dir, file), "utf8");

const CSV = `
name;stadt;umsatz
Melih;Aarau;4500
Anna;Baden;12000
`;

describe("1 Module – Funktion", () => {
  it("parst CSV über die Bibliothek", () => {
    expect(lib.parseCsv(CSV)).toEqual([
      { name: "Melih", stadt: "Aarau", umsatz: "4500" },
      { name: "Anna", stadt: "Baden", umsatz: "12000" },
    ]);
    expect(lib.parseCsvLine("a, b ,c", ",")).toEqual(["a", "b", "c"]);
  });

  it("formatiert Tabellen über die Bibliothek", () => {
    const table = lib.formatTable(lib.parseCsv(CSV), [
      { key: "name", title: "Name" },
      { key: "umsatz", title: "Umsatz", align: "right" },
    ]);
    expect(table).toBe(
      ["Name  | Umsatz", "------+-------", "Melih |   4500", "Anna  |  12000"].join("\n"),
    );
  });

  it("exportiert keine Interna", () => {
    expect(Object.keys(lib).sort()).toEqual(["formatTable", "parseCsv", "parseCsvLine"]);
  });
});

describe("1 Module – Struktur", () => {
  it("hat die geforderten Dateien", () => {
    for (const file of ["index.ts", "typen.ts", "csv.ts", "tabelle.ts"]) {
      // So zeigt die Fehlermeldung direkt an, welche Datei fehlt
      expect({ file, exists: existsSync(path.join(dir, file)) }).toEqual({ file, exists: true });
    }
  });

  it("typen.ts enthält nur Typen", () => {
    const content = read("typen.ts");
    expect(content).toMatch(/export type Row/);
    expect(content).toMatch(/export type Column/);
    expect(content).not.toMatch(/function/);
  });

  it("csv.ts und tabelle.ts importieren die Typen mit import type", () => {
    expect(read("csv.ts")).toMatch(/import type \{[^}]*\bRow\b[^}]*\} from "\.\/typen"/);
    expect(read("tabelle.ts")).toMatch(/import type \{[^}]*\bColumn\b[^}]*\} from "\.\/typen"/);
  });

  it("padCell ist in tabelle.ts privat", () => {
    const content = read("tabelle.ts");
    expect(content).toMatch(/function padCell/);
    expect(content).not.toMatch(/export function padCell/);
  });

  it("index.ts enthält nur Re-Exports", () => {
    const content = read("index.ts");
    expect(content).not.toMatch(/function|=>|const /);
    expect(content).toMatch(/from "\.\/csv"/);
    expect(content).toMatch(/from "\.\/tabelle"/);
    expect(content).toMatch(/export type \{[^}]*\} from "\.\/typen"/);
  });
});
