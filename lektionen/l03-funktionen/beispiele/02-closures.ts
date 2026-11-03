// Ausführen: npx tsx lektionen/l03-funktionen/beispiele/02-closures.ts

// --- 1. Privater Zustand ohne Klasse -------------------------------------------
function createBankAccount(initial: number) {
  let balance = initial; // von aussen nicht erreichbar!

  return {
    deposit(amount: number): void {
      balance += amount;
    },
    getBalance(): number {
      return balance;
    },
  };
}

const account = createBankAccount(100);
account.deposit(50);
console.log("Kontostand:", account.getBalance()); // 150
// console.log(account.balance); // ← entkommentieren: Fehler, balance existiert nicht

// --- 2. Closures sehen die Variable, nicht den Wert ---------------------------
let greeting = "Hallo";
const sayHello = () => `${greeting} Welt`;
greeting = "Grüezi";
console.log(sayHello()); // ? Rate zuerst!

// --- 3. Jeder Aufruf erzeugt eine neue Closure --------------------------------
function createMultiplier(factor: number) {
  return (n: number) => n * factor;
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(10), triple(10)); // 20 30

// --- 4. let in Schleifen: jede Runde hat ihr eigenes i ------------------------
const callbacks: Array<() => number> = [];
for (let i = 0; i < 3; i++) {
  callbacks.push(() => i);
}
console.log(callbacks.map((cb) => cb())); // [0, 1, 2]

// --- 5. Praxisbeispiel: Konfiguration «einbacken» ------------------------------
function createLogger(prefix: string) {
  let count = 0;
  return (message: string) => {
    count++;
    console.log(`[${prefix} #${count}] ${message}`);
  };
}

const dbLog = createLogger("DB");
const httpLog = createLogger("HTTP");
dbLog("Verbunden");
httpLog("GET /services");
dbLog("Abfrage ausgeführt"); // [DB #2] – eigener Zähler pro Logger

// 🔧 Experiment: Erweitere createLogger um eine zweite zurückgegebene Funktion
// `getCount()`. Tipp: Gib ein Objekt { log, getCount } zurück.
