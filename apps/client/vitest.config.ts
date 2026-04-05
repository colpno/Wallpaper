import { uiConfig } from "@repo/vitest-config";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  ...uiConfig,
  test: {
    ...uiConfig.test,
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: "./src/test/setup.ts",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
