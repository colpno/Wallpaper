import { baseConfig } from "@repo/vitest-config";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
