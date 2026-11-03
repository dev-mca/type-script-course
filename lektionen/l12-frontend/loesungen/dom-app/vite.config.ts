import { defineConfig } from "vite";

// Vite-Konfiguration für die DOM-Version.
// Starten mit: npm run web:dom   (und in einem zweiten Terminal: npm run api)
export default defineConfig({
  server: {
    port: 5173,
    // Alle Anfragen an /api/… leitet der Vite-Server an unsere API aus Lektion 11 weiter.
    // So spricht der Browser nur mit EINEM Server – und CORS ist kein Thema.
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
