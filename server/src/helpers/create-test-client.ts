import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import request, { Test } from "supertest";

import { openApiToExpressRoute } from "@/helpers";
import type { ExtractRouteRequest, RouteRequestKeys } from "@/types";

import createApp from "./create-app";

type Method = "get" | "post" | "put" | "patch" | "delete";

type TestClient = {
  [M in Method]: <TConfig extends RouteConfig>(
    route: TConfig
  ) => (request?: TConfig extends { request: any } ? ExtractRouteRequest<TConfig> : never) => Test;
};

function createTestApp(router: Router) {
  const app = createApp();

  app.use(router);

  return app;
}

/**
 * Creates a test client for the provided Express router.
 * @param router An Express router instance.
 * @returns A test client for making requests to the API.
 */

export default function createTestClient(router: Router): TestClient {
  const app = createTestApp(router);
  const agent = request(app);
  const methods: Method[] = ["get", "post", "put", "delete", "patch"];

  // Helper to normalize path from openapi definition to actual path
  const resolvePath = (path: string, params?: Record<string, string>) => {
    if (!params) return path;
    return openApiToExpressRoute(path, (_, routeParamName) => params[routeParamName]);
  };

  const client: Partial<TestClient> = {};

  // Create HTTP methods with dynamic argument types based on `route`
  for (const method of methods) {
    client[method] = (route) => (reqArgs) => {
      const typedReqArgs = reqArgs as unknown as
        | Record<RouteRequestKeys, Record<string, string>>
        | undefined;
      const { params, query, body } = typedReqArgs || {};

      const path = resolvePath(route.path, params);
      const url = query ? `${path}?${new URLSearchParams(query).toString()}` : path;

      return method === "get" || method === "delete"
        ? agent[method](url)
        : agent[method](url).send(body);
    };
  }

  return client as TestClient;
}
