import { config } from "@repo/prettier-config";

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  ...config,
  tailwindStylesheet: "./src/index.css",
  tailwindFunctions: ["cva"],
};
