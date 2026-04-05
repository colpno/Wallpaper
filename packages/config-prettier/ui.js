import { config as baseConfig } from "./base.js";

/**
 * A shared Prettier configuration for the repository.
 *
 * @requires `tailwindStylesheet` to be defined in the consuming project's setup.
 *
 * @type {import("prettier").Config}
 */
export const config = {
  ...baseConfig,
  plugins: ["prettier-plugin-tailwindcss"],
  jsxSingleQuote: false,
  htmlWhitespaceSensitivity: "css",
  singleAttributePerLine: false,
  bracketSameLine: false,
};
