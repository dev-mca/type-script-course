// Lösung Aufgabe 2 – Eine generische, iterierbare Klasse

export class Stack<T> implements Iterable<T> {
  // Intern: Index 0 = unten, letztes Element = oben
  #items: T[];

  constructor(initial: Iterable<T> = []) {
    this.#items = [...initial]; // Kopie – die Eingabe bleibt unberührt
  }

  push(...items: T[]): void {
    this.#items.push(...items);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  peek(): T | undefined {
    return this.#items.at(-1);
  }

  get size(): number {
    return this.#items.length;
  }

  isEmpty(): boolean {
    return this.#items.length === 0;
  }

  toArray(): T[] {
    return [...this.#items];
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.#items.length - 1; i >= 0; i--) {
      yield this.#items[i]!;
    }
  }

  map<U>(fn: (item: T) => U): Stack<U> {
    return new Stack(this.#items.map(fn));
  }
}
