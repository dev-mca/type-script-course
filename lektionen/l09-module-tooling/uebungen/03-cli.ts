// Aufgabe 3 – Ein Kommandozeilen-Programm
// Tests: npm run test:watch -- l09-module-tooling/uebungen/03
//
// Wir bauen die Logik für ein kleines CLI-Tool «textstat», das Statistiken
// über eine Textdatei ausgibt. Das eigentliche Programm steht in 03-cli-main.ts
// (fertig) und benutzt deine Funktionen.
//
// Doku: https://nodejs.org/api/util.html#utilparseargsconfig

export type OutputFormat = "text" | "json";

export type CliOptions = {
  input: string;
  format: OutputFormat;
  verbose: boolean;
};

/**
 * 3.1 Liest die Kommandozeilen-Argumente (OHNE die ersten beiden Einträge von
 * process.argv – die übergibt der Aufrufer bereits abgeschnitten).
 *
 * Unterstützte Optionen:
 *   --input <datei>   / -i <datei>    Pflicht
 *   --format <f>      / -f <f>        "text" (Standard) oder "json"
 *   --verbose         / -v            Schalter, Standard false
 *
 * Fehler (jeweils ein Error werfen):
 *   - unbekannte Option (z. B. --foo)   → das macht parseArgs mit strict: true automatisch
 *   - --input fehlt                     → "Option --input fehlt"
 *   - ungültiges Format                 → "Ungültiges Format: xml"
 *
 * Hinweis:
 *   import { parseArgs } from "node:util";
 *   const { values } = parseArgs({ args, options: { input: { type: "string", short: "i" }, … } });
 */
export function parseCliArgs(args: readonly string[]): CliOptions {
  throw new Error("TODO: Aufgabe 3.1");
}

export type TextStats = { lines: number; words: number; characters: number };

/**
 * 3.2 Berechnet Statistiken über einen Text:
 *   lines      – Anzahl Zeilen (Umbruch am Ende zählt nicht als neue Zeile; "" → 0)
 *   words      – Anzahl Wörter (durch beliebige Leerzeichen/Umbrüche getrennt)
 *   characters – Anzahl Zeichen insgesamt (text.length)
 */
export function computeStats(text: string): TextStats {
  throw new Error("TODO: Aufgabe 3.2");
}

/**
 * 3.3 Formatiert die Statistik:
 *   "text" → drei Zeilen:  "Zeilen: 3\nWörter: 12\nZeichen: 80"
 *   "json" → JSON.stringify(stats) (eine Zeile)
 */
export function formatStats(stats: TextStats, format: OutputFormat): string {
  throw new Error("TODO: Aufgabe 3.3");
}
