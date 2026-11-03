// Lösung Aufgabe 2 – Higher-Order Functions

export type NumberFn = (n: number) => number;

export function applyTwice(f: NumberFn, x: number): number {
  return f(f(x));
}

export function compose(f: NumberFn, g: NumberFn): NumberFn {
  return (x) => f(g(x));
}

export function pipe(...fns: NumberFn[]): NumberFn {
  return (x) => {
    let result = x;
    for (const fn of fns) {
      result = fn(result);
    }
    return result;
  };
  // Mit reduce (Lektion 6): return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

export function times(n: number, fn: (i: number) => string): string[] {
  const results: string[] = [];
  for (let i = 0; i < n; i++) {
    results.push(fn(i));
  }
  return results;
}

export function between(min: number, max: number): (n: number) => boolean {
  // Die zurückgegebene Funktion ist eine Closure über min und max
  return (n) => n >= min && n <= max;
}

export function countWhere(numbers: number[], predicate: (n: number) => boolean): number {
  let count = 0;
  for (const n of numbers) {
    if (predicate(n)) count++;
  }
  return count;
  // Mit filter (Lektion 6): return numbers.filter(predicate).length;
}
