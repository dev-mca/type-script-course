import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { countLines, findFiles, readJson, writeJson } from "./02-dateien";

// Jeder Test bekommt einen eigenen, leeren temporären Ordner
let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "ts-kurs-"));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("2.1 readJson", () => {
  it("liest JSON-Dateien", async () => {
    const file = path.join(dir, "config.json");
    await writeFile(file, '{"port": 3000, "tags": ["a"]}');
    expect(await readJson(file)).toEqual({ port: 3000, tags: ["a"] });
  });

  it("meldet fehlende Dateien verständlich", async () => {
    const file = path.join(dir, "gibts-nicht.json");
    await expect(readJson(file)).rejects.toThrow(`Datei nicht gefunden: ${file}`);
  });

  it("gibt JSON-Fehler unverändert weiter", async () => {
    const file = path.join(dir, "kaputt.json");
    await writeFile(file, "{kaputt");
    await expect(readJson(file)).rejects.toBeInstanceOf(SyntaxError);
  });
});

describe("2.2 writeJson", () => {
  it("schreibt formatiertes JSON und legt Ordner an", async () => {
    const file = path.join(dir, "a", "b", "data.json");
    await writeJson(file, { name: "Melih", tags: ["x"] });
    const content = await readFile(file, "utf8");
    expect(content).toBe('{\n  "name": "Melih",\n  "tags": [\n    "x"\n  ]\n}\n');
  });

  it("lässt sich mit readJson zurücklesen", async () => {
    const file = path.join(dir, "roundtrip.json");
    const data = { list: [1, 2, 3], nested: { ok: true } };
    await writeJson(file, data);
    expect(await readJson(file)).toEqual(data);
  });
});

describe("2.3 countLines", () => {
  it("zählt Zeilen", async () => {
    const cases: [string, number][] = [
      ["a\nb\nc", 3],
      ["a\nb\nc\n", 3],
      ["eine Zeile", 1],
      ["", 0],
      ["a\r\nb\r\n", 2],
      ["\n\n", 2],
    ];
    for (const [content, expected] of cases) {
      const file = path.join(dir, "text.txt");
      await writeFile(file, content);
      expect({ content, lines: await countLines(file) }).toEqual({ content, lines: expected });
    }
  });
});

describe("2.4 findFiles", () => {
  it("findet Dateien rekursiv, relativ und sortiert", async () => {
    await mkdir(path.join(dir, "lib", "sub"), { recursive: true });
    await writeFile(path.join(dir, "index.ts"), "");
    await writeFile(path.join(dir, "README.md"), "");
    await writeFile(path.join(dir, "lib", "util.ts"), "");
    await writeFile(path.join(dir, "lib", "style.css"), "");
    await writeFile(path.join(dir, "lib", "sub", "deep.ts"), "");

    expect(await findFiles(dir, ".ts")).toEqual(["index.ts", "lib/sub/deep.ts", "lib/util.ts"]);
    expect(await findFiles(dir, ".md")).toEqual(["README.md"]);
    expect(await findFiles(dir, ".java")).toEqual([]);
  });
});
