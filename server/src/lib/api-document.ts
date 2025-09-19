import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { apiReference } from "@scalar/express-api-reference";
import { Express, Router } from "express";

import packageJson from "~/../package.json";
import env from "~/env";

export const registry = new OpenAPIRegistry();

export default function serveAPIDocument(app: Express, path: string): void;

export default function serveAPIDocument(router: Router, path: string): void;

export default function serveAPIDocument(router: Router, path: string) {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  router.get(`${path}.json`, (_req, res) =>
    res.send(
      generator.generateDocument({
        openapi: "3.1.0",
        info: {
          title: "Wallpaper API",
          version: packageJson.version,
          description: "API documentation for the Wallpaper application",
        },
        servers: [{ url: env.BASE_ENDPOINT }],
      })
    )
  );

  router.get(
    path,
    apiReference({
      url: "/docs.json",
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "axios",
      },
    })
  );
}
