import { describe, expect, it } from "vitest";
import {
  EmailNotifier,
  type Notifier,
  SmsNotifier,
  broadcast,
  consoleNotifier,
} from "./04-notifier";

describe("4.1 EmailNotifier", () => {
  it("verschickt E-Mails", () => {
    const email = new EmailNotifier();
    expect(email.channel).toBe("email");
    expect(email.send("melih@example.ch", "Termin morgen 10:00")).toBe(
      "E-Mail an melih@example.ch: Termin morgen 10:00",
    );
  });

  it("lehnt ungültige Adressen ab", () => {
    expect(() => new EmailNotifier().send("melih.example.ch", "Hallo")).toThrow();
  });
});

describe("4.2 SmsNotifier", () => {
  it("verschickt SMS", () => {
    const sms = new SmsNotifier();
    expect(sms.channel).toBe("sms");
    expect(sms.send("+41791234567", "Termin morgen")).toBe("SMS an +41791234567: Termin morgen");
  });

  it("lehnt Nummern ohne +41 ab", () => {
    expect(() => new SmsNotifier().send("0791234567", "Hallo")).toThrow();
  });

  it("kürzt lange Nachrichten auf 160 Zeichen", () => {
    const longMessage = "x".repeat(200);
    const result = new SmsNotifier().send("+41791234567", longMessage);
    const text = result.replace("SMS an +41791234567: ", "");
    expect(text).toHaveLength(160);
    expect(text.endsWith("...")).toBe(true);
  });

  it("lässt genau 160 Zeichen ungekürzt", () => {
    const message = "y".repeat(160);
    expect(new SmsNotifier().send("+41791234567", message)).toBe(`SMS an +41791234567: ${message}`);
  });

  it("zählt verschickte SMS (Fehlversuche nicht)", () => {
    const sms = new SmsNotifier();
    sms.send("+41791234567", "1");
    sms.send("+41791234567", "2");
    expect(() => sms.send("ungültig", "3")).toThrow();
    expect(sms.sentCount).toBe(2);
  });
});

describe("4.3 consoleNotifier", () => {
  it("ist ein Objekt, das Notifier erfüllt", () => {
    expect(consoleNotifier.channel).toBe("console");
    expect(consoleNotifier.send("irgendwer", "Test")).toBe("[console] irgendwer: Test");
  });
});

describe("4.4 broadcast", () => {
  it("schickt über alle Kanäle mit Empfänger", () => {
    const notifiers: Notifier[] = [new EmailNotifier(), new SmsNotifier(), consoleNotifier];
    const result = broadcast(
      notifiers,
      { email: "melih@example.ch", sms: "+41791234567" },
      "Erinnerung",
    );
    expect(result).toEqual([
      "E-Mail an melih@example.ch: Erinnerung",
      "SMS an +41791234567: Erinnerung",
    ]);
  });

  it("protokolliert Fehler und macht weiter", () => {
    const notifiers: Notifier[] = [new SmsNotifier(), new EmailNotifier()];
    const result = broadcast(
      notifiers,
      { sms: "079 123 45 67", email: "melih@example.ch" },
      "Erinnerung",
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatch(/^Fehler \(sms\): /);
    expect(result[1]).toBe("E-Mail an melih@example.ch: Erinnerung");
  });
});
