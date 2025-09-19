import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import request, { Test } from "supertest";

import { ExtractRequest, RequestKeys } from "~/types";
import createApp from "./create-app";
import openAPIToRoutePath from "./open-api-to-route-path";

type Method = "get" | "post" | "put" | "delete" | "patch";

type TestClient = {
  [M in Method]: <TConfig extends RouteConfig>(
    route: TConfig,
    request?: TConfig extends { request: any } ? ExtractRequest<TConfig> : never
  ) => Test;
};

function createTestApp(router: Router) {
  const app = createApp();

  app.use(router);

  return app;
}

export default function createTestClient(router: Router): TestClient {
  const app = createTestApp(router);
  const agent = request(app);
  const methods: Method[] = ["get", "post", "put", "delete", "patch"];

  // Helper to replace path from openapi definition to actual path
  const resolvePath = (path: string, params?: Record<string, string>) => {
    if (!params) return path;
    return openAPIToRoutePath(path, (_, routeParamName) => params[routeParamName]);
  };

  const client: Partial<TestClient> = {};

  // Dynamically create methods for each HTTP with dynamic request arguments based on `route`
  for (const method of methods) {
    client[method] = (route, req) => {
      const request = req as unknown as Record<RequestKeys, Record<string, string>> | undefined;
      const { params, query, body } = request || {};

      const path = resolvePath(route.path, params);
      const url = query ? `${path}?${new URLSearchParams(query).toString()}` : path;

      return method === "get" || method === "delete"
        ? agent[method](url)
        : agent[method](url).send(body);
    };
  }

  return client as TestClient;
}
