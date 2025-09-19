import { RouteConfig } from "@asteasolutions/zod-to-openapi";

import { registry } from "~/lib/api-document";

export default function registerRoute<TConfig extends RouteConfig>(config: TConfig): TConfig {
  registry.registerPath(config);

  return config;
}
