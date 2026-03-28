import { config } from "@repo/prettier-config/ui";

/** @type {typeof config} */
export default {
  ...config,
  tailwindStylesheet: "./src/assets/styles/index.css",
  tailwindFunctions: ["cn", "cva"],
};
