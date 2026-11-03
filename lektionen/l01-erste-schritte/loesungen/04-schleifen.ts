// Lösung Aufgabe 4 – Schleifen und Kontrollstrukturen

export function sumDigits(n: number): number {
  let sum = 0;
  for (const digit of String(Math.abs(n))) {
    sum += Number(digit);
  }
  return sum;

  // Klassisch mit Modulo – genau wie in Java:
  // let rest = Math.abs(n); let sum = 0;
  // while (rest > 0) { sum += rest % 10; rest = Math.trunc(rest / 10); }
}

export function countVowels(text: string): number {
  let count = 0;
  for (const char of text.toLowerCase()) {
    if ("aeiouäöü".includes(char)) {
      count++;
    }
  }
  return count;
}

export function isPalindrome(text: string): boolean {
  let letters = "";
  for (const char of text.toLowerCase()) {
    // Ein Zeichen ist ein Buchstabe, wenn sich Gross- und Kleinschreibung unterscheiden
    // (funktioniert auch für Umlaute). Alternative: /\p{L}/u.test(char)
    if (char.toUpperCase() !== char.toLowerCase()) {
      letters += char;
    }
  }
  for (let i = 0; i < letters.length / 2; i++) {
    if (letters[i] !== letters[letters.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

export function collatzSteps(n: number): number {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Ungültiger Startwert: ${n}`);
  }
  let steps = 0;
  let current = n;
  while (current !== 1) {
    current = current % 2 === 0 ? current / 2 : 3 * current + 1;
    steps++;
  }
  return steps;
}
