import { defineProject, mergeConfig, type ViteUserConfig } from "vitest/config";

import { baseConfig } from "./base.js";

export const uiConfig: ViteUserConfig = mergeConfig(
  baseConfig,
  defineProject({
    test: {
      environment: "jsdom",
    },
  })
);
