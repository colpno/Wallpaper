import type { z } from "@/lib/zod.js";
import type { RouteConfig } from "@/types/route-handler.js";
import type { Types } from "mongoose";

import type { FilterOperators } from "@repo/types";
import express from "express";
import request from "supertest";

import { configureApp } from "@/utils/configure-app.js";

import { openApiToExpressPath } from "./converters.js";
import { Error500 } from "./HttpError.js";

type ObjectIdReplacer<T> = T extends Types.ObjectId
  ? string
  : T extends Record<string, unknown>
    ? { [K in keyof T]: ObjectIdReplacer<T[K]> }
    : T extends Array<infer U>
      ? Array<ObjectIdReplacer<U>>
      : T;

type FilterOperatorReplacer<T> = T extends `$${infer U}`
  ? U extends keyof FilterOperators<unknown>
    ? U
    : T
  : T;

type NormalizeFilterOperators<T> =
  T extends Array<infer U>
    ? Array<NormalizeFilterOperators<U>>
    : T extends Record<string, unknown>
      ? {
          [K in keyof T as FilterOperatorReplacer<K>]: NormalizeFilterOperators<T[K]>;
        }
      : T;

type ExtractRequestInputFromRouteConfig<
  TConfig extends RouteConfig,
  TInputType extends "query" | "params" | "body",
> = TConfig extends { request: infer TRequest }
  ? // Query
    TInputType extends "query"
    ? TRequest extends { query: infer TQuerySchema }
      ? z.infer<TQuerySchema>
      : never
    : // Params
      TInputType extends "params"
      ? TRequest extends { params: infer TParamsSchema }
        ? z.infer<TParamsSchema>
        : never
      : // Body
        TInputType extends "body"
        ? TRequest extends {
            body: { content: Record<string, { schema: infer TBodySchema }> };
          }
          ? z.infer<TBodySchema>
          : never
        : never
  : never;

const createApp = () => {
  const app = express();
  configureApp(app);
  return app;
};

const resolvePath = (path: string, params?: Record<string, string>): string => {
  if (!params) return path;

  return openApiToExpressPath(path, (_, routeParamName) => {
    if (!(routeParamName in params)) {
      throw new Error500(
        `Error occurs while converting path from openapi definition to express path: ${routeParamName} does not exist in ${JSON.stringify(params)}`
      );
    }

    return params[routeParamName]!;
  });
};

const agent = request(createApp());

/**
 * Creates a test client for the provided Express router.
 * @returns A test client for making requests to the API.
 */
export const createTestClient = <
  TConfig extends RouteConfig,
  TParams extends Record<string, string> | never = ExtractRequestInputFromRouteConfig<
    TConfig,
    "params"
  >,
  TQuery extends Record<string, unknown> = ExtractRequestInputFromRouteConfig<TConfig, "query">,
  TBody = ExtractRequestInputFromRouteConfig<TConfig, "body">,
>(
  config: TConfig
) => {
  return (params?: TParams extends never ? never : Record<keyof TParams, string>) => {
    const resolvedPath = resolvePath(config.path, params);
    const client = agent[config.method](resolvedPath);

    type Query = NormalizeFilterOperators<TQuery>;
    type Body = ObjectIdReplacer<TBody>;

    type TestClient = Omit<typeof client, "query" | "send" | "field"> & {
      query: (query?: Query) => TestClient;
      send: (body?: Body) => TestClient;
      field: (body?: Body) => TestClient;
    };

    return client as TestClient;
  };
};
