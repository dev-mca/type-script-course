// Ausführen: npx tsx lektionen/l01-erste-schritte/beispiele/02-zahlen-und-gleichheit.ts
//
// 🧠 Lies jede Zeile und überlege dir die Ausgabe, BEVOR du das Programm startest.

console.log("--- Division ---");
console.log(7 / 2); // ?
console.log(Math.trunc(7 / 2)); // ?
console.log(Math.trunc(-7 / 2), Math.floor(-7 / 2)); // ?
console.log(1 / 0); // ? (in Java: ArithmeticException bei int)

console.log("--- Gleitkomma ---");
console.log(0.1 + 0.2); // ?
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // so vergleicht man Kommazahlen

console.log("--- Grosse Zahlen ---");
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2); // ?!
console.log(2n ** 64n); // bigint: beliebig grosse Ganzzahlen, erkennbar am n

console.log("--- NaN ---");
const parsed = Number("zwölf");
console.log(parsed); // ?
console.log(parsed === parsed); // ?
console.log(Number.isNaN(parsed)); // ?

console.log("--- Umwandlungen ---");
console.log(Number("42"), Number(""), Number("4 2")); // ?
console.log(parseInt("42px", 10)); // parseInt liest so weit es geht
console.log(String(42), (42).toString(2)); // in andere Basis umwandeln

console.log("--- Gleichheit ---");
const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log(a === b); // ? (Referenzvergleich)
console.log(a === c); // ?
console.log("abc" === "ab" + "c"); // ? (Strings: Wertvergleich – anders als == in Java!)

// 🔧 Experiment: Was ergibt (0.1 + 0.2).toFixed(2)? Welchen TYP hat das Ergebnis?
// Tipp: console.log(typeof (0.1 + 0.2).toFixed(2));
