// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      include: ["src"],
      pathsToAliases: false,
      compilerOptions: {
        importsNotUsedAsValues: 1,
        verbatimModuleSyntax: true, // Forces type-only imports
        esModuleInterop: true,
      },
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: (format) => `index.${format}.js`, // Output file name
      formats: ["es"], // Supported formats
    },
    rollupOptions: {
      external: ["react", "pixi.js"],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
});
