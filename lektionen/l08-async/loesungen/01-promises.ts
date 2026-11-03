// Lösung Aufgabe 1 – Promises erzeugen und verwenden

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function delay<T>(value: T, ms: number): Promise<T> {
  await sleep(ms);
  return value; // wird automatisch zu Promise<T>
}

export type NodeCallback<T> = (error: Error | null, result?: T) => void;

export function fromCallback<T>(start: (callback: NodeCallback<T>) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    start((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result as T);
      }
    });
  });
  // Node.js hat dafür übrigens util.promisify eingebaut.
}

export async function loadPort(loadText: () => Promise<string>): Promise<number> {
  try {
    const raw = await loadText();
    const config: unknown = JSON.parse(raw);
    if (
      typeof config !== "object" ||
      config === null ||
      !("port" in config) ||
      typeof config.port !== "number"
    ) {
      throw new Error("port fehlt oder ist keine Zahl");
    }
    return config.port;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Konfiguration ungültig: ${reason}`);
  }
}
