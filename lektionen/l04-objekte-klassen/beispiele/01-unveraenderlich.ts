// Ausführen: npx tsx lektionen/l04-objekte-klassen/beispiele/01-unveraenderlich.ts

type Address = { street: string; city: string };
type Customer = { name: string; address: Address; tags: string[] };

const melih: Customer = {
  name: "Melih",
  address: { street: "Bahnhofstrasse 1", city: "Aarau" },
  tags: ["stammkunde"],
};

// ❌ Falsch: flache Kopie, dann verschachtelt ändern
const wrong = { ...melih };
wrong.address.city = "Baden";
console.log("Original nach falscher Kopie:", melih.address.city); // Baden – Original verändert!

// Zurücksetzen für das nächste Beispiel
melih.address.city = "Aarau";

// ✅ Richtig: jede geänderte Ebene neu erzeugen
const moved: Customer = {
  ...melih,
  address: { ...melih.address, city: "Baden" },
};
console.log("Original:", melih.address.city, "| Kopie:", moved.address.city);
console.log("Gleiche Adresse?", melih.address === moved.address); // false
console.log("Gleiche Tags?", melih.tags === moved.tags); // true – unverändert, darum geteilt

// ✅ Array unveränderlich erweitern
const tagged: Customer = { ...melih, tags: [...melih.tags, "vip"] };
console.log("Tags original:", melih.tags, "| neu:", tagged.tags);

// ✅ Feld entfernen mit Rest
const { tags, ...withoutTags } = melih;
console.log("Ohne Tags:", withoutTags, "(entfernt:", tags, ")");

// ✅ Echte tiefe Kopie (selten nötig)
const deep = structuredClone(melih);
deep.address.city = "Wohlen";
console.log("Nach structuredClone:", melih.address.city, deep.address.city);

// 🔧 Experiment: Markiere im Typ Customer alle Felder mit readonly und
// `tags: readonly string[]`. Welche Zeilen in dieser Datei werden jetzt rot?
// So kann der Compiler unveränderliche Updates erzwingen.
