// Teil D: Die gemeinsamen API-Tests gegen die Hono-Version
import { describe, it } from "vitest";
import { runApiSuite } from "./api-suite";
import { createHonoApp } from "./hono-app";

// Teil D ist optional. Setze TEIL_D auf true, sobald du damit anfängst.
const TEIL_D = false;

if (TEIL_D) {
  runApiSuite("Hono", (deps) => {
    const app = createHonoApp(deps);
    return async (request) => app.fetch(request);
  });
} else {
  describe("Teil D (Hono)", () => {
    it.skip("ist noch nicht aktiviert – setze TEIL_D = true in hono-app.test.ts", () => {});
  });
}
