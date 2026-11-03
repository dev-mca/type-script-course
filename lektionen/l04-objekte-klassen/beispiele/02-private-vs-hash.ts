// Ausführen: npx tsx lektionen/l04-objekte-klassen/beispiele/02-private-vs-hash.ts

class WithPrivate {
  private secret = "TypeScript-private";
  reveal(): string {
    return this.secret;
  }
}

class WithHash {
  #secret = "JavaScript-#privat";
  reveal(): string {
    return this.#secret;
  }
}

const a = new WithPrivate();
const b = new WithHash();

// console.log(a.secret); // ← Compilerfehler
// console.log(b.#secret); // ← Compilerfehler (und auch in reinem JS ein Syntaxfehler)

// Zur Laufzeit sieht die Welt anders aus:
console.log("console.log(a):", a); // secret ist sichtbar!
console.log("console.log(b):", b); // #secret erscheint je nach Umgebung gar nicht oder speziell markiert
console.log("JSON a:", JSON.stringify(a)); // {"secret":"TypeScript-private"}
console.log("JSON b:", JSON.stringify(b)); // {}

// private lässt sich mit einem Cast umgehen – #privat nicht
console.log("Umgangen:", (a as unknown as { secret: string }).secret);
console.log("Versuch bei #:", (b as unknown as { secret?: string }).secret); // undefined

// instanceof funktioniert mit Klassen, weil sie zur Laufzeit existieren
console.log("a instanceof WithPrivate:", a instanceof WithPrivate);

// Ein Objekt mit der gleichen Form ist strukturell kompatibel …
const fake: WithHash = { reveal: () => "Fälschung" } as WithHash;
// … aber instanceof erkennt den Unterschied zur Laufzeit
console.log("fake instanceof WithHash:", fake instanceof WithHash);

// Bonus: Klassen mit #privat-Feldern sind NICHT strukturell kompatibel zu
// Objektliteralen. Entferne "as WithHash" oben und lies die Fehlermeldung.
