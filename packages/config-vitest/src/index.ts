import type { ViteUserConfig } from "vitest/config";

export const sharedConfig: ViteUserConfig = {
  test: {
    globals: true,
    coverage: {
      provider: "istanbul",
      reporter: [
        [
          "json",
          {
            file: `../coverage.json`,
          },
        ],
      ],
    },
  },
};

// Re-export specific configs for backwards compatibility
export { baseConfig } from "./configs/base.js";
export { uiConfig } from "./configs/ui.js";
