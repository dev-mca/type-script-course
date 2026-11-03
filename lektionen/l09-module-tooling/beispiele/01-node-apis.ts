// Ausführen: npx tsx lektionen/l09-module-tooling/beispiele/01-node-apis.ts --verbose
//
// Ein kleiner Rundgang durch die Node.js-APIs, die du im Alltag brauchst.

import { readFile, readdir, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

// 1. Wo bin ich?
console.log("Diese Datei liegt in:", import.meta.dirname);
const projectRoot = path.resolve(import.meta.dirname, "..", "..", "..");
console.log("Projektordner:      ", projectRoot);

// 2. package.json lesen und auswerten
const pkgText = await readFile(path.join(projectRoot, "package.json"), "utf8");
const pkg = JSON.parse(pkgText) as {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
console.log(`\nPaket "${pkg.name}"`);
console.log("  Laufzeit-Abhängigkeiten:", Object.keys(pkg.dependencies ?? {}).join(", "));
console.log("  Entwicklungs-Abhängigkeiten:", Object.keys(pkg.devDependencies ?? {}).join(", "));

// 3. Ordner auflisten
const lessons = (await readdir(path.join(projectRoot, "lektionen"))).filter((d) =>
  d.startsWith("l"),
);
console.log(`\n${lessons.length} Lektionen gefunden, z. B.:`, lessons.slice(0, 3));

// 4. Datei-Infos
const readmeStats = await stat(path.join(projectRoot, "README.md"));
console.log(
  `\nREADME.md: ${readmeStats.size} Bytes, geändert am ${readmeStats.mtime.toISOString()}`,
);

// 5. Kommandozeilen-Argumente
const { values } = parseArgs({
  args: process.argv.slice(2),
  options: { verbose: { type: "boolean", short: "v", default: false } },
});
if (values.verbose) {
  console.log("\n--verbose ist gesetzt. Rohe Argumente:", process.argv.slice(2));
}

// 6. Umgebungsvariablen (immer string | undefined!)
const user = process.env.USER ?? process.env.USERNAME ?? "unbekannt";
console.log(`\nBenutzer: ${user}, Plattform: ${os.platform()}, Node ${process.version}`);

// 🔧 Experiment: Starte das Skript mit einer eigenen Umgebungsvariable:
//   GREETING=Grüezi npx tsx lektionen/l09-module-tooling/beispiele/01-node-apis.ts
// und gib process.env.GREETING aus.
