// Lösung Aufgabe 3 – Ein Kommandozeilen-Programm

import { parseArgs } from "node:util";

export type OutputFormat = "text" | "json";

export type CliOptions = {
  input: string;
  format: OutputFormat;
  verbose: boolean;
};

const FORMATS: readonly string[] = ["text", "json"] satisfies OutputFormat[];

function isOutputFormat(value: string): value is OutputFormat {
  return FORMATS.includes(value);
}

export function parseCliArgs(args: readonly string[]): CliOptions {
  const { values } = parseArgs({
    args: [...args],
    options: {
      input: { type: "string", short: "i" },
      format: { type: "string", short: "f", default: "text" },
      verbose: { type: "boolean", short: "v", default: false },
    },
    strict: true, // unbekannte Optionen → Fehler (ist auch der Standard)
  });

  // parseArgs kennt die Typen aus der Konfiguration:
  // values.input: string | undefined, values.format: string, values.verbose: boolean
  if (values.input === undefined) {
    throw new Error("Option --input fehlt");
  }
  if (!isOutputFormat(values.format)) {
    throw new Error(`Ungültiges Format: ${values.format}`);
  }

  return { input: values.input, format: values.format, verbose: values.verbose };
}

export type TextStats = { lines: number; words: number; characters: number };

export function computeStats(text: string): TextStats {
  const lines = text === "" ? 0 : text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
  const words = text.split(/\s+/).filter((word) => word !== "").length;
  return { lines, words, characters: text.length };
}

export function formatStats(stats: TextStats, format: OutputFormat): string {
  if (format === "json") {
    return JSON.stringify(stats);
  }
  return [`Zeilen: ${stats.lines}`, `Wörter: ${stats.words}`, `Zeichen: ${stats.characters}`].join(
    "\n",
  );
}
