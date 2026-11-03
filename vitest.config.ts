import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Alle Testdateien des Kurses. Mit `npm test -- l03` testest du nur Lektion 3.
    include: ["lektionen/**/*.test.ts", "projekte/**/*.test.ts"],
    // Übersichtliche Ausgabe: jeder Test einzeln mit Häkchen oder Kreuz
    reporters: ["verbose"],
  },
});
