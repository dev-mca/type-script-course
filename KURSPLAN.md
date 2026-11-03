# Kursplan

## Übersicht

| # | Inhalt | Zeit | Schwerpunkt | Danach kannst du … |
|---|--------|------|-------------|--------------------|
| [L1](lektionen/l01-erste-schritte/README.md) | Erste Schritte | 2–3 h | Werkzeuge, Zahlen, Gleichheit, truthy/falsy | TS-Programme ausführen und testen |
| [L2](lektionen/l02-typsystem/README.md) | Das Typsystem | 3–4 h | strukturelle Typisierung, `unknown`, Literal-Typen | Daten typsicher modellieren |
| [L3](lektionen/l03-funktionen/README.md) | Funktionen | 3–4 h | Funktionen als Werte, Callbacks, Closures | «funktional» denken |
| [L4](lektionen/l04-objekte-klassen/README.md) | Objekte und Klassen | 4 h | Destructuring, Spread, Klassen, `#privat` | unveränderlich aktualisieren, OOP in TS |
| [L5](lektionen/l05-unions-narrowing/README.md) | Unions und Narrowing | 3–4 h | Discriminated Unions, `never`, `Result` | Zustände präzise modellieren |
| [L6](lektionen/l06-arrays-collections/README.md) | Arrays und Collections | 4 h | `map`/`filter`/`reduce`, Sortieren, `Map`/`Set` | Daten auswerten |
| 🎯 [Projekt A](projekte/projekt-a-terminplaner/README.md) | Terminplaner | 6–8 h | alles bis L6 | eine Fachlogik mit Tests bauen |
| [L7](lektionen/l07-generics/README.md) | Generics | 4 h | `keyof`, Constraints, Iterables | wiederverwendbare Bausteine schreiben |
| [L8](lektionen/l08-async/README.md) | Asynchron | 5 h | Event Loop, Promises, `async`/`await`, `fetch` | mit Netzwerk und Zeit umgehen |
| [L9](lektionen/l09-module-tooling/README.md) | Module, npm, Tooling | 3–4 h | ES-Module, `package.json`, `tsconfig`, Node-APIs | echte Projekte strukturieren |
| 🎯 [Projekt B](projekte/projekt-b-auswertung/README.md) | Buchungsauswertung | 8–10 h | Validierung, Dateien, CLI | ein Kommandozeilen-Tool bauen |
| [L10](lektionen/l10-fortgeschrittene-typen/README.md) | Fortgeschrittene Typen | 4 h | Utility/Mapped/Conditional Types, `satisfies` | Bibliothekstypen lesen |
| [L11](lektionen/l11-backend/README.md) | Backend-API | 6–8 h | Router, Zod, Hono, Dependency Injection | eine REST-API bauen |
| [L12](lektionen/l12-frontend/README.md) | Frontend | 7–9 h | DOM, Vite, React | eine Web-Oberfläche bauen |
| 🎓 [Abschluss](projekte/abschlussprojekt/README.md) | «Salon»-App | 20–30 h | alles | eine Full-Stack-App bauen |
| | **Total** | **≈ 95 h** | | |

---

## Zeitplan-Vorschlag

Bei **etwa 4 Stunden pro Woche** (z. B. zwei Abende à 2 Stunden):

| Woche | Inhalt | Woche | Inhalt |
|-------|--------|-------|--------|
| 1 | Setup + L1 | 13–14 | Projekt B |
| 2 | L2 | 15 | L10 |
| 3 | L3 | 16–17 | L11 |
| 4 | L4 | 18–19 | L12 |
| 5 | L5 | 20–25 | Abschlussprojekt |
| 6 | L6 | | |
| 7–8 | Projekt A | | |
| 9 | L7 | | |
| 10–11 | L8 | | |
| 12 | L9 | | |

Bei 6–8 Stunden pro Woche halbiert sich das ungefähr.

**Lieber regelmässig als viel auf einmal.** Zwei Abende pro Woche bringen mehr als ein ganzer Samstag alle drei Wochen – dein Gehirn braucht die Pausen, um Gelerntes zu festigen.

### Prüfungsphasen

Dein Studium geht vor. Wenn eine Prüfungsphase kommt:

- **Pausiere bewusst** und trag das Datum in `FORTSCHRITT.md` ein. Ein unterbrochener Kurs ist kein gescheiterter Kurs.
- **Steig mit einer Wiederholung wieder ein:** Beantworte die Selbstcheck-Fragen der letzten zwei Lektionen und löse eine alte Übung nochmals von Grund auf (Datei leeren, Tests laufen lassen). Das dauert 30–45 Minuten und bringt dich schneller zurück als einfach weiterzumachen.
- Wenn du in einem Java-Modul Generics, Streams oder Lambdas übst: Die Lektionen 3, 6 und 7 vergleichen genau diese Konzepte mit Java. Beides stärkt sich gegenseitig.

---

## Wie dieser Kurs dir beim Lernen hilft

Der Aufbau folgt ein paar Prinzipien, die in der Lernforschung gut belegt sind:

**1. Erst raten, dann lernen.** Viele Lektionen beginnen mit einem 🧠-Quiz. Eine falsche Vorhersage, die dann korrigiert wird, bleibt besser hängen als eine Erklärung, die du nur liest. Rate also wirklich, bevor du aufklappst.

**2. Abwechslung statt Textwüste.** Lesen → Doku → Ausprobieren → Üben im Wechsel. Jeder Modus aktiviert dein Gehirn anders, und du merkst schneller, wo du etwas noch nicht verstanden hast.

**3. Lernen mit Tests.** Die Tests geben dir sofortiges Feedback – grün oder rot, ohne auf jemanden warten zu müssen. Und du lernst nebenbei, Tests zu lesen und zu schreiben (in TypeScript-Projekten mindestens so wichtig wie in Java).

**4. In der offiziellen Doku lesen lernen.** Jede Lektion schickt dich gezielt in das TypeScript-Handbook, MDN oder die Doku einer Bibliothek. Die 🔍-Aufträge lassen dich selbst etwas herausfinden. Ziel: Am Ende des Kurses brauchst du den Kurs nicht mehr – du weisst, wo du nachschlagen musst.

**5. Vergleiche mit Java.** Du lernst schneller, wenn Neues an Bekanntes anknüpft. Darum gibt es überall «So in Java – so in TypeScript». Den [Spickzettel](SPICKZETTEL-JAVA-TS.md) kannst du dir neben die IDE legen.

**6. Projekte zum Anwenden.** Wissen wird erst durch Anwenden zu Können. Die Projekte haben bewusst weniger Anleitung als die Übungen – dort merkst du, was wirklich sitzt.

**7. Wiederholen mit Abstand.** Nach jeder vierten Lektion lohnt sich ein kurzes **Wiederholungs-Ritual** (20 Minuten):

| Nach … | wiederhole … |
|--------|--------------|
| L4 | Selbstchecks von L1–L3 |
| Projekt A | Selbstchecks von L4–L6 |
| L9 | Selbstchecks von L7–L8 |
| L12 | Selbstchecks von L9–L11 |

Was du nicht mehr weisst: Abschnitt im README nochmals lesen und in `FORTSCHRITT.md` notieren.
