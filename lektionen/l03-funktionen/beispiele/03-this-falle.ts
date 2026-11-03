// Ausführen: npx tsx lektionen/l03-funktionen/beispiele/03-this-falle.ts

class Counter {
  count = 0;

  // normale Methode: this hängt vom Aufruf ab
  increment() {
    this.count++;
  }

  // Arrow-Function-Feld: this ist fest an die Instanz gebunden
  incrementSafe = () => {
    this.count++;
  };
}

const counter = new Counter();

// Aufruf über das Objekt: funktioniert
counter.increment();
console.log("Nach increment():", counter.count);

// Methode als Callback übergeben: this geht verloren
function runCallback(callback: () => void) {
  callback();
}

try {
  runCallback(counter.increment);
} catch (error) {
  console.log("💥", (error as Error).message);
}

// Lösung 1: in eine Arrow Function einwickeln
runCallback(() => counter.increment());
console.log("Mit Wrapper:", counter.count);

// Lösung 2: Arrow-Function-Feld verwenden
runCallback(counter.incrementSafe);
console.log("Mit Arrow-Feld:", counter.count);

// Merke: In React, bei Event-Handlern und bei setTimeout begegnet dir dieses
// Problem ständig. Die Lösung ist fast immer «Arrow Function».
