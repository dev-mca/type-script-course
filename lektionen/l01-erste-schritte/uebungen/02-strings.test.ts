import { describe, expect, it } from "vitest";
import { countOccurrences, formatInvoiceNumber, initials, slugify, truncate } from "./02-strings";

describe("2.1 initials", () => {
  it("nimmt die ersten Buchstaben in Grossbuchstaben", () => {
    expect(initials("Melih Can")).toBe("MC");
    expect(initials("ada lovelace")).toBe("AL");
  });

  it("kommt mit mehreren Leerzeichen klar", () => {
    expect(initials("  anna   maria  meier ")).toBe("AMM");
  });

  it("liefert für einen leeren String einen leeren String", () => {
    expect(initials("")).toBe("");
    expect(initials("   ")).toBe("");
  });
});

describe("2.2 formatInvoiceNumber", () => {
  it("füllt mit Nullen auf", () => {
    expect(formatInvoiceNumber(2026, 7)).toBe("RE-2026-0007");
    expect(formatInvoiceNumber(2027, 42)).toBe("RE-2027-0042");
  });

  it("schneidet längere Nummern nicht ab", () => {
    expect(formatInvoiceNumber(2026, 12345)).toBe("RE-2026-12345");
  });
});

describe("2.3 truncate", () => {
  it("kürzt und hängt … an", () => {
    expect(truncate("Hallo Welt", 8)).toBe("Hallo W…");
    expect(truncate("Hallo Welt", 8)).toHaveLength(8);
  });

  it("lässt kurze Texte unverändert", () => {
    expect(truncate("Hallo", 10)).toBe("Hallo");
    expect(truncate("Hallo", 5)).toBe("Hallo");
  });
});

describe("2.4 countOccurrences", () => {
  it("zählt unabhängig von Gross-/Kleinschreibung", () => {
    expect(countOccurrences("Das ist das Haus, das ich meine.", "das")).toBe(3);
    expect(countOccurrences("TypeScript, typescript, TYPESCRIPT", "TypeScript")).toBe(3);
  });

  it("liefert 0, wenn das Wort nicht vorkommt", () => {
    expect(countOccurrences("Java", "Kotlin")).toBe(0);
  });
});

describe("2.5 slugify", () => {
  it("macht einfache Titel URL-tauglich", () => {
    expect(slugify("Hallo Welt!")).toBe("hallo-welt");
  });

  it("ersetzt Umlaute", () => {
    expect(slugify("Über 100 Tipps & Tricks")).toBe("ueber-100-tipps-tricks");
    expect(slugify("Grüezi Zürich, schöner Tag")).toBe("grueezi-zuerich-schoener-tag");
  });

  it("entfernt Bindestriche am Rand und doppelte Trenner", () => {
    expect(slugify("  --TypeScript  ist toll--  ")).toBe("typescript-ist-toll");
  });
});
