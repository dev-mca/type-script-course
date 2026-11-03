import { describe, expect, it } from "vitest";
import { BankAccount } from "./02-bankkonto";

describe("2 BankAccount", () => {
  describe("Konstruktor", () => {
    it("speichert Inhaber und Startguthaben", () => {
      const account = new BankAccount("Melih", 10000);
      expect(account.owner).toBe("Melih");
      expect(account.balance).toBe(10000);
    });

    it("startet standardmässig bei 0", () => {
      expect(new BankAccount("Melih").balance).toBe(0);
    });

    it("lehnt ungültige Startguthaben ab", () => {
      expect(() => new BankAccount("Melih", -1)).toThrow();
      expect(() => new BankAccount("Melih", 10.5)).toThrow();
    });

    it("vermerkt ein Startguthaben in der Historie", () => {
      expect(new BankAccount("Melih", 500).history).toEqual([{ type: "deposit", amount: 500 }]);
      expect(new BankAccount("Melih").history).toEqual([]);
    });
  });

  describe("deposit und withdraw", () => {
    it("zahlt ein und ab", () => {
      const account = new BankAccount("Melih");
      account.deposit(5000);
      account.withdraw(1500);
      expect(account.balance).toBe(3500);
      expect(account.history).toEqual([
        { type: "deposit", amount: 5000 },
        { type: "withdrawal", amount: 1500 },
      ]);
    });

    it("lehnt ungültige Beträge ab", () => {
      const account = new BankAccount("Melih", 1000);
      expect(() => account.deposit(0)).toThrow();
      expect(() => account.deposit(-100)).toThrow();
      expect(() => account.deposit(99.5)).toThrow();
      expect(() => account.withdraw(0)).toThrow();
      expect(account.balance).toBe(1000);
    });

    it("verhindert Überziehen", () => {
      const account = new BankAccount("Melih", 1000);
      expect(() => account.withdraw(1001)).toThrow("Nicht genügend Guthaben");
      expect(account.balance).toBe(1000);
      expect(account.history).toHaveLength(1);
    });
  });

  describe("transferTo", () => {
    it("bucht zwischen zwei Konten um", () => {
      const melih = new BankAccount("Melih", 10000);
      const anna = new BankAccount("Anna");
      melih.transferTo(anna, 2500);
      expect(melih.balance).toBe(7500);
      expect(anna.balance).toBe(2500);
      expect(melih.history.at(-1)).toEqual({ type: "transfer-out", amount: 2500 });
      expect(anna.history.at(-1)).toEqual({ type: "transfer-in", amount: 2500 });
    });

    it("ändert bei zu wenig Guthaben keines der Konten", () => {
      const melih = new BankAccount("Melih", 100);
      const anna = new BankAccount("Anna", 100);
      expect(() => melih.transferTo(anna, 500)).toThrow();
      expect(melih.balance).toBe(100);
      expect(anna.balance).toBe(100);
    });

    it("verbietet Überweisungen auf das eigene Konto", () => {
      const melih = new BankAccount("Melih", 100);
      expect(() => melih.transferTo(melih, 50)).toThrow();
    });
  });

  describe("Kapselung", () => {
    it("liefert eine Kopie der Historie", () => {
      const account = new BankAccount("Melih", 100);
      const history = account.history as Array<{ type: string; amount: number }>;
      history.push({ type: "deposit", amount: 1_000_000 });
      expect(account.history).toHaveLength(1);
    });

    it("hat kein öffentlich sichtbares Kontostand-Feld", () => {
      const account = new BankAccount("Melih", 100);
      expect(Object.keys(account)).not.toContain("balance");
      expect(JSON.stringify(account)).not.toContain("100");
    });

    it("lässt sich der Kontostand nicht von aussen setzen", () => {
      const account = new BankAccount("Melih", 100);
      expect(() => {
        (account as unknown as { balance: number }).balance = 999;
      }).toThrow(); // Getter ohne Setter → TypeError im strict mode
      expect(account.balance).toBe(100);
    });
  });

  describe("fromFrancs", () => {
    it("rechnet Franken in Rappen um", () => {
      expect(BankAccount.fromFrancs("Melih", 12.5).balance).toBe(1250);
      expect(BankAccount.fromFrancs("Melih", 0.1 + 0.2).balance).toBe(30);
      expect(BankAccount.fromFrancs("Anna", 100).owner).toBe("Anna");
    });
  });
});
