/// <reference types="vitest/config" />
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      ...optimizeLocales.vite({
        locales: ["en-US"],
      }),
      enforce: "pre",
    },
  ],
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "src"),
    },
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    setupFiles: ["./vitest.setup.ts"],
  },
});
