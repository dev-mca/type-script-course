// Einstiegspunkt der React-App (vorgegeben)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../dom-app/style.css"; // dieselben Styles wie die DOM-Version
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("#root fehlt in index.html");

createRoot(root).render(
  // StrictMode führt in der Entwicklung manche Dinge absichtlich doppelt aus
  // (z. B. Effekte), um Fehler früh sichtbar zu machen.
  <StrictMode>
    <App />
  </StrictMode>,
);
