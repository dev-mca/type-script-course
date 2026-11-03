// 🔧 Diese Datei musst du nicht ausführen – sie ist zum Anschauen in IntelliJ.
// Setz den Cursor auf jeden Variablennamen und drück Ctrl+Shift+P (Type Info).
// Notiere dir vorher, welchen Typ du erwartest!

const a = 42; // ?
let b = 42; // ? (Unterschied zu a?)
const c = "Hallo"; // ?
let d = "Hallo"; // ?
const e = [1, 2, 3]; // ?
const f = [1, "zwei", 3]; // ?
const g = { name: "Melih", age: 25 }; // ?
const h = [1, 2, 3] as const; // ?
const i = Math.random() > 0.5 ? "Kopf" : 42; // ?
const j = e.map((n) => n * 2); // ?
const k = e.find((n) => n > 5); // ? Warum nicht einfach number?
const l = e[10]; // ? (Tipp: noUncheckedIndexedAccess)

function sum(x: number, y: number) {
  return x + y;
}
const m = sum(1, 2); // ? Woher weiss TS den Rückgabetyp?

// Auflösung (erst nach dem Raten!):
// a: 42 (Literal-Typ – const kann sich nie ändern)
// b: number (let könnte später eine andere Zahl bekommen)
// c: "Hallo"            d: string
// e: number[]           f: (string | number)[]
// g: { name: string; age: number }
// h: readonly [1, 2, 3]
// i: "Kopf" | 42
// j: number[]           k: number | undefined (find findet vielleicht nichts!)
// l: number | undefined
// m: number (Rückgabetyp aus "x + y" hergeleitet)

export {}; // macht diese Datei zu einem Modul (Erklärung in Lektion 9)
