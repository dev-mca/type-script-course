// Ausführen: npx tsx lektionen/l02-typsystem/beispiele/03-any-vs-unknown.ts

// Stell dir vor, diese Daten kommen von einem Server – du weisst nicht sicher, was drin ist.
const json = '{"name": "Melih", "age": "fünfundzwanzig"}';

// ❌ Mit any: Der Compiler hilft dir nicht mehr
const userAny: any = JSON.parse(json);
try {
  console.log(userAny.age.toFixed(1)); // kompiliert – stürzt aber ab
} catch (error) {
  console.log("Absturz mit any:", (error as Error).message);
}

// ✅ Mit unknown: Der Compiler zwingt dich zum Prüfen
const userUnknown: unknown = JSON.parse(json);

// console.log(userUnknown.age); // ← entkommentieren: Compilerfehler!

if (
  typeof userUnknown === "object" &&
  userUnknown !== null &&
  "age" in userUnknown &&
  typeof userUnknown.age === "number"
) {
  console.log("Alter:", userUnknown.age.toFixed(1));
} else {
  console.log("Daten ungültig – age ist keine Zahl. Gut, dass wir geprüft haben.");
}

// Das ist mühsam? Stimmt! Darum gibt es Bibliotheken wie Zod (Lektion 11),
// die solche Prüfungen aus einer Beschreibung erzeugen.

// never: eine Funktion, die nie normal zurückkehrt
function fail(message: string): never {
  throw new Error(message);
}

function getPort(value: string | undefined): number {
  // fail(...) liefert never – darum ist das Ergebnis immer eine number
  return value ? Number(value) : fail("PORT fehlt");
}

console.log("Port:", getPort("3000"));
