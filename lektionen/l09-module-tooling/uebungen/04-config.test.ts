import { describe, expect, it } from "vitest";
import { ConfigError, loadConfig } from "./04-config";

const API_URL = "https://api.example.ch";

function problemsOf(env: Record<string, string | undefined>): string[] {
  try {
    loadConfig(env);
  } catch (error) {
    if (error instanceof ConfigError) return error.problems;
    throw error;
  }
  throw new Error("Erwartet wurde ein ConfigError");
}

describe("4 loadConfig", () => {
  it("setzt Standardwerte", () => {
    expect(loadConfig({ API_URL })).toEqual({
      port: 3000,
      nodeEnv: "development",
      apiUrl: API_URL,
      logLevel: "debug",
    });
  });

  it("übernimmt gesetzte Werte", () => {
    expect(
      loadConfig({ PORT: "8080", NODE_ENV: "production", API_URL, LOG_LEVEL: "warn" }),
    ).toEqual({ port: 8080, nodeEnv: "production", apiUrl: API_URL, logLevel: "warn" });
  });

  it("verwendet ausserhalb von development standardmässig 'info'", () => {
    expect(loadConfig({ API_URL, NODE_ENV: "test" }).logLevel).toBe("info");
    expect(loadConfig({ API_URL, NODE_ENV: "production" }).logLevel).toBe("info");
  });

  it("behandelt leere Strings wie fehlende Werte", () => {
    expect(loadConfig({ API_URL, PORT: "", NODE_ENV: "", LOG_LEVEL: "" })).toEqual({
      port: 3000,
      nodeEnv: "development",
      apiUrl: API_URL,
      logLevel: "debug",
    });
  });

  it("meldet einen fehlenden API_URL", () => {
    expect(problemsOf({})).toEqual(["API_URL fehlt"]);
    expect(problemsOf({ API_URL: "" })).toEqual(["API_URL fehlt"]);
  });

  it("prüft die einzelnen Werte", () => {
    expect(problemsOf({ API_URL, PORT: "abc" })).toEqual([
      "PORT muss eine Zahl zwischen 1 und 65535 sein",
    ]);
    expect(problemsOf({ API_URL, PORT: "70000" })).toHaveLength(1);
    expect(problemsOf({ API_URL, PORT: "80.5" })).toHaveLength(1);
    expect(problemsOf({ API_URL: "ftp://x.ch" })).toEqual([
      "API_URL muss mit http:// oder https:// beginnen",
    ]);
    expect(problemsOf({ API_URL, NODE_ENV: "staging" })).toEqual([
      "NODE_ENV muss development, production oder test sein",
    ]);
    expect(problemsOf({ API_URL, LOG_LEVEL: "verbose" })).toEqual([
      "LOG_LEVEL muss debug, info, warn oder error sein",
    ]);
  });

  it("sammelt alle Probleme auf einmal", () => {
    expect(problemsOf({ PORT: "0", NODE_ENV: "prod", LOG_LEVEL: "laut" })).toEqual([
      "PORT muss eine Zahl zwischen 1 und 65535 sein",
      "NODE_ENV muss development, production oder test sein",
      "API_URL fehlt",
      "LOG_LEVEL muss debug, info, warn oder error sein",
    ]);
  });

  it("hat eine lesbare Fehlermeldung", () => {
    try {
      loadConfig({});
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect((error as Error).message).toBe("Ungültige Konfiguration:\n- API_URL fehlt");
    }
  });
});
