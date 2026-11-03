// Lösung Aufgabe 2 – Strings

export function initials(fullName: string): string {
  let result = "";
  for (const part of fullName.trim().split(" ")) {
    if (part !== "") {
      result += part.charAt(0).toUpperCase();
    }
  }
  return result;
  // Kürzere Variante (kommt in Lektion 6):
  // return fullName.split(" ").filter((p) => p !== "").map((p) => p[0]!.toUpperCase()).join("");
}

export function formatInvoiceNumber(year: number, sequence: number): string {
  // padStart füllt nur auf, schneidet aber nie ab
  return `RE-${year}-${String(sequence).padStart(4, "0")}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 1) + "…";
}

export function countOccurrences(text: string, word: string): number {
  // "a-das-b-das".split("das") → ["a-", "-b-", ""] → 3 Teile → 2 Vorkommen
  return text.toLowerCase().split(word.toLowerCase()).length - 1;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replace(/[^a-z0-9]+/g, "-") // alles andere → "-"
    .replace(/^-+|-+$/g, ""); // "-" am Anfang (^) oder Ende ($) entfernen
}
