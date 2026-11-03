// Ausführen: npx tsx lektionen/l06-arrays-collections/beispiele/01-streams-vergleich.ts
//
// Jedes Beispiel zeigt oben (als Kommentar) die Java-Stream-Version
// und darunter die TypeScript-Version.

type Appointment = { customer: string; service: string; priceInRappen: number; day: string };

const appointments: Appointment[] = [
  { customer: "Melih", service: "Haarschnitt", priceInRappen: 4500, day: "Mo" },
  { customer: "Anna", service: "Färben", priceInRappen: 9000, day: "Mo" },
  { customer: "Bob", service: "Bart", priceInRappen: 2500, day: "Di" },
  { customer: "Melih", service: "Bart", priceInRappen: 2500, day: "Mi" },
  { customer: "Chiara", service: "Haarschnitt", priceInRappen: 4500, day: "Mi" },
];

// Java: appointments.stream().map(Appointment::customer).distinct().toList()
const customers = [...new Set(appointments.map((a) => a.customer))];
console.log("Kunden:", customers);

// Java: appointments.stream().filter(a -> a.price() > 3000).count()
const expensive = appointments.filter((a) => a.priceInRappen > 3000).length;
console.log("Teure Termine:", expensive);

// Java: appointments.stream().mapToInt(Appointment::price).sum()
const revenue = appointments.reduce((sum, a) => sum + a.priceInRappen, 0);
console.log("Umsatz:", revenue / 100, "CHF");

// Java: appointments.stream().collect(groupingBy(Appointment::day, counting()))
const perDay = Object.groupBy(appointments, (a) => a.day);
for (const [day, list] of Object.entries(perDay)) {
  console.log(`${day}: ${list?.length ?? 0} Termine`);
}

// Java: appointments.stream().sorted(comparing(Appointment::price).reversed()).limit(2).toList()
const topTwo = appointments.toSorted((a, b) => b.priceInRappen - a.priceInRappen).slice(0, 2);
console.log(
  "Top 2:",
  topTwo.map((a) => `${a.customer} (${a.service})`),
);

// Java: appointments.stream().filter(a -> a.customer().equals("Melih")).findFirst()
const firstOfMelih = appointments.find((a) => a.customer === "Melih");
console.log("Erster Termin von Melih:", firstOfMelih?.service ?? "keiner");

// Java: appointments.stream().anyMatch(a -> a.day().equals("So"))
console.log(
  "Termin am Sonntag?",
  appointments.some((a) => a.day === "So"),
);

// Java: Collectors.joining(", ", "[", "]")
console.log("[" + appointments.map((a) => a.service).join(", ") + "]");

// Eine Pipeline – lies sie von oben nach unten wie einen Satz:
// «Nimm die Termine, behalte die Bart-Termine, nimm die Kundennamen, sortiere sie.»
const beardCustomers = appointments
  .filter((a) => a.service === "Bart")
  .map((a) => a.customer)
  .toSorted((a, b) => a.localeCompare(b, "de"));
console.log("Bart-Kunden:", beardCustomers);

// 🔧 Experiment: Berechne den durchschnittlichen Preis pro Service.
// Erwartet: { Haarschnitt: 4500, Färben: 9000, Bart: 2500 }
// Tipp: Object.groupBy + Object.entries + map + Object.fromEntries
