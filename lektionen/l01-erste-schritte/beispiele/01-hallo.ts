// Ausführen: npx tsx lektionen/l01-erste-schritte/beispiele/01-hallo.ts
//
// Kein public static void main – Code auf oberster Ebene wird einfach ausgeführt.

const name = "Melih";
const year = 2026;

console.log("Hallo " + name + "!"); // klassisch wie in Java
console.log(`Hallo ${name}, wir haben ${year}.`); // Template-String (Backticks!)

// Template-Strings dürfen mehrzeilig sein und beliebige Ausdrücke enthalten
const report = `
  Name:        ${name.toUpperCase()}
  Zeichen:     ${name.length}
  Nächstes Jahr: ${year + 1}
`;
console.log(report);

// console.log kann auch Objekte und Arrays schön ausgeben
console.log({ name, year, hobbies: ["Code", "Kaffee"] });

// console.table ist praktisch für Listen von Objekten
console.table([
  { sprache: "Java", typisierung: "nominal" },
  { sprache: "TypeScript", typisierung: "strukturell" },
]);

// 🔧 Experiment: Ändere `name` in eine Zahl (const name = 42;).
// Welche Zeilen markiert IntelliJ jetzt rot? Warum genau diese?
