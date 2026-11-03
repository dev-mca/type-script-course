// Lösung Aufgabe 1 – Tabellen formatieren

import type { Column, Row } from "./typen";

// Nicht exportiert → nur innerhalb dieses Moduls sichtbar
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
