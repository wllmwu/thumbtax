import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import jestDom from "eslint-plugin-jest-dom";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jestDom.configs["flat/recommended"],
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
            ["^react$"],
            ["^@?\\w"],
            ["^#src", "^.+\\.css"],
            ["^.*\\u0000$"],
          ],
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      "prettier/prettier": "warn",
    },
  },
]);
