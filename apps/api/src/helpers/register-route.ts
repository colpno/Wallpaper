import type { TypedRouteConfig } from "@/types/route-handler.types";

import { registry } from "@/lib/openapi";

/**
 * Registers an OpenAPI route configuration to OpenAPI documentation.
 * @param config An OpenAPI route configuration.
 * @returns The same configuration that was passed in.
 */
export default function registerRoute<TConfig extends TypedRouteConfig>(config: TConfig): TConfig {
  registry.registerPath(config);
  return config;
}
