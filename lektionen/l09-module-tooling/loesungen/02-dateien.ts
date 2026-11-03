// Lösung Aufgabe 2 – Mit Dateien arbeiten

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

function isNotFound(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export async function readJson(filePath: string): Promise<unknown> {
  let text: string;
  try {
    text = await readFile(filePath, "utf8");
  } catch (error) {
    if (isNotFound(error)) {
      throw new Error(`Datei nicht gefunden: ${filePath}`);
    }
    throw error;
  }
  // Ausserhalb des try: JSON-Fehler sollen unverändert durchgehen
  return JSON.parse(text);
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export async function countLines(filePath: string): Promise<number> {
  const text = await readFile(filePath, "utf8");
  if (text === "") return 0;
  const lines = text.split(/\r?\n/);
  // Endet der Text mit einem Umbruch, ist das letzte Element leer – nicht mitzählen
  return lines.at(-1) === "" ? lines.length - 1 : lines.length;
}

export async function findFiles(dir: string, extension: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true });
  return entries
    .filter((entry) => path.extname(entry) === extension)
    .map((entry) => entry.split(path.sep).join("/"))
    .toSorted();
}
