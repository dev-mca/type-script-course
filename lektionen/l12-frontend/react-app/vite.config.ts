import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite-Konfiguration für die React-Version.
// Starten mit: npm run web:react   (und in einem zweiten Terminal: npm run api)
export default defineConfig({
  plugins: [react()], // JSX + Fast Refresh (Komponenten aktualisieren sich ohne Neuladen)
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
