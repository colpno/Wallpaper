import type { File } from "@/constants/schemas.js";
import type z from "@/lib/zod.js";
import type { Types } from "mongoose";

import type { RouteConfig } from "@asteasolutions/zod-to-openapi";
import express from "express";
import request from "supertest";

import configureApp from "@/helpers/configure-app.js";

import { Error500 } from "./HttpError.js";
import openApiToExpressRoute from "./open-api-to-express-route.js";

type ObjectIdReplacer<Type> = Type extends Types.ObjectId
  ? string
  : Type extends Record<string, unknown>
    ? { [K in keyof Type]: ObjectIdReplacer<Type[K]> }
    : Type extends Array<infer U>
      ? Array<ObjectIdReplacer<U>>
      : Type;

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

  return openApiToExpressRoute(path, (_, routeParamName) => {
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
export default function createTestClient<
  TConfig extends RouteConfig,
  TParams = ExtractRequestInputFromRouteConfig<TConfig, "params">,
  TQuery = ExtractRequestInputFromRouteConfig<TConfig, "query">,
  TBody = ExtractRequestInputFromRouteConfig<TConfig, "body">,
>(config: TConfig) {
  return (params?: TParams extends never ? never : Record<keyof TParams, string>) => {
    const resolvedPath = resolvePath(config.path, params);
    const client = agent[config.method](resolvedPath);

    type SendBody = ObjectIdReplacer<
      TBody extends Record<string, unknown>
        ? {
            [K in keyof TBody as Extract<TBody[K], File> extends never ? K : never]: TBody[K];
          }
        : TBody
    >;

    type AttachField =
      TBody extends Record<string, unknown>
        ? {
            [K in keyof TBody]: Extract<TBody[K], File> extends never ? never : K;
          }[keyof TBody]
        : never;

    type AttachRest = Parameters<typeof client.attach> extends [unknown, ...infer Rest] ? Rest : [];

    type TestClient = Omit<typeof client, "send" | "query" | "attach" | "field"> & {
      query: (query?: TQuery) => TestClient;
      send: (body?: SendBody) => TestClient;
      attach: (
        field: AttachField extends undefined ? string : AttachField,
        ...rest: AttachRest
      ) => TestClient;
      field: (body?: SendBody) => TestClient;
    };

    return client as TestClient;
  };
}
