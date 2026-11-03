import { describe, expect, it } from "vitest";
import { collatzSteps, countVowels, isPalindrome, sumDigits } from "./04-schleifen";

describe("4.1 sumDigits", () => {
  it("berechnet die Quersumme", () => {
    expect(sumDigits(1234)).toBe(10);
    expect(sumDigits(9)).toBe(9);
    expect(sumDigits(0)).toBe(0);
    expect(sumDigits(1000001)).toBe(2);
  });

  it("ignoriert das Vorzeichen", () => {
    expect(sumDigits(-45)).toBe(9);
  });
});

describe("4.2 countVowels", () => {
  it("zählt Vokale", () => {
    expect(countVowels("TypeScript")).toBe(2);
    expect(countVowels("Java")).toBe(2);
    expect(countVowels("rhythm")).toBe(0);
  });

  it("zählt Umlaute und Grossbuchstaben mit", () => {
    expect(countVowels("Äpfel und Öl")).toBe(4);
    expect(countVowels("AEIOU")).toBe(5);
  });
});

describe("4.3 isPalindrome", () => {
  it("erkennt Palindrome", () => {
    expect(isPalindrome("Reliefpfeiler")).toBe(true);
    expect(isPalindrome("Lagerregal")).toBe(true);
  });

  it("ignoriert Leer- und Satzzeichen", () => {
    expect(isPalindrome("Ein Esel lese nie!")).toBe(true);
  });

  it("erkennt Nicht-Palindrome", () => {
    expect(isPalindrome("TypeScript")).toBe(false);
  });
});

describe("4.4 collatzSteps", () => {
  it("zählt die Schritte bis 1", () => {
    expect(collatzSteps(1)).toBe(0);
    expect(collatzSteps(2)).toBe(1);
    expect(collatzSteps(6)).toBe(8);
    expect(collatzSteps(27)).toBe(111);
  });

  it("wirft bei ungültigen Eingaben", () => {
    expect(() => collatzSteps(0)).toThrow();
    expect(() => collatzSteps(-5)).toThrow();
    expect(() => collatzSteps(2.5)).toThrow();
  });
});
