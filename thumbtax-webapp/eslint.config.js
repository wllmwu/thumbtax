import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "no-relative-import-paths": noRelativeImportPaths,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-relative-import-paths/no-relative-import-paths": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react"],
            ["^@?\\w"],
            ["^#src", "^.+\\.css"],
            ["^.*\\u0000$"],
          ],
        },
      ],
    },
  },
]);
