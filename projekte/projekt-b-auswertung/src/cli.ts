// Projekt B – Meilenstein 6: Das Kommandozeilen-Programm
//
// Ausführen (aus dem Hauptordner):
//   npm run projekt-b -- --input projekte/projekt-b-auswertung/daten
//   npm run projekt-b -- -i projekte/projekt-b-auswertung/daten --format json --out projekte/projekt-b-auswertung/ausgabe/report.json
//
// (Das "--" nach "npm run projekt-b" sorgt dafür, dass npm die Optionen an das
// Programm weitergibt, statt sie selbst zu interpretieren.)
//
// Anforderungen:
//   --input / -i <ordner>     Pflicht: Ordner mit services.json und den Buchungsdateien
//   --format / -f text|json   Standard: text
//   --out / -o <datei>        optional: Report in diese Datei schreiben (Ordner anlegen!)
//                             statt auf die Konsole
//   --help / -h               kurze Hilfe ausgeben
//
// Verhalten:
//   - Report (Text oder JSON) auf stdout bzw. in die Datei
//   - Gefundene Datenfehler auf stderr (console.error), mit einer Überschrift
//     wie "⚠️ 6 fehlerhafte Einträge übersprungen:"
//   - Bei einem schweren Fehler (Ordner fehlt, services.json ungültig, falsche Option):
//     verständliche Meldung auf stderr und process.exitCode = 1
//
// Tipp: Schau dir lektionen/l09-module-tooling/uebungen/03-cli-main.ts an.
// Gute Struktur: eine Funktion parseOptions(args) und eine async main().

// TODO: Projekt B – CLI
console.log("TODO: Projekt B – CLI noch nicht umgesetzt");
