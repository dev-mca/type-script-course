// Teil C: Die gemeinsamen API-Tests gegen deinen eigenen Router
import { runApiSuite } from "./api-suite";
import { createApp } from "./app";

runApiSuite("Eigener Router", (deps) => {
  const app = createApp(deps);
  return (request) => app.handle(request);
});
