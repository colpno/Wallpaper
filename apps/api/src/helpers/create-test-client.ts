import type z from "@/lib/zod";
import type { TypedRouteConfig } from "@/types/route-handler.types";

import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import request, { Test } from "supertest";

import createApp from "@/app";
import env from "@/env";

import openApiToExpressRoute from "./open-api-to-express-route";

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

type TestClient<C extends RouteConfig> = (reqArgs?: ExtractRouteRequest<C>) => Test;

const agent = request(createApp());

/**
 * Creates a test client for the provided Express router.
 * @returns A test client for making requests to the API.
 */
export default function createTestClient<C extends RouteConfig>(routeConfig: C): TestClient<C> {
  /** Helper to convert path from openapi definition to express path. */
  const resolvePath = (path: string, params?: Record<string, string>) => {
    if (!params) return path;
    return openApiToExpressRoute(path, (_, routeParamName) => params[routeParamName]);
  };

  const client: TestClient<C> = (reqArgs) => {
    if (!reqArgs) return agent[routeConfig.method](`${env.BASE_ENDPOINT}${routeConfig.path}`);

    const path =
      "params" in reqArgs
        ? resolvePath(routeConfig.path, reqArgs.params as Record<string, string>)
        : routeConfig.path;
    const request = agent[routeConfig.method](`${env.BASE_ENDPOINT}${path}`);

    if ("query" in reqArgs) {
      request.query(reqArgs.query as Record<string, string>);
    }

    if ("body" in reqArgs) {
      request.send(reqArgs.body as Record<string, unknown>);
    }

    if ("headers" in reqArgs) {
      for (const [key, value] of Object.entries(reqArgs.headers as Record<string, string>)) {
        request.set(key, value);
      }
    }

    if ("cookies" in reqArgs) {
      for (const [key, value] of Object.entries(reqArgs.cookies as Record<string, string>)) {
        request.set("Cookie", `${key}=${value}`);
      }
    }

    return request;
  };

  return client;
}
