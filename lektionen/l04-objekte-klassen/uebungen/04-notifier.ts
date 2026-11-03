// Aufgabe 4 – Interfaces implementieren (Strategy-Muster)
// Tests: npm run test:watch -- l04-objekte-klassen/uebungen/04
//
// Ein Barbershop will Kunden über verschiedene Kanäle an ihren Termin erinnern.

export interface Notifier {
  /** Name des Kanals, z. B. "email" */
  readonly channel: string;
  /**
   * Verschickt eine Nachricht und gibt eine Protokollzeile zurück.
   * Wirft einen Error, wenn der Empfänger für diesen Kanal ungültig ist.
   */
  send(recipient: string, message: string): string;
}

/**
 * 4.1 E-Mail-Kanal
 * - channel: "email"
 * - recipient muss ein "@" enthalten, sonst Error
 * - Rückgabe: `E-Mail an ${recipient}: ${message}`
 */
export class EmailNotifier {
  // TODO: Aufgabe 4.1 – implements Notifier
}

/**
 * 4.2 SMS-Kanal
 * - channel: "sms"
 * - recipient muss mit "+41" beginnen, sonst Error
 * - SMS sind auf 160 Zeichen begrenzt: Längere Nachrichten werden auf 157 Zeichen
 *   gekürzt und mit "..." ergänzt (Gesamtlänge der Nachricht dann genau 160).
 * - Rückgabe: `SMS an ${recipient}: ${nachricht}`
 * - Zusätzlich zählt die Klasse, wie viele SMS sie verschickt hat:
 *   Getter `sentCount` (nur lesbar).
 */
export class SmsNotifier {
  // TODO: Aufgabe 4.2 – implements Notifier
}

/**
 * 4.3 Ein Test-Kanal OHNE Klasse – einfach als Objektliteral.
 * - channel: "console"
 * - akzeptiert jeden Empfänger
 * - Rückgabe: `[console] ${recipient}: ${message}`
 *
 * Ersetze das `undefined as unknown as Notifier` durch ein Objektliteral.
 */
export const consoleNotifier: Notifier = undefined as unknown as Notifier; // TODO: Aufgabe 4.3

/**
 * 4.4 Schickt die Nachricht über alle Kanäle, für die ein Empfänger bekannt ist.
 * recipients ordnet jedem Kanalnamen einen Empfänger zu, z. B.
 *   { email: "melih@example.ch", sms: "+41791234567" }
 * Kanäle ohne Empfänger werden übersprungen.
 *
 * Wirft ein Kanal einen Error, wird stattdessen die Zeile
 *   `Fehler (${channel}): ${error.message}`
 * ins Ergebnis aufgenommen, und die übrigen Kanäle werden trotzdem bedient.
 *
 * Hinweis: In catch (error) ist error vom Typ unknown. Prüfe mit
 * `error instanceof Error`, bevor du auf error.message zugreifst.
 */
export function broadcast(
  notifiers: Notifier[],
  recipients: Record<string, string>,
  message: string,
): string[] {
  throw new Error("TODO: Aufgabe 4.4");
}
