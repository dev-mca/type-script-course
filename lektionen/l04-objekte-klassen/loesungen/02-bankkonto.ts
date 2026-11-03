// Lösung Aufgabe 2 – Eine Klasse mit echtem privatem Zustand

export type TransactionType = "deposit" | "withdrawal" | "transfer-in" | "transfer-out";

export type Transaction = {
  type: TransactionType;
  amount: number;
};

export class BankAccount {
  readonly owner: string;
  #balance = 0;
  #transactions: Transaction[] = [];

  constructor(owner: string, initialBalance = 0) {
    if (!Number.isInteger(initialBalance) || initialBalance < 0) {
      throw new Error(`Ungültiges Startguthaben: ${initialBalance}`);
    }
    this.owner = owner;
    if (initialBalance > 0) {
      this.#book("deposit", initialBalance);
    }
  }

  static fromFrancs(owner: string, francs: number): BankAccount {
    return new BankAccount(owner, Math.round(francs * 100));
  }

  get balance(): number {
    return this.#balance;
  }

  get history(): readonly Transaction[] {
    // Kopie, damit Aufrufer die interne Liste nicht verändern können.
    // Die Transaction-Objekte selbst werden geteilt – für noch mehr Sicherheit
    // könnte man sie mit map((t) => ({ ...t })) ebenfalls kopieren.
    return [...this.#transactions];
  }

  deposit(amount: number): void {
    this.#assertValidAmount(amount);
    this.#book("deposit", amount);
  }

  withdraw(amount: number): void {
    this.#assertValidAmount(amount);
    this.#assertCovered(amount);
    this.#book("withdrawal", -amount);
  }

  transferTo(target: BankAccount, amount: number): void {
    if (target === this) {
      throw new Error("Überweisung auf das eigene Konto ist nicht möglich");
    }
    // Zuerst ALLES prüfen, dann buchen – so bleibt bei einem Fehler alles unverändert
    this.#assertValidAmount(amount);
    this.#assertCovered(amount);
    this.#book("transfer-out", -amount);
    target.#book("transfer-in", amount); // #-Felder anderer Instanzen derselben Klasse sind erreichbar
  }

  // signedAmount: positiv für Eingänge, negativ für Ausgänge
  #book(type: TransactionType, signedAmount: number): void {
    this.#balance += signedAmount;
    this.#transactions.push({ type, amount: Math.abs(signedAmount) });
  }

  #assertValidAmount(amount: number): void {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error(`Ungültiger Betrag: ${amount}`);
    }
  }

  #assertCovered(amount: number): void {
    if (amount > this.#balance) {
      throw new Error("Nicht genügend Guthaben");
    }
  }
}
