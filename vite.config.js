import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const rendererRoot = path.resolve(__dirname, "src/renderer/react");

export default defineConfig({
  root: rendererRoot,
  base: "./",
  plugins: [
    react({
      fastRefresh: {
        overlay: false
      }
    })
  ],
  resolve: {
    alias: {
      "@renderer": rendererRoot
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: false
    }
  },
  esbuild: {
    sourcemap: false
  },
  build: {
    outDir: path.resolve(rendererRoot, "dist"),
    emptyOutDir: true
  }
});
