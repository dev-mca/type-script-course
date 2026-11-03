// 🧠 Compiler-Quiz: Kompiliert die Zeile oder nicht?
//
// Vorgehen:
// 1. Schreib bei jeder auskommentierten Zeile ✅ oder ❌ dahinter (deine Vermutung).
// 2. Entferne dann die Kommentarzeichen // einzeln und schau, was IntelliJ sagt.
// 3. Lies die Fehlermeldung genau – TypeScript-Fehler sind am Anfang ungewohnt,
//    aber sehr präzise.

type Point2D = { x: number; y: number };
type Point3D = { x: number; y: number; z: number };

function printPoint(p: Point2D): string {
  return `(${p.x}, ${p.y})`;
}

const p3: Point3D = { x: 1, y: 2, z: 3 };
const named = { x: 1, y: 2, label: "Ursprung" };

class Pixel {
  constructor(
    public x: number,
    public y: number,
    public color: string,
  ) {}
}

// Frage 1: Ein 3D-Punkt an eine Funktion für 2D-Punkte übergeben?
// printPoint(p3);

// Frage 2: Ein Objekt mit zusätzlichem label über eine Variable?
// printPoint(named);

// Frage 3: Dasselbe Objekt direkt als Literal?
// printPoint({ x: 1, y: 2, label: "Ursprung" });

// Frage 4: Eine Klasse, die nirgends "implements Point2D" sagt?
// printPoint(new Pixel(5, 5, "rot"));

// Frage 5: Ein 2D-Punkt, wo ein 3D-Punkt verlangt ist?
// const q: Point3D = { x: 1, y: 2 };

// Frage 6: Zuweisung in die andere Richtung über Variablen?
// const r: Point2D = p3;
// const s: Point3D = r;

// Auflösung:
// 1 ✅ (p3 hat x und y – z stört nicht)
// 2 ✅ (über eine Variable sind Zusatzfelder erlaubt)
// 3 ❌ (Objektliteral → "excess property check": label ist wohl ein Tippfehler)
// 4 ✅ (strukturell: Pixel hat x und y)
// 5 ❌ (z fehlt)
// 6 erste Zeile ✅, zweite ❌ (r ist "nur" ein Point2D – TS weiss nichts mehr von z)

export {};
