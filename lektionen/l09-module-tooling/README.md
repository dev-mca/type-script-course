# Lektion 9 – Module, npm und Tooling

> ⏱ **ca. 3–4 Stunden** · Voraussetzung: Lektion 8 · Schwierigkeit: ●●●○○

## Darum geht's

Bis jetzt hast du in einzelnen Dateien gearbeitet. Echte Projekte bestehen aus Hunderten Modulen und Dutzenden npm-Paketen. In dieser Lektion lernst du das «Drumherum», das in Java Maven, Packages und die JDK-Bibliotheken erledigen: **Module**, **npm**, die **`tsconfig.json`**, **Typdefinitionen** und die wichtigsten **Node.js-APIs** für Dateien, Kommandozeile und Umgebungsvariablen.

Das klingt trocken, ist aber genau das Wissen, das dir fehlt, wenn du ein fremdes Projekt (z. B. euer Dashboard) zum ersten Mal öffnest und verstehen willst, was wo passiert.

**Nach dieser Lektion kannst du:**

- Code sinnvoll auf Module aufteilen (named/default exports, `import type`, Re-Exports)
- `package.json` lesen und Abhängigkeiten richtig verwalten (Semver, Lockfile)
- jede Option in unserer `tsconfig.base.json` erklären
- mit Dateien, Kommandozeilen-Argumenten und Umgebungsvariablen arbeiten

## Ablauf

| # | Art | Was | Zeit |
|---|-----|-----|------|
| 1 | 📖 Lesen | Abschnitte 1–2 (Module) | 25 min |
| 2 | ✍️ Üben | Aufgabe 1 (Refactoring in Module) | 40 min |
| 3 | 📖 Lesen | Abschnitt 3 (npm) | 20 min |
| 4 | 🔧 Experiment | npm-Befehle ausprobieren | 15 min |
| 5 | 📖 Lesen | Abschnitte 4–5 (tsconfig, Typdefinitionen) | 25 min |
| 6 | 🔍 Recherche | tsconfig-Referenz | 15 min |
| 7 | 📖 Lesen | Abschnitt 6 (Node-APIs) | 15 min |
| 8 | ✍️ Üben | Aufgaben 2–4 | 70 min |
| 9 | 📖 Lesen | Abschnitt 7 (Codequalität) – optional ESLint einrichten | 20 min |

---

## 1. ES-Module

Jede `.ts`-Datei, die `import` oder `export` enthält, ist ein **Modul** mit eigenem Gültigkeitsbereich. Was nicht exportiert wird, ist von aussen unsichtbar – ähnlich wie package-private in Java, aber auf Dateiebene.

```ts
// preise.ts
export const VAT_RATE = 0.081;                       // named export
export function withVat(net: number): number { … }   // named export
export type Price = { net: number; gross: number };  // Typ-Export
function round(x: number) { … }                      // privat – nicht exportiert

export default class PriceCalculator { … }           // default export (max. einer pro Datei)
```

```ts
// main.ts
import PriceCalculator, { VAT_RATE, withVat } from "./preise";  // default + named
import { withVat as addVat } from "./preise";                   // umbenennen
import * as prices from "./preise";                             // alles als Namespace: prices.withVat(...)
import type { Price } from "./preise";                           // nur ein Typ
```

### Named oder default?

Die meisten Teams bevorzugen **named exports**: Der Name ist beim Importieren festgelegt (keine verschiedenen Namen für dasselbe in verschiedenen Dateien), Autovervollständigung und Umbenennen in IntelliJ funktionieren besser. `default` wird vor allem von Frameworks verlangt (z. B. React-Seiten in Next.js, Vite-Konfigurationen).

### `import type`

Wir haben `verbatimModuleSyntax` aktiviert. Das bedeutet: Importierst du **nur einen Typ**, musst du `import type` schreiben. Der Grund: Werkzeuge wie tsx, Vite oder Node.js entfernen Typen Datei für Datei, ohne das ganze Projekt zu analysieren. Mit `import type` sehen sie sofort, dass dieser Import zur Laufzeit komplett wegfallen kann. IntelliJ fügt das `type` beim Auto-Import automatisch ein.

```ts
import { type Order, ORDERS } from "./daten";   // gemischt: ein Typ, ein Wert
```

### Re-Exports und «Barrel»-Dateien

```ts
// bibliothek/index.ts – die «öffentliche Schnittstelle» eines Ordners
export { parseCsv } from "./csv";
export { formatTable } from "./tabelle";
export type { Row } from "./typen";
```

Andere Dateien importieren dann nur noch `from "./bibliothek"` (ohne `/index` – das wird automatisch aufgelöst). Das ist wie die öffentliche API eines Java-Packages: Interna bleiben verborgen, und du kannst die innere Struktur ändern, ohne alle Importe anzupassen.

> ⚠️ **Zirkuläre Importe** (A importiert B, B importiert A) sind erlaubt, führen aber zu schwer verständlichen Fehlern («Cannot access 'X' before initialization»). Wenn dir das begegnet: gemeinsame Teile in ein drittes Modul auslagern.

## 2. CommonJS, Dateiendungen und Modulauflösung

Du wirst in älterem Code und in Stack-Overflow-Antworten **CommonJS** begegnen – dem alten Node.js-Modulsystem:

```js
const fs = require("fs");          // statt import
module.exports = { parseCsv };     // statt export
```

Neue Projekte verwenden ES-Module (bei uns: `"type": "module"` in `package.json`). Du musst CommonJS nur *lesen* können.

### Warum schreiben wir Importe ohne `.ts`?

Wir verwenden `"moduleResolution": "bundler"`. Damit verhält sich TypeScript wie Vite, tsx oder Vitest, die Dateiendungen selbst ergänzen. Läuft Code **direkt in Node.js** (ohne Werkzeug dazwischen), muss die Endung dabeistehen. Das sieht man in reinen Node-Projekten mit `"moduleResolution": "nodenext"`:

```ts
import { parseCsv } from "./csv.js";   // ja, .js – obwohl die Datei csv.ts heisst!
```

### Node.js führt TypeScript direkt aus

Seit Node.js 22.18 kann Node selbst `.ts`-Dateien ausführen, indem es die Typen einfach wegstreicht (*Type Stripping*): `node datei.ts`. Das funktioniert aber nur mit Syntax, die sich durch reines Entfernen in JavaScript verwandeln lässt. `enum`, `namespace` und Parameter Properties (`constructor(private x: number)`) gehören **nicht** dazu. Die Option `erasableSyntaxOnly` lässt den Compiler genau diese Konstrukte verbieten. Darum sind Literal-Unions statt Enums in modernem Code so beliebt.

> 🌐 **Doku (15 min):** [Node.js: Running TypeScript Natively](https://nodejs.org/en/learn/typescript/run-natively) und [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (Abschnitte «Exporting module features» bis «Renaming imports and exports»).

> ✍️ **Jetzt Aufgabe 1** (`uebungen/01-module/`).

---

## 3. npm und `package.json`

Öffne unsere [`package.json`](../../package.json) und lies mit:

| Feld | Bedeutung | Java-Vergleich |
|------|-----------|----------------|
| `name`, `version` | Identität des Pakets | `groupId`/`artifactId`/`version` |
| `type: "module"` | `.js`-Dateien sind ES-Module | – |
| `engines` | benötigte Node-Version | `maven.compiler.release` |
| `scripts` | Befehle für `npm run <name>` | Maven-Goals / Gradle-Tasks |
| `dependencies` | wird zur Laufzeit gebraucht | `<scope>compile</scope>` |
| `devDependencies` | nur für Entwicklung (Compiler, Tests) | `<scope>test</scope>` / `provided` |

### Versionen: Semver und `^`

```text
"zod": "^4.1.0"
         │ │ └─ Patch: Bugfixes
         │ └─── Minor: neue Features, rückwärtskompatibel
         └───── Major: Breaking Changes

^4.1.0  → erlaubt 4.1.0 bis < 5.0.0   (Standard bei npm install)
~4.1.0  → erlaubt 4.1.0 bis < 4.2.0
 4.1.0  → genau diese Version
```

### `package-lock.json` – immer committen!

Das Lockfile hält fest, welche **exakten** Versionen (inklusive aller indirekten Abhängigkeiten) installiert wurden. So bekommt jede Person im Team und jeder Build-Server dasselbe. In Java gibt es das so nicht direkt (Maven löst Versionen deterministisch auf; Gradle hat optionale Lockfiles).

### Die wichtigsten Befehle

```bash
npm install                 # alles aus package.json installieren (aktualisiert ggf. das Lockfile)
npm ci                      # exakt nach Lockfile installieren – für CI/Build-Server
npm install zod             # Laufzeit-Abhängigkeit hinzufügen
npm install -D vitest       # Entwicklungs-Abhängigkeit hinzufügen
npm uninstall zod           # entfernen
npm run test                # Skript ausführen (bei "test" und "start" geht auch: npm test)
npx tsc --version           # Programm aus node_modules/.bin ausführen
npm outdated                # welche Pakete sind veraltet?
npm audit                   # bekannte Sicherheitslücken prüfen
```

> 🔧 **Experiment (15 min):** Führe `npm outdated` und `npm ls --depth=0` aus. Schau dann in den Ordner `node_modules/zod` – findest du die `package.json` und die `.d.ts`-Dateien? Wie viele Ordner liegen insgesamt in `node_modules`, obwohl wir nur wenige Pakete direkt angegeben haben?

---

## 4. Die `tsconfig.json` verstehen

Öffne [`tsconfig.base.json`](../../tsconfig.base.json). Hier die Erklärung jeder Option:

| Option | Was sie bewirkt |
|--------|-----------------|
| `target: "es2024"` | Welche JS-Version erzeugt wird. Neuere Syntax wird nicht «heruntergebrochen». |
| `lib: ["es2024"]` | Welche eingebauten APIs TypeScript kennt (z. B. `Object.groupBy`). Für Browsercode kommt `"DOM"` dazu (siehe Lektion 12). |
| `module: "preserve"` | `import`/`export` werden unverändert gelassen – das Ausführungswerkzeug kümmert sich darum. |
| `moduleResolution: "bundler"` | Importe wie bei Vite/tsx auflösen (ohne Dateiendung, mit `index.ts`). |
| `moduleDetection: "force"` | Jede Datei ist ein Modul, auch ohne `import`/`export`. |
| `resolveJsonModule` | `import data from "./data.json"` ist erlaubt und typisiert. |
| `verbatimModuleSyntax` | Typ-Importe müssen mit `import type` markiert werden (siehe oben). |
| `isolatedModules` | Jede Datei muss einzeln übersetzbar sein (Voraussetzung für tsx, Vite, esbuild). |
| `types: ["node"]` | Lädt die Typdefinitionen für Node.js (`process`, `fs` …). Seit TS 6 werden `@types`-Pakete nicht mehr automatisch geladen. |
| `strict` | Schaltet alle strengen Prüfungen ein (u. a. `strictNullChecks`, `noImplicitAny`). |
| `noUncheckedIndexedAccess` | `arr[i]` und `record[key]` liefern `… \| undefined`. |
| `noImplicitOverride` | `override` ist Pflicht beim Überschreiben. |
| `noFallthroughCasesInSwitch` | Verhindert vergessene `break`/`return` im `switch`. |
| `noEmit` | `tsc` prüft nur und erzeugt keine Dateien. |
| `skipLibCheck` | `.d.ts`-Dateien von Paketen werden nicht geprüft (schneller, weniger fremde Fehler). |

> 🔍 **Recherche-Auftrag (15 min):** Suche in der [tsconfig-Referenz](https://www.typescriptlang.org/tsconfig/) nach `noUnusedLocals`, `exactOptionalPropertyTypes` und `erasableSyntaxOnly`. Was machen sie? Würdest du sie für ein neues Projekt einschalten? Schreib deine Antwort in `FORTSCHRITT.md` unter «Notizen».

## 5. Typdefinitionen: `.d.ts` und `@types`

Viele npm-Pakete sind in TypeScript geschrieben und liefern ihre Typen mit (z. B. Zod, Hono, Vitest). Ältere, reine JavaScript-Pakete haben keine Typen. Für sie gibt es das Community-Projekt **DefinitelyTyped**, das Typdefinitionen als eigene Pakete veröffentlicht:

```bash
npm install express          # JavaScript-Paket ohne eigene Typen
npm install -D @types/express  # Typdefinitionen dazu
```

Eine `.d.ts`-Datei enthält **nur Typen**, keinen ausführbaren Code – wie ein Java-Interface ohne Implementierung. Schau dir zum Beispiel `node_modules/@types/node/fs/promises.d.ts` an: Da steht jede Funktion von `fs/promises` mit Signatur und Dokumentation. IntelliJ springt mit **Ctrl+B** auf eine Funktion genau dorthin.

---

## 6. Node.js-APIs für den Alltag

Eingebaute Module importierst du mit dem Präfix `node:`:

```ts
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

// Dateien (immer die Promise-Variante aus fs/promises verwenden)
const text = await readFile("daten.json", "utf8");
await mkdir("ausgabe", { recursive: true });
await writeFile("ausgabe/report.txt", "Hallo", "utf8");

// Pfade plattformunabhängig zusammensetzen
const file = path.join(import.meta.dirname, "daten", "services.json");
path.extname("bild.png");      // ".png"
path.basename("/a/b/c.txt");   // "c.txt"

// Kommandozeile: npx tsx app.ts --input a.txt -v
process.argv;                  // ["/pfad/zu/node", "/pfad/zu/app.ts", "--input", "a.txt", "-v"]

// Umgebungsvariablen: PORT=4000 npx tsx app.ts
process.env.PORT;              // "4000" – IMMER string | undefined
```

`import.meta.dirname` ist der Ordner der aktuellen Datei – das Pendant zu `__dirname` in CommonJS.

> 🌐 **Doku (Nachschlagen):** [Node.js fs/promises](https://nodejs.org/api/fs.html#promises-api), [path](https://nodejs.org/api/path.html), [util.parseArgs](https://nodejs.org/api/util.html#utilparseargsconfig)

> ✍️ **Jetzt Aufgaben 2–4.**

---

## 7. Codequalität: Prettier und ESLint

**Prettier** formatiert Code automatisch einheitlich (Einrückung, Anführungszeichen, Zeilenumbrüche). Es ist in diesem Projekt installiert:

```bash
npm run format
```

In IntelliJ: *Settings → Languages & Frameworks → JavaScript → Prettier* → «Automatic Prettier configuration» und «Run on save» aktivieren.

**ESLint** findet *inhaltliche* Probleme, die der Compiler durchlässt – z. B. vergessene `await` (`no-floating-promises`), unbenutzte Variablen oder gefährliche `any`. Für TypeScript verwendet man das Paket `typescript-eslint`. Wir haben es nicht vorinstalliert, damit das Projekt schlank bleibt. Wenn du es ausprobieren willst (empfohlen!):

```bash
npm install -D eslint typescript-eslint
```

```js
// eslint.config.js (im Hauptordner)
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["**/loesungen/**", "**/kompilieren/**"] },
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
);
```

```bash
npx eslint lektionen/l08-async
```

Falls sich die Konfiguration inzwischen geändert hat: [typescript-eslint – Getting Started](https://typescript-eslint.io/getting-started) ist die verlässliche Quelle.

---

## 8. ✍️ Übungen

```bash
npm run test:watch -- l09
```

| Nr | Datei | Thema | ★ |
|----|-------|-------|---|
| 1 | `01-module/` | Code in Module aufteilen, Barrel-Datei | ★★☆ |
| 2 | `02-dateien.ts` | `fs/promises`, `path`, rekursiv Dateien finden | ★★☆ |
| 3 | `03-cli.ts` | Kommandozeilen-Argumente mit `parseArgs` | ★★☆ |
| 4 | `04-config.ts` | Konfiguration aus Umgebungsvariablen validieren | ★★☆ |

Nach Aufgabe 3 kannst du dein CLI-Programm wirklich ausführen:

```bash
npx tsx lektionen/l09-module-tooling/uebungen/03-cli-main.ts --input README.md
npx tsx lektionen/l09-module-tooling/uebungen/03-cli-main.ts -i README.md --format json
```

---

## 9. ✅ Selbstcheck

<details>
<summary>1. Warum braucht es bei uns <code>import type</code>?</summary>

Wegen `verbatimModuleSyntax`: Werkzeuge, die Datei für Datei übersetzen, müssen ohne Projektanalyse erkennen können, dass ein Import nur Typen enthält und zur Laufzeit wegfallen kann.
</details>

<details>
<summary>2. Was ist der Unterschied zwischen <code>dependencies</code> und <code>devDependencies</code>?</summary>

`dependencies` braucht die Anwendung zur Laufzeit (z. B. Hono, Zod). `devDependencies` nur zum Entwickeln, Testen und Bauen (TypeScript, Vitest, Prettier).
</details>

<details>
<summary>3. Welche Versionen erlaubt <code>"^2.3.1"</code>?</summary>

Alle von 2.3.1 bis ausschliesslich 3.0.0 – also neue Minor- und Patch-Versionen, aber keine neue Major-Version.
</details>

<details>
<summary>4. Welchen Typ hat <code>process.env.PORT</code> – und was folgt daraus?</summary>

`string | undefined`. Man muss den Wert immer prüfen und bei Bedarf umwandeln (`Number(...)`), bevor man ihn verwendet.
</details>

<details>
<summary>5. Was macht <code>npm ci</code> anders als <code>npm install</code>?</summary>

`npm ci` installiert exakt die Versionen aus `package-lock.json`, löscht vorher `node_modules` und verändert das Lockfile nie. Ideal für reproduzierbare Builds.
</details>

## 10. Weiterführend (optional)

- [Handbook: Modules – Theory](https://www.typescriptlang.org/docs/handbook/modules/theory.html) – sehr gründlich, wenn du Modulauflösung wirklich verstehen willst
- [npm Docs: package.json](https://docs.npmjs.com/cli/configuring-npm/package-json)
- [Total TypeScript: TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet)

---

### Abschluss-Checkliste

- [ ] Alle Tests von `l09` sind grün
- [ ] Ich habe das CLI aus Aufgabe 3 einmal ausgeführt
- [ ] Recherche-Auftrag in `FORTSCHRITT.md` notiert
- [ ] `FORTSCHRITT.md` aktualisiert und committet

🎯 **Jetzt ist Zeit für [Projekt B – Buchungsauswertung](../../projekte/projekt-b-auswertung/README.md)!** Danach weiter mit [Lektion 10 – Fortgeschrittene Typen](../l10-fortgeschrittene-typen/README.md).
