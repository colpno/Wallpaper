import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/lib/test/setup.ts"],
    maxWorkers: process.env.CI ? 1 : undefined,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
