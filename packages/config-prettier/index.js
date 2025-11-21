/**
 * A shared Prettier configuration for the repository.
 *
 * @requires `tailwindStylesheet` to be defined in the consuming project's setup.
 *
 * @type {import("prettier").Config}
 */
export const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 100,
  trailingComma: "es5",
};
