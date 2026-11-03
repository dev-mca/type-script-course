// Ausführen: npx tsx lektionen/l07-generics/beispiele/02-iterable.ts

// --- 1. Ein einfacher Generator --------------------------------------------
function* countdown(from: number): Generator<number> {
  for (let i = from; i > 0; i--) {
    console.log(`  (erzeuge ${i})`);
    yield i;
  }
}

console.log("Generatoren sind lazy – sie rechnen erst, wenn jemand fragt:");
for (const n of countdown(3)) {
  console.log("Empfangen:", n);
}

// --- 2. Eine eigene iterierbare Klasse --------------------------------------
class TimeSlots implements Iterable<string> {
  constructor(
    private readonly startMinutes: number,
    private readonly endMinutes: number,
    private readonly stepMinutes: number,
  ) {}

  *[Symbol.iterator](): Iterator<string> {
    for (let m = this.startMinutes; m < this.endMinutes; m += this.stepMinutes) {
      const hours = String(Math.floor(m / 60)).padStart(2, "0");
      const minutes = String(m % 60).padStart(2, "0");
      yield `${hours}:${minutes}`;
    }
  }
}

const morning = new TimeSlots(9 * 60, 11 * 60, 30);

console.log("\nfor...of:");
for (const slot of morning) {
  console.log(" ", slot);
}

console.log("\nSpread in ein Array:", [...morning]);
console.log(
  "Array.from mit map:",
  Array.from(morning, (s) => `[${s}]`),
);

// --- 3. Unendliche Generatoren + take --------------------------------------
function* naturalNumbers(): Generator<number> {
  let n = 1;
  while (true) yield n++; // unendlich – aber lazy, darum kein Problem
}

function* take<T>(iterable: Iterable<T>, count: number): Generator<T> {
  if (count <= 0) return;
  let taken = 0;
  for (const item of iterable) {
    yield item;
    if (++taken >= count) return;
  }
}

console.log("\nDie ersten 5 natürlichen Zahlen:", [...take(naturalNumbers(), 5)]);

// 🔧 Experiment: Schreib einen Generator `fibonacci()` und gib mit take die
// ersten 10 Fibonacci-Zahlen aus.
