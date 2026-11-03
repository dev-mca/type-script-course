// 🧠 In welcher Reihenfolge erscheinen die Zahlen? Erst raten, dann ausführen:
//    npx tsx lektionen/l08-async/beispiele/01-event-loop-quiz.ts

console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

(async () => {
  console.log("4");
  await null;
  console.log("5");
})();

setTimeout(() => {
  console.log("6");
  Promise.resolve().then(() => console.log("7"));
}, 0);

queueMicrotask(() => console.log("8"));

console.log("9");

// ────────────────────────────────────────────────────────────────────────────
// Auflösung (erst nach dem Ausführen lesen!)
//
// 1 4 9 3 5 8 2 6 7
//
// - 1, 4, 9: synchroner Code läuft zuerst komplett durch.
//   (Die async-Funktion läuft synchron bis zum ersten await – darum kommt 4 so früh.)
// - 3, 5, 8: dann werden ALLE Microtasks abgearbeitet, in der Reihenfolge,
//   in der sie eingereiht wurden (.then, Fortsetzung nach await, queueMicrotask).
// - 2: erst jetzt kommt der erste Timer (Task-Queue).
// - 6: der zweite Timer …
// - 7: … und der Microtask, den er erzeugt hat, läuft sofort danach,
//   noch bevor ein weiterer Timer drankommen würde.
