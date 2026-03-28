/**
 * A shared Prettier configuration for the repository.
 *
 * @requires `tailwindStylesheet` to be defined in the consuming project's setup.
 *
 * @type {import("prettier").Config}
 */
export const config = {
  arrowParens: "always",
  bracketSameLine: true,
  bracketSpacing: true,
  endOfLine: "lf",
  objectWrap: "preserve",
  printWidth: 100,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
};
