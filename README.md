# TypeScript von A bis Z – für Java-Umsteiger

Willkommen! Dieser Kurs bringt dich von «Ich kann Java» zu «Ich kann eine Full-Stack-Web-App in TypeScript bauen». Er setzt voraus, dass du programmieren kannst – Variablen, Schleifen, Klassen, Interfaces, Generics und ein bisschen Streams kennst du aus Java. Darum erklärt er nicht, *was* eine Schleife ist, sondern **was in TypeScript anders ist** und **wie man in TypeScript denkt**.

```text
 Grundlagen          Kern der Sprache         Ökosystem            Anwendung
 ──────────          ────────────────         ─────────            ─────────
 L1  Erste Schritte  L5  Unions/Narrowing     L8  Async            L11 Backend-API
 L2  Typsystem       L6  Arrays/Collections   L9  Module/npm       L12 Frontend/React
 L3  Funktionen      🎯  Projekt A            🎯  Projekt B         🎓  Abschlussprojekt
 L4  Objekte/Klassen L7  Generics             L10 Fortg. Typen
```

**Gesamtumfang:** rund 95 Stunden. Bei 4 Stunden pro Woche etwa ein halbes Jahr, bei 6 Stunden etwa 4 Monate. Der [Kursplan](KURSPLAN.md) zeigt einen Vorschlag – und wie du mit Prüfungsphasen umgehst.

---

## 1. Einrichten (einmalig, ca. 20 Minuten)

Der Kurs läuft auf **Linux, macOS und Windows**. Wo sich die Schritte unterscheiden, gibt es je einen Abschnitt pro Betriebssystem – nimm einfach den, der zu dir passt. Alle Kursbefehle (`npm …`, `npx …`) sind auf jedem System gleich.

> **Welches Terminal?**
> - **Linux / macOS:** das normale Terminal (auf dem Mac: *Terminal* oder *iTerm2*).
> - **Windows:** **PowerShell** (am besten in der App *Windows Terminal*). Die alte Eingabeaufforderung (`cmd.exe`) und WSL brauchst du nicht.
>
> In IntelliJ ist das eingebaute Terminal bereits passend eingestellt.

### Node.js installieren

Du brauchst **Node.js 22.12 oder neuer** (empfohlen: die aktuelle LTS-Version). Prüfe im Terminal:

```bash
node --version    # z. B. v24.11.0 oder v26.x
npm --version
```

Ist Node zu alt oder fehlt es, installierst du es so:

#### Fedora / Linux

```bash
sudo dnf install nodejs
```

Ist die Fedora-Version immer noch zu alt, installiere den Versionsmanager **fnm** (praktisch, wenn du später mehrere Projekte mit verschiedenen Node-Versionen hast):

```bash
curl -fsSL https://fnm.vercel.app/install | bash   # danach Terminal neu öffnen
fnm install --lts
fnm default lts-latest
```

#### macOS

Am einfachsten geht es mit dem Paketmanager **Homebrew** ([brew.sh](https://brew.sh)):

```bash
# Homebrew installieren (nur falls `brew --version` einen Fehler zeigt)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node git
```

Folge am Ende der Homebrew-Installation den angezeigten «Next steps» (sie tragen `brew` in deinen `PATH` ein), und öffne danach ein neues Terminal.

Ohne Homebrew: Den **macOS-Installer (.pkg)** der LTS-Version von [nodejs.org](https://nodejs.org) herunterladen und durchklicken.

Mit Versionsmanager **fnm** (optional, siehe Linux):

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc   # danach Terminal neu öffnen
fnm install --lts
fnm default lts-latest
```

#### Windows

In **PowerShell** (neuere Windows-10/11-Versionen haben `winget` bereits eingebaut):

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

Danach **PowerShell komplett schliessen und neu öffnen** (damit der neue `PATH` gilt) und `node --version` prüfen.

Ohne `winget`: Den **Windows-Installer (.msi)** der LTS-Version von [nodejs.org](https://nodejs.org) und Git von [git-scm.com](https://git-scm.com) installieren.

Mit Versionsmanager **fnm** (optional, siehe Linux):

```powershell
winget install Schniz.fnm
notepad $PROFILE        # Datei anlegen lassen und diese Zeile einfügen, speichern:
# fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm install --lts
fnm default lts-latest
```

### Projekt vorbereiten

Git brauchst du für den nächsten Schritt. Auf Fedora und Windows (siehe oben) ist es nach der Installation vorhanden; auf dem Mac bringt `brew install git` es mit – alternativ installiert `xcode-select --install` die Entwicklerwerkzeuge von Apple inklusive Git.

```bash
cd typescript-kurs
git init && git add . && git commit -m "Kursstart"   # damit du jederzeit zurückkannst
npm install                                         # lädt TypeScript, Vitest, React … (1–2 Minuten)
npm test -- l01                                     # sollte laufen und viele rote Tests zeigen ✔
```

Diese Befehle funktionieren unverändert in Bash, zsh und PowerShell. Rote Tests sind am Anfang **richtig so** – genau die machst du in Lektion 1 grün.

> 🪟 **Nur Windows:** Zeigt PowerShell bei `npm` die Meldung «Die Datei npm.ps1 kann nicht geladen werden … Ausführung von Skripts ist auf diesem System deaktiviert», gib einmalig ein: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Details siehe Abschnitt 5.

> 💡 **Tipp:** Lege dir ein **privates** Repository auf GitHub oder GitLab an und pushe regelmässig (du klonst ja ohnehin per SSH). So hast du ein Backup – und kannst mir später für Reviews einfach den Stand zeigen.

### IntelliJ IDEA Ultimate einrichten

> **Wo sind die Einstellungen?**
> - **Linux / Windows:** *File → Settings…* (Tastenkürzel **Ctrl+Alt+S**)
> - **macOS:** *IntelliJ IDEA → Settings…* (Tastenkürzel **⌘ ,**)
>
> Wenn unten «Settings» steht, ist immer dieser Dialog gemeint.

1. **Öffnen:** *File → Open…* → den Ordner `typescript-kurs` wählen → «Trust Project».
2. **Node.js:** *Settings → Languages & Frameworks → Node.js* → Node-Interpreter auswählen. Typische Pfade:
   - Linux: `/usr/bin/node` (oder der Pfad von fnm)
   - macOS: `/opt/homebrew/bin/node` (Apple-Silicon-Macs) bzw. `/usr/local/bin/node` (Intel-Macs)
   - Windows: `C:\Program Files\nodejs\node.exe`

   Den genauen Pfad zeigt dir das Terminal: `which node` (Linux/macOS) bzw. `Get-Command node` (Windows). «Coding assistance for Node.js» aktivieren.
3. **TypeScript:** *Settings → Languages & Frameworks → TypeScript* → Bei «TypeScript» sollte `…/typescript-kurs/node_modules/typescript` stehen (die Projektversion, **nicht** «Bundled»). «TypeScript language service» aktiviert lassen.
4. **TS-Dateien per Rechtsklick ausführen:** *Run → Edit Configurations… → Edit configuration templates… → Node.js* → bei «Node parameters» eintragen: `--import tsx` → OK. Ab jetzt funktioniert Rechtsklick auf eine `.ts`-Datei → *Run*.
5. **Prettier:** *Settings → Languages & Frameworks → JavaScript → Prettier* → «Automatic Prettier configuration» und «Run on save» aktivieren. Dann wird jede Datei beim Speichern formatiert.
6. **Tests:** IntelliJ erkennt Vitest automatisch. In jeder `*.test.ts`-Datei erscheint ein grüner ▶ neben `describe` und `it`. Für den Watch-Modus nimmst du am besten das Terminal in IntelliJ (**Alt+F12**, auf dem Mac **⌥F12**).

Hilfreiche Tastenkürzel:

| Was | Linux / Windows | macOS |
|-----|-----------------|-------|
| Typ des Ausdrucks unter dem Cursor anzeigen – das wirst du ständig brauchen | **Ctrl+Shift+P** | **Ctrl+Shift+P** |
| Zur Definition springen (auch in die `.d.ts`-Dateien von Bibliotheken) | **Ctrl+B** | **⌘B** |
| Dokumentation anzeigen | **Ctrl+Q** | **F1** (oder **Ctrl+J**) |
| Quick-Fix (z. B. fehlenden Import ergänzen) | **Alt+Enter** | **⌥Enter** |
| Umbenennen (Refactoring) | **Shift+F6** | **⇧F6** |
| Aktuelle Datei bzw. aktuellen Test ausführen | **Ctrl+Shift+F10** | **⌃⇧R** |

> 🍎 **Mac-Hinweis:** Auf vielen Mac-Tastaturen musst du für F-Tasten zusätzlich **fn** drücken (z. B. **fn+⇧F6**), sofern du die F-Tasten nicht in den Systemeinstellungen als Standardfunktionstasten festgelegt hast.

---

## 2. So arbeitest du mit dem Kurs

Jede Lektion liegt in `lektionen/lXX-…/` und ist gleich aufgebaut:

```text
l03-funktionen/
├── README.md        ← START HIER: Theorie, Ablaufplan, Doku-Links, Selbstcheck
├── beispiele/       ← Code zum Ausführen, Verändern, Experimentieren
├── uebungen/        ← deine Aufgaben + Tests  (hier arbeitest du)
└── loesungen/       ← Musterlösungen          (erst NACH dem eigenen Versuch!)
```

Jedes README beginnt mit einer **Ablauf-Tabelle**, die Lesen, Doku, Ausprobieren und Üben abwechselt. Folge ihr der Reihe nach – die Abwechslung ist Absicht (mehr dazu im [Kursplan](KURSPLAN.md)).

| Symbol | Bedeutung |
|--------|-----------|
| 🧠 | Aufwärmen: erst raten, dann prüfen |
| 📖 | Im README lesen |
| 🌐 | In der offiziellen Doku lesen (mit genauer Angabe, welcher Abschnitt) |
| ▶️ | Beispiel ausführen und verändern |
| 🔧 | Experiment |
| ✍️ | Übung |
| 🔍 | Recherche-Auftrag: selbst in der Doku etwas herausfinden |
| ✅ | Selbstcheck |

### Drei Arten von Übungen

1. **Mit Tests** (die meisten): Funktionen mit `throw new Error("TODO …")` implementieren, bis die Tests grün sind.
   ```bash
   npm run test:watch -- l03                 # alle Tests der Lektion, laufen bei jedem Speichern neu
   npm run test:watch -- l03-funktionen/uebungen/02   # nur eine Datei
   ```
   Tests, die einen Fehler *erwarten* («wirft bei …»), sind manchmal schon am Anfang grün, weil der TODO-Platzhalter auch einen Fehler wirft. Das ist normal.

   > 🪟 Pfade schreibst du auch unter Windows mit normalen Schrägstrichen (`/`), so wie oben.

2. **Vom Compiler geprüft** (Typ-Aufgaben in L2, L7, L10): Fertig, wenn die Datei in IntelliJ keine roten Markierungen mehr hat.
   ```bash
   npx tsc --noEmit -p lektionen/l02-typsystem
   ```

3. **Im Browser geprüft** (L12, Abschlussprojekt): mit Checkliste im README.

Bei manchen Aufgaben ist **die Signatur absichtlich unvollständig** oder eine **Klasse noch leer** – dann ist auch die Testdatei rot markiert, bis du Parameter, Felder und Methoden ergänzt hast. Die Tests laufen trotzdem (Vitest ignoriert Typfehler beim Ausführen). Das steht jeweils in der Aufgabe.

### Die 20-Minuten-Regel für Lösungen

1. Selbst versuchen. Steckst du fest: Fehlermeldung genau lesen, Test genau lesen.
2. Nach ~10 Minuten: den Hinweis im Aufgabenkommentar und die verlinkte Doku lesen.
3. Nach ~20 Minuten: in `loesungen/` schauen – **nur** die eine Funktion. Dann Datei schliessen und selbst nochmals schreiben.
4. Nach jeder gelösten Aufgabe: Vergleiche mit der Musterlösung. Welche Variante ist lesbarer? Warum?

### Nach jeder Lektion

- Selbstcheck im README ohne Nachschauen beantworten
- [`FORTSCHRITT.md`](FORTSCHRITT.md) ausfüllen (2 Minuten)
- Committen: `git add . && git commit -m "Lektion 3 fertig"`
  (In PowerShell ab Version 7 geht auch `&&`; in der älteren Windows-PowerShell 5.1 schreibst du die beiden Befehle in zwei Zeilen oder trennst sie mit `;`.)

---

## 3. Reviews und Hilfe

Bei den Projekten (und wann immer du willst) kannst du mir deinen Code für ein **Code-Review** schicken. Wie das geht und welche Vorlage du dafür verwendest, steht in [`REVIEW.md`](REVIEW.md).

> Wichtig zu wissen: In einem neuen Chat habe ich nicht automatisch alle Details dieses Kurses präsent. Darum schickst du beim Review `FORTSCHRITT.md` mit – dann weiss ich sofort, wo du stehst und was dir schwerfiel.

---

## 4. Alle Befehle auf einen Blick

| Befehl | Was |
|--------|-----|
| `npm test` | Alle Tests einmal ausführen |
| `npm test -- l05` | Nur Tests, deren Pfad «l05» enthält |
| `npm run test:watch -- l05` | Wie oben, aber automatisch bei jeder Änderung |
| `npm test -- projekt-a -t M2` | Nur Tests, deren Name «M2» enthält |
| `npx tsc --noEmit -p lektionen/l05-unions-narrowing` | Typen einer Lektion prüfen |
| `npm run typecheck` | Typen des ganzen Kurses prüfen (zeigt auch Fehler in noch nicht gelösten Lektionen!) |
| `npx tsx <datei.ts>` | Eine TypeScript-Datei ausführen |
| `npm run format` | Code mit Prettier formatieren |
| `npm run projekt-a` / `npm run projekt-b -- …` | Projekte ausführen |
| `npm run api` / `npm run api:hono` | API aus Lektion 11 starten |
| `npm run web:dom` / `npm run web:react` | Frontend aus Lektion 12 starten |
| `npm run final:api` / `npm run final:web` | Abschlussprojekt starten |

Alle diese Befehle sind auf Linux, macOS und Windows identisch. Einzige Ausnahme: **Umgebungsvariablen setzen** (z. B. einen anderen Port, siehe Abschnitt 5) – das geht je nach System anders:

| System | Beispiel |
|--------|----------|
| Linux / macOS (Bash, zsh) | `PORT=3001 npm run api` |
| Windows PowerShell | `$env:PORT=3001; npm run api` |

---

## 5. Wenn etwas nicht funktioniert

| Problem | Lösung |
|---------|--------|
| `npm install` meldet «Unsupported engine» | Node ist zu alt → Abschnitt 1 |
| `node` oder `npm` «nicht gefunden» (`command not found` / «nicht erkannt») direkt nach der Installation | Terminal komplett schliessen und neu öffnen (unter Windows auch IntelliJ neu starten), damit der neue `PATH` gelesen wird. Auf dem Mac ausserdem die «Next steps» der Homebrew-Installation ausführen. |
| `Cannot find module 'vitest'` o. ä. | `npm install` im Hauptordner ausführen |
| 🪟 PowerShell: «npm.ps1 kann nicht geladen werden … Skripts ist deaktiviert» | Einmalig `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` eingeben und mit `J` bestätigen. Alternativ im IntelliJ-Terminal arbeiten oder `npm.cmd` statt `npm` verwenden. |
| 🪟 Prettier meldet überall «Delete ␍» (Zeilenenden) | Git hat auf Windows CRLF-Zeilenenden erzeugt. Einmal `npm run format` ausführen und künftig `git config --global core.autocrlf input` setzen. |
| IntelliJ zeigt rote Fehler, `npx tsc` aber nicht (oder umgekehrt) | Unten in der Statusleiste auf «TypeScript» klicken → *Restart TypeScript Service*. Prüfen, dass Schritt 3 der IntelliJ-Einrichtung stimmt. |
| Rechtsklick → Run führt `.ts` nicht aus | Schritt 4 der IntelliJ-Einrichtung; oder im Terminal `npx tsx datei.ts` |
| `EADDRINUSE: address already in use :::3000` | Es läuft schon ein Server. Alten Prozess im IntelliJ-Terminal mit *Ctrl+C* beenden (auch auf dem Mac **Ctrl**, nicht ⌘), oder einen anderen Port wählen: `PORT=3001 npm run api` (Linux/macOS) bzw. `$env:PORT=3001; npm run api` (Windows PowerShell) |
| Frontend zeigt «Services konnten nicht geladen werden» | Läuft die API (`npm run api`) in einem zweiten Terminal? |
| Ein Test ist «flaky» (mal grün, mal rot) | Bei Async-Tests mit Zeitmessung kann ein sehr ausgelasteter Laptop stören. Nochmals laufen lassen; bleibt er rot, liegt es am Code. |

---

## 6. Versionen

Der Kurs wurde im November 2026 erstellt mit: Node.js 22/24/26, TypeScript 6, Vitest 5, Vite 8, React 19, Zod 4, Hono 4.

**Zu TypeScript 7:** Seit Juli 2026 gibt es TypeScript 7 (der neue, in Go geschriebene, rund 10× schnellere Compiler). Die Sprache ist identisch. Wir verwenden TypeScript 6, weil die IntelliJ-Unterstützung für Version 7 noch als «in Entwicklung» gilt und einige Werkzeuge (z. B. ESLint) noch Version 6 brauchen. Ein späterer Wechsel ist eine einzige Zeile in `package.json`.

Viel Spass – und los geht's mit **[Lektion 1](lektionen/l01-erste-schritte/README.md)**! 🚀
