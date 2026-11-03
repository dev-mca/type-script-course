// Aufgabe 2 – Mit Dateien arbeiten
// Tests: npm run test:watch -- l09-module-tooling/uebungen/02
//
// Verwende ausschliesslich die Promise-API: import { … } from "node:fs/promises"
// und für Pfade: import path from "node:path"
//
// Doku: https://nodejs.org/api/fs.html#promises-api

/**
 * 2.1 Liest eine JSON-Datei und liefert den Inhalt (unknown – wir trauen der Datei nicht).
 * Existiert die Datei nicht, wird ein Error mit der Meldung
 *   `Datei nicht gefunden: ${filePath}`
 * geworfen. Andere Fehler (z. B. ungültiges JSON) werden unverändert weitergegeben.
 *
 * Hinweis: Node-Fehler haben ein Feld `code`. Für «nicht gefunden» ist es "ENOENT".
 * Prüfen kannst du so:
 *   error instanceof Error && "code" in error && error.code === "ENOENT"
 */
export async function readJson(filePath: string): Promise<unknown> {
  throw new Error("TODO: Aufgabe 2.1");
}

/**
 * 2.2 Schreibt `data` als schön formatiertes JSON (2 Leerzeichen Einrückung,
 * Zeilenumbruch am Ende). Fehlende Ordner werden automatisch angelegt.
 *
 * Hinweis: mkdir(path.dirname(filePath), { recursive: true })
 *          JSON.stringify(data, null, 2)
 */
export async function writeJson(filePath: string, data: unknown): Promise<void> {
  throw new Error("TODO: Aufgabe 2.2");
}

/**
 * 2.3 Zählt die Zeilen einer Textdatei.
 *   "a\nb\nc"   → 3
 *   "a\nb\nc\n" → 3   (Zeilenumbruch am Ende zählt nicht als eigene Zeile)
 *   ""          → 0
 * Windows-Zeilenumbrüche (\r\n) sollen ebenfalls funktionieren.
 */
export async function countLines(filePath: string): Promise<number> {
  throw new Error("TODO: Aufgabe 2.3");
}

/**
 * 2.4 Findet rekursiv alle Dateien mit einer bestimmten Endung in einem Ordner.
 * Liefert die Pfade RELATIV zum Ordner, mit "/" als Trennzeichen, alphabetisch sortiert.
 *
 * findFiles("projekt", ".ts") → ["index.ts", "lib/sub/deep.ts", "lib/util.ts"]
 *
 * Hinweis: readdir(dir, { recursive: true }) liefert alle Einträge rekursiv.
 * Ordner haben keine Endung – path.extname(entry) filtert sie automatisch weg,
 * solange kein Ordner auf ".ts" endet. Für Windows: entry.split(path.sep).join("/").
 */
export async function findFiles(dir: string, extension: string): Promise<string[]> {
  throw new Error("TODO: Aufgabe 2.4");
}
