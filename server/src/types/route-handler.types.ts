import type { RouteConfig, ZodContentObject } from "@asteasolutions/zod-to-openapi";
import type { RequestHandler, Response } from "express";

import type z from "@/lib/zod";

import type { RequestMediaType } from "./query.types";

type ZodInfer<T> = T extends z.ZodType ? z.infer<T> : never;
export type RouteRequestKeys = keyof NonNullable<RouteConfig["request"]>;
/**
 * Retrieves the value of the given key from the object type T,
 * or returns an empty object if the key does not exist.
 */
type ValueOrEmpty<T, K extends string> = K extends keyof T ? T[K] : {};

/**
 * Extracts response types from the given route config.
 */
export type ExtractRouteResponse<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"],
> = TConfig["responses"][Code] extends { content: { "application/json": { schema: infer S } } }
  ? ZodInfer<S>
  : never;

/**
 * Extracts request inputs type from the given route config.
 */
export type ExtractRouteRequest<TConfig extends RouteConfig> = {
  [K in RouteRequestKeys as K extends keyof NonNullable<TConfig["request"]>
    ? K
    : never]: K extends "body"
    ? // Create U for avoiding long duplication type
      NonNullable<NonNullable<TConfig["request"]>[K]>["content"] extends infer U
      ? U extends ZodContentObject
        ? ZodInfer<NonNullable<U[keyof U & RequestMediaType]>["schema"]>
        : never
      : never
    : ZodInfer<NonNullable<TConfig["request"]>[K]>;
};

// Override Express Response to have response type based on status code
type TypedResponse<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"] = keyof TConfig["responses"],
> = Omit<Response, "json" | "status"> & {
  status: <C extends Code>(code: C) => TypedResponse<TConfig, C>;
  json: (body: ExtractRouteResponse<TConfig, Code>) => void;
};

type TypedRequestHandler<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"] = keyof TConfig["responses"],
> = RequestHandler<
  ValueOrEmpty<ExtractRouteRequest<TConfig>, "params">,
  ExtractRouteResponse<TConfig, Code>,
  ValueOrEmpty<ExtractRouteRequest<TConfig>, "body">,
  ValueOrEmpty<ExtractRouteRequest<TConfig>, "query">
>;

/**
 * A typed Express request handler based on the given route config.
 * Response type is decided based on the provided status code.
 */
export type RouteHandler<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"] = keyof TConfig["responses"],
> = TypedRequestHandler<TConfig, Code> & {
  (
    req: Parameters<TypedRequestHandler<TConfig, Code>>[0],
    res: TypedResponse<TConfig>,
    next: Parameters<TypedRequestHandler<TConfig, Code>>[2]
  ): ReturnType<TypedRequestHandler<TConfig, Code>>;
};
