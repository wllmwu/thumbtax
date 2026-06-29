import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./src/schema.ts"],
    outDir: "./schema-dist",
  },
  {
    entry: ["./src/buildForms.ts"],
    outDir: "./build-dist",
  },
]);
