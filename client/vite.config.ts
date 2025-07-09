import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "print-link",
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          setTimeout(() => {
            console.log("\x1b[32m==============================");
            console.log("Frontend is running at: http://localhost:5173");
            console.log("==============================\x1b[0m\n");
          }, 500);
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../public",
    emptyOutDir: true,
  },
}); 