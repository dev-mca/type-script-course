// Kein Ausführen nötig – diese Datei ist zum Anschauen in IntelliJ.
// Fahre mit der Maus über `value` in jeder Zeile und beobachte, wie sich der Typ verändert.

function demo(value: string | number | string[] | null | undefined | Date): void {
  // value: string | number | string[] | Date | null | undefined

  if (value === null || value === undefined) {
    // value: null | undefined
    return;
  }
  // value: string | number | string[] | Date   ← null/undefined sind «weggefallen»

  if (typeof value === "number") {
    // value: number
    console.log(value.toFixed(2));
    return;
  }
  // value: string | string[] | Date

  if (value instanceof Date) {
    // value: Date
    console.log(value.toISOString());
    return;
  }
  // value: string | string[]

  if (Array.isArray(value)) {
    // value: string[]
    console.log(value.join(", "));
  } else {
    // value: string
    console.log(value.toUpperCase());
  }
}

// Der Compiler versteht sogar Zuweisungen:
function assignments(): void {
  let x: string | number = "hallo";
  // x: string (TS weiss, was gerade drinsteht)
  x = 42;
  // x: number
  console.log(x.toFixed(1));
}

demo("test");
assignments();
export {};
