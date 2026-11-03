// Lösung Aufgabe 4 – Konfiguration aus Umgebungsvariablen

export type NodeEnv = "development" | "production" | "test";
export type LogLevel = "debug" | "info" | "warn" | "error";

export type AppConfig = {
  port: number;
  nodeEnv: NodeEnv;
  apiUrl: string;
  logLevel: LogLevel;
};

export class ConfigError extends Error {
  constructor(readonly problems: string[]) {
    super(`Ungültige Konfiguration:\n- ${problems.join("\n- ")}`);
    this.name = "ConfigError";
  }
}

const NODE_ENVS: readonly NodeEnv[] = ["development", "production", "test"];
const LOG_LEVELS: readonly LogLevel[] = ["debug", "info", "warn", "error"];

/** Wiederverwendbarer Type Guard: Ist value einer der erlaubten Werte? */
function isOneOf<T extends string>(allowed: readonly T[], value: string): value is T {
  return (allowed as readonly string[]).includes(value);
}

/** "" und undefined → undefined */
function read(env: Record<string, string | undefined>, key: string): string | undefined {
  const value = env[key]?.trim();
  return value === "" ? undefined : value;
}

export function loadConfig(env: Record<string, string | undefined>): AppConfig {
  const problems: string[] = [];

  // PORT
  const rawPort = read(env, "PORT");
  const port = rawPort === undefined ? 3000 : Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    problems.push("PORT muss eine Zahl zwischen 1 und 65535 sein");
  }

  // NODE_ENV
  const rawEnv = read(env, "NODE_ENV") ?? "development";
  const nodeEnv: NodeEnv = isOneOf(NODE_ENVS, rawEnv) ? rawEnv : "development";
  if (!isOneOf(NODE_ENVS, rawEnv)) {
    problems.push("NODE_ENV muss development, production oder test sein");
  }

  // API_URL
  const apiUrl = read(env, "API_URL");
  if (apiUrl === undefined) {
    problems.push("API_URL fehlt");
  } else if (!/^https?:\/\//.test(apiUrl)) {
    problems.push("API_URL muss mit http:// oder https:// beginnen");
  }

  // LOG_LEVEL
  const defaultLevel: LogLevel = nodeEnv === "development" ? "debug" : "info";
  const rawLevel = read(env, "LOG_LEVEL") ?? defaultLevel;
  if (!isOneOf(LOG_LEVELS, rawLevel)) {
    problems.push("LOG_LEVEL muss debug, info, warn oder error sein");
  }

  if (problems.length > 0 || apiUrl === undefined || !isOneOf(LOG_LEVELS, rawLevel)) {
    // Die beiden Zusatzbedingungen sind nur für den Compiler: Er weiss sonst nicht,
    // dass apiUrl und rawLevel hier gültig sind, wenn problems leer ist.
    throw new ConfigError(problems);
  }

  return { port, nodeEnv, apiUrl, logLevel: rawLevel };
}
