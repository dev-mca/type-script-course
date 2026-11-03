// Das eigentliche CLI-Programm – diese Datei ist FERTIG und benutzt deine
// Funktionen aus 03-cli.ts. Ausführen (aus dem Hauptordner):
//
//   npx tsx lektionen/l09-module-tooling/uebungen/03-cli-main.ts --input README.md
//   npx tsx lektionen/l09-module-tooling/uebungen/03-cli-main.ts -i README.md -f json -v
//   npx tsx lektionen/l09-module-tooling/uebungen/03-cli-main.ts --foo      (Fehlerfall)

import { readFile } from "node:fs/promises";
import { computeStats, formatStats, parseCliArgs } from "./03-cli";

async function main(): Promise<void> {
  // process.argv = [node, skript, ...argumente] → die ersten beiden weglassen
  const options = parseCliArgs(process.argv.slice(2));

  if (options.verbose) {
    console.error(`Lese ${options.input} …`); // Diagnose auf stderr, Ergebnis auf stdout
  }

  const text = await readFile(options.input, "utf8");
  console.log(formatStats(computeStats(text), options.format));
}

try {
  await main();
} catch (error) {
  console.error("Fehler:", error instanceof Error ? error.message : error);
  process.exitCode = 1; // Exit-Code ≠ 0 signalisiert anderen Programmen einen Fehler
}
