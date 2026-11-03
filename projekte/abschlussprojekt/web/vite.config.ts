import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Abschlussprojekt – Web starten:  npm run final:web   (API: npm run final:api)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
