import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Andromeda Logic Corp — Frontend build config
// See Section 11.1 (Frontend Stack) of the technical specification.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward API calls to the FastAPI backend during local dev.
      // Matches backend/app/main.py root_path + /api/v1 prefix.
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
