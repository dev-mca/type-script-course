// Aufgabe 4 – Schleifen und Kontrollstrukturen
// Tests: npm run test:watch -- l01-erste-schritte/uebungen/04
//
// Diese Aufgaben kennst du vom Prinzip her aus Java. Ziel ist, die
// TypeScript-Syntax in die Finger zu bekommen – vor allem for...of.

/**
 * Quersumme einer ganzen Zahl. Negative Zahlen: Vorzeichen ignorieren.
 * sumDigits(1234) → 10
 * sumDigits(-45)  → 9
 */
export function sumDigits(n: number): number {
  throw new Error("TODO: Aufgabe 4.1");
}

/**
 * Zählt die Vokale (a, e, i, o, u, ä, ö, ü) – Gross-/Kleinschreibung egal.
 * countVowels("TypeScript")   → 2
 * countVowels("Äpfel und Öl") → 4
 *
 * Hinweis: for (const char of text) und "aeiouäöü".includes(char)
 */
export function countVowels(text: string): number {
  throw new Error("TODO: Aufgabe 4.2");
}

/**
 * Ist der Text ein Palindrom? Gross-/Kleinschreibung und alle Zeichen,
 * die keine Buchstaben sind (Leerzeichen, Satzzeichen), werden ignoriert.
 * isPalindrome("Reliefpfeiler")     → true
 * isPalindrome("Ein Esel lese nie!") → true
 * isPalindrome("TypeScript")        → false
 */
export function isPalindrome(text: string): boolean {
  throw new Error("TODO: Aufgabe 4.3");
}

/**
 * Collatz-Folge: Ist n gerade, teile durch 2, sonst rechne 3n + 1.
 * Wie viele Schritte braucht es, bis n bei 1 ankommt?
 * collatzSteps(1) → 0
 * collatzSteps(6) → 8   (6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1)
 *
 * Für n < 1 oder Kommazahlen soll ein Error geworfen werden.
 */
export function collatzSteps(n: number): number {
  throw new Error("TODO: Aufgabe 4.4");
}
