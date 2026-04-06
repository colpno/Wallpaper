import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { apiReference } from "@scalar/express-api-reference";
import { type Express, Router } from "express";

import packageJson from "@/../package.json" with { type: "json" };
import { env } from "@/configs/env.js";

export const registry = new OpenAPIRegistry();

export function serveAPIDocument(app: Express, path: string): void;
export function serveAPIDocument(router: Router, path: string): void;
export function serveAPIDocument(router: Router, path: string) {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  const document = generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Wallpaper API",
      version: packageJson.version,
      description: "API documentation for the Wallpaper application",
    },
    servers: [{ url: env.BASE_ENDPOINT }],
  });

  router.get(`${path}.json`, (_, res) => res.send(document));

  router.get(
    path,
    apiReference({
      url: `${path}.json`,
      theme: "kepler",
      layout: "modern",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "axios",
      },
    })
  );
}
