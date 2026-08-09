import { defineConfig } from "tsdown";

export default defineConfig([
  {
    deps: {
      onlyBundle: ["@markdoc/markdoc"],
    },
    entry: ["./src/schema.ts"],
    loader: {
      ".mdoc": "text",
    },
    outDir: "./schema-dist",
  },
  {
    deps: {
      onlyBundle: ["@markdoc/markdoc", "prettier"],
    },
    entry: ["./src/buildGlossary.ts"],
    loader: {
      ".mdoc": "text",
    },
    outDir: "./build-dist",
  },
]);
