// Lösung Aufgabe 4 – Interfaces implementieren (Strategy-Muster)

export interface Notifier {
  readonly channel: string;
  send(recipient: string, message: string): string;
}

export class EmailNotifier implements Notifier {
  readonly channel = "email";

  send(recipient: string, message: string): string {
    if (!recipient.includes("@")) {
      throw new Error(`Ungültige E-Mail-Adresse: ${recipient}`);
    }
    return `E-Mail an ${recipient}: ${message}`;
  }
}

const SMS_MAX_LENGTH = 160;

export class SmsNotifier implements Notifier {
  readonly channel = "sms";
  #sentCount = 0;

  get sentCount(): number {
    return this.#sentCount;
  }

  send(recipient: string, message: string): string {
    if (!recipient.startsWith("+41")) {
      throw new Error(`Ungültige Schweizer Nummer: ${recipient}`);
    }
    const text =
      message.length > SMS_MAX_LENGTH ? message.slice(0, SMS_MAX_LENGTH - 3) + "..." : message;
    this.#sentCount++; // erst nach erfolgreicher Prüfung zählen
    return `SMS an ${recipient}: ${text}`;
  }
}

// Kein class, kein implements – das Objekt hat einfach die richtige Form.
export const consoleNotifier: Notifier = {
  channel: "console",
  send(recipient, message) {
    // Parametertypen werden aus dem Notifier-Interface hergeleitet
    return `[console] ${recipient}: ${message}`;
  },
};

export function broadcast(
  notifiers: Notifier[],
  recipients: Record<string, string>,
  message: string,
): string[] {
  const log: string[] = [];
  for (const notifier of notifiers) {
    const recipient = recipients[notifier.channel];
    if (recipient === undefined) continue;

    try {
      log.push(notifier.send(recipient, message));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      log.push(`Fehler (${notifier.channel}): ${reason}`);
    }
  }
  return log;
}
