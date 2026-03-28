import { config } from "@repo/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...config,
  {
    rules: {
      "react-refresh/only-export-components": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
]);
