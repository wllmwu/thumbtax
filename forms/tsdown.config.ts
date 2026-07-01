import { defineConfig } from "tsdown";

export default defineConfig([
  {
    deps: {
      onlyBundle: ["@markdoc/markdoc"],
    },
    entry: ["./src/schema.ts"],
    outDir: "./schema-dist",
  },
  {
    deps: {
      onlyBundle: ["@markdoc/markdoc", "prettier"],
    },
    entry: ["./src/buildForms.ts"],
    outDir: "./build-dist",
  },
]);
