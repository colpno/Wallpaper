import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^@?\\w"], // Package imports
            ["^@"], // Absolute imports
            ["^"], // Others
          ],
        },
      ],
    },
  },
  prettier,
]);
