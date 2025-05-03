import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: "src/content/content.js",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    target: "es2020",
  },
});
