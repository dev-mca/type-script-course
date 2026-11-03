import { describe, expect, it } from "vitest";
import { computeStats, formatStats, parseCliArgs } from "./03-cli";

describe("3.1 parseCliArgs", () => {
  it("liest lange Optionen", () => {
    expect(parseCliArgs(["--input", "a.txt", "--format", "json", "--verbose"])).toEqual({
      input: "a.txt",
      format: "json",
      verbose: true,
    });
  });

  it("liest kurze Optionen", () => {
    expect(parseCliArgs(["-i", "a.txt", "-f", "text", "-v"])).toEqual({
      input: "a.txt",
      format: "text",
      verbose: true,
    });
  });

  it("setzt Standardwerte", () => {
    expect(parseCliArgs(["--input", "a.txt"])).toEqual({
      input: "a.txt",
      format: "text",
      verbose: false,
    });
  });

  it("verlangt --input", () => {
    expect(() => parseCliArgs([])).toThrow("Option --input fehlt");
    expect(() => parseCliArgs(["-v"])).toThrow("Option --input fehlt");
  });

  it("lehnt ungültige Formate ab", () => {
    expect(() => parseCliArgs(["-i", "a.txt", "-f", "xml"])).toThrow("Ungültiges Format: xml");
  });

  it("lehnt unbekannte Optionen ab", () => {
    expect(() => parseCliArgs(["-i", "a.txt", "--foo"])).toThrow(/foo/);
  });
});

describe("3.2 computeStats", () => {
  it("zählt Zeilen, Wörter und Zeichen", () => {
    expect(computeStats("Hallo Welt\nwie geht's?\n")).toEqual({
      lines: 2,
      words: 4,
      characters: 23,
    });
  });

  it("kommt mit Sonderfällen klar", () => {
    expect(computeStats("")).toEqual({ lines: 0, words: 0, characters: 0 });
    expect(computeStats("   \n  \n")).toEqual({ lines: 2, words: 0, characters: 7 });
    expect(computeStats("  ein   Wort ")).toEqual({ lines: 1, words: 2, characters: 13 });
  });
});

describe("3.3 formatStats", () => {
  const stats = { lines: 3, words: 12, characters: 80 };

  it("formatiert als Text", () => {
    expect(formatStats(stats, "text")).toBe("Zeilen: 3\nWörter: 12\nZeichen: 80");
  });

  it("formatiert als JSON", () => {
    expect(JSON.parse(formatStats(stats, "json"))).toEqual(stats);
    expect(formatStats(stats, "json")).not.toContain("\n");
  });
});
