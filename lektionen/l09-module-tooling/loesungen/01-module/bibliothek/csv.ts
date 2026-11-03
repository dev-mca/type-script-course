// Lösung Aufgabe 1 – CSV einlesen

import type { Row } from "./typen";

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
