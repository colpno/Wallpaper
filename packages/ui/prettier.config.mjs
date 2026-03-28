import { config } from "@repo/prettier-config/ui";

/** @type {typeof config} */
export default {
  ...config,
  tailwindStylesheet: "./src/styles.css",
  tailwindFunctions: ["cva", "cn"],
};
