// Aufgabe 1 – Ausgangslage: Alles steckt in einer Datei.
//
// Dieser Code funktioniert. Deine Aufgabe ist es, ihn auf mehrere Module
// im Ordner bibliothek/ aufzuteilen:
//
//   bibliothek/typen.ts    → die Typen Row und Column (nur Typen, keine Funktionen!)
//   bibliothek/csv.ts      → parseCsvLine und parseCsv
//   bibliothek/tabelle.ts  → formatTable (padCell bleibt dort PRIVAT, also nicht exportiert)
//   bibliothek/index.ts    → re-exportiert die öffentliche Schnittstelle:
//                            parseCsvLine, parseCsv, formatTable und die Typen Row, Column
//                            (index.ts enthält selbst keinen Code, nur export-Zeilen)
//
// Regeln:
// - csv.ts und tabelle.ts importieren die Typen mit `import type` aus "./typen".
// - Diese Datei hier bleibt unverändert liegen (zum Vergleichen).
// - Tipp: IntelliJ kann das für dich erledigen! Rechtsklick auf eine Funktion →
//   Refactor → Move (F6). Probier es aus – danach aber selbst nachkontrollieren.
//
// Tests: npm run test:watch -- l09-module-tooling/uebungen/01

export type Row = Record<string, string>;

export type Column = {
  key: string;
  title: string;
  align?: "left" | "right";
};

export function parseCsvLine(line: string, separator = ";"): string[] {
  return line.split(separator).map((cell) => cell.trim());
}

export function parseCsv(text: string, separator = ";"): Row[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const [headerLine, ...dataLines] = lines;
  if (headerLine === undefined) return [];

  const headers = parseCsvLine(headerLine, separator);
  return dataLines.map((line) => {
    const cells = parseCsvLine(line, separator);
    const row: Row = {};
    headers.forEach((header, i) => {
      row[header] = cells[i] ?? "";
    });
    return row;
  });
}

function padCell(value: string, width: number, align: "left" | "right" = "left"): string {
  return align === "right" ? value.padStart(width) : value.padEnd(width);
}

export function formatTable(rows: readonly Row[], columns: readonly Column[]): string {
  const widths = columns.map((column) =>
    Math.max(column.title.length, ...rows.map((row) => (row[column.key] ?? "").length)),
  );

  const header = columns.map((c, i) => padCell(c.title, widths[i]!, c.align)).join(" | ");
  const separator = widths.map((w) => "-".repeat(w)).join("-+-");
  const body = rows.map((row) =>
    columns.map((c, i) => padCell(row[c.key] ?? "", widths[i]!, c.align)).join(" | "),
  );

  return [header, separator, ...body].join("\n");
}
