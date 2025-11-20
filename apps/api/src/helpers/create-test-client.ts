import type z from "@/lib/zod";
import type { TypedRouteConfig } from "@/types/route-handler.types";

import { Router } from "express";
import request, { Test } from "supertest";

import createApp from "@/app";

import openApiToExpressRoute from "./open-api-to-express-route";

type Method = "get" | "post" | "put" | "patch" | "delete";

type ExtractRouteRequest<TConfig extends TypedRouteConfig> = TConfig extends {
  request: infer R;
}
  ? (R extends { params: infer S }
      ? {
          params?: z.infer<S>;
        }
      : object) &
      (R extends { query: infer S }
        ? {
            query?: z.infer<S>;
          }
        : object) &
      (R extends { body: { content: infer MediaObject } }
        ? MediaObject[keyof MediaObject] extends { schema: infer S }
          ? {
              body?: z.infer<S>;
            }
          : object
        : object)
  : never;

type TestClient = {
  [M in Method]: <TConfig extends TypedRouteConfig>(
    routeConfig: TConfig
  ) => (
    request?: TConfig extends { request: unknown } ? ExtractRouteRequest<TConfig> : never
  ) => Test;
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
    client[method] = (routeConfig) => (reqArgs) => {
      const typedReqArgs = reqArgs as unknown as
        | Record<keyof NonNullable<(typeof routeConfig)["request"]>, Record<string, string>>
        | undefined;
      const { params, query, body } = typedReqArgs || {};

      const path = resolvePath(routeConfig.path, params);

      const request = agent[method](path);

      if (query) {
        request.query(query);
      }
      if (body) {
        request.send(body);
      }

      return request;
    };
  }

  return client as TestClient;
}
