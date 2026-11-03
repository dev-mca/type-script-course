// Aufgabe 4 – Konfiguration aus Umgebungsvariablen
// Tests: npm run test:watch -- l09-module-tooling/uebungen/04
//
// Server-Programme werden über Umgebungsvariablen konfiguriert (z. B. in Docker
// oder Kubernetes). Alle Werte kommen als string | undefined an und müssen
// geprüft und umgewandelt werden – und zwar beim Start, nicht erst, wenn der
// Wert irgendwann gebraucht wird («fail fast»).
//
// Im echten Programm: const config = loadConfig(process.env);

export type NodeEnv = "development" | "production" | "test";
export type LogLevel = "debug" | "info" | "warn" | "error";

export type AppConfig = {
  port: number;
  nodeEnv: NodeEnv;
  apiUrl: string;
  logLevel: LogLevel;
};

/** Enthält ALLE gefundenen Probleme, nicht nur das erste */
export class ConfigError extends Error {
  constructor(readonly problems: string[]) {
    super(`Ungültige Konfiguration:\n- ${problems.join("\n- ")}`);
    this.name = "ConfigError";
  }
}

/**
 * Liest die Konfiguration:
 *
 *   PORT       optional, Standard 3000; ganze Zahl von 1 bis 65535
 *              Problem: "PORT muss eine Zahl zwischen 1 und 65535 sein"
 *   NODE_ENV   optional, Standard "development"; einer der NodeEnv-Werte
 *              Problem: "NODE_ENV muss development, production oder test sein"
 *   API_URL    PFLICHT; muss mit http:// oder https:// beginnen
 *              Problem: "API_URL fehlt" bzw. "API_URL muss mit http:// oder https:// beginnen"
 *   LOG_LEVEL  optional; Standard "debug" in development, sonst "info"
 *              Problem: "LOG_LEVEL muss debug, info, warn oder error sein"
 *
 * Leere Strings ("") gelten wie «nicht gesetzt».
 * Gibt es Probleme, wird EIN ConfigError mit ALLEN Problemen geworfen
 * (in der Reihenfolge PORT, NODE_ENV, API_URL, LOG_LEVEL).
 *
 * Tipp: Sammle die Probleme in einem string[] und wirf am Schluss.
 */
export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  throw new Error("TODO: Aufgabe 4");
}
