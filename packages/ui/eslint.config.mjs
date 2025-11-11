import { config } from "@repo/eslint-config/react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
