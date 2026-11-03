import { describe, expect, it } from "vitest";
import { type NodeCallback, delay, fromCallback, loadPort, sleep } from "./01-promises";

describe("1.1 sleep", () => {
  it("wartet ungefähr die angegebene Zeit", async () => {
    const start = performance.now();
    await sleep(50);
    expect(performance.now() - start).toBeGreaterThanOrEqual(45);
  });

  it("liefert ein Promise", () => {
    expect(sleep(1)).toBeInstanceOf(Promise);
  });
});

describe("1.2 delay", () => {
  it("liefert den Wert verzögert", async () => {
    const start = performance.now();
    expect(await delay("hallo", 30)).toBe("hallo");
    expect(performance.now() - start).toBeGreaterThanOrEqual(25);
  });
});

describe("1.3 fromCallback", () => {
  // Simuliert eine alte Callback-API
  function legacyRead(name: string, callback: NodeCallback<string>): void {
    setTimeout(() => {
      if (name === "fehlt.txt") callback(new Error("Datei nicht gefunden"));
      else callback(null, `Inhalt von ${name}`);
    }, 5);
  }

  it("resolved mit dem Ergebnis", async () => {
    const content = await fromCallback<string>((cb) => legacyRead("a.txt", cb));
    expect(content).toBe("Inhalt von a.txt");
  });

  it("rejected mit dem Fehler", async () => {
    await expect(fromCallback<string>((cb) => legacyRead("fehlt.txt", cb))).rejects.toThrow(
      "Datei nicht gefunden",
    );
  });

  it("funktioniert auch, wenn der Callback sofort aufgerufen wird", async () => {
    await expect(fromCallback<number>((cb) => cb(null, 42))).resolves.toBe(42);
  });
});

describe("1.4 loadPort", () => {
  it("liest den Port", async () => {
    await expect(loadPort(async () => '{"port": 3000}')).resolves.toBe(3000);
  });

  it("meldet einen Fehler beim Laden", async () => {
    const failing = async (): Promise<string> => {
      throw new Error("Netzwerk weg");
    };
    await expect(loadPort(failing)).rejects.toThrow(/^Konfiguration ungültig: /);
  });

  it("meldet ungültiges JSON", async () => {
    await expect(loadPort(async () => "{port: 3000")).rejects.toThrow(/^Konfiguration ungültig: /);
  });

  it("meldet fehlende oder falsche Ports", async () => {
    await expect(loadPort(async () => "{}")).rejects.toThrow(/^Konfiguration ungültig: /);
    await expect(loadPort(async () => '{"port": "3000"}')).rejects.toThrow(
      /^Konfiguration ungültig: /,
    );
    await expect(loadPort(async () => "null")).rejects.toThrow(/^Konfiguration ungültig: /);
  });
});
