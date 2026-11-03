// Aufgabe 2 – Eine Klasse mit echtem privatem Zustand
// Tests: npm run test:watch -- l04-objekte-klassen/uebungen/02
//
// Alle Beträge sind in Rappen (ganze Zahlen) – siehe Lektion 1.

export type TransactionType = "deposit" | "withdrawal" | "transfer-in" | "transfer-out";

export type Transaction = {
  type: TransactionType;
  amount: number;
};

/**
 * Anforderungen:
 *
 * - `owner`: öffentlich lesbar, nach dem Erstellen nicht änderbar (readonly)
 * - Kontostand in einem echten privaten Feld `#balance`
 * - `balance`: Getter (ohne Setter!) – von aussen nur lesbar
 * - `history`: Getter, der eine KOPIE der Transaktionsliste liefert
 *   (Rückgabetyp readonly Transaction[]), damit niemand von aussen etwas einfügen kann
 *
 * - constructor(owner, initialBalance = 0):
 *     wirft bei negativem oder nicht ganzzahligem Startguthaben.
 *     Ein Startguthaben > 0 wird als "deposit" in der Historie vermerkt.
 *
 * - deposit(amount): Betrag muss eine ganze Zahl > 0 sein, sonst Error
 * - withdraw(amount): wie deposit; zusätzlich Error "Nicht genügend Guthaben",
 *     wenn der Kontostand nicht reicht. Bei einem Fehler ändert sich NICHTS.
 * - transferTo(target, amount): bucht vom eigenen auf das andere Konto um.
 *     Historie: hier "transfer-out", beim Ziel "transfer-in".
 *     Überweisung auf das eigene Konto → Error.
 *
 * - static fromFrancs(owner, francs): erzeugt ein Konto mit einem Startguthaben in
 *     Franken (z. B. 12.5 → 1250 Rappen). Runde auf ganze Rappen.
 *
 * Tipp: Schreib dir eine private Hilfsmethode #assertValidAmount(amount) – private
 * Methoden gehen auch mit #.
 */
export class BankAccount {
  constructor(owner: string, initialBalance = 0) {
    throw new Error("TODO: Aufgabe 2");
  }
}
