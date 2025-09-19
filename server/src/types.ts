import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { RequestHandler, Response } from "express";

import z from "./configs/zod.config";

/**
 * Infers the TypeScript type from a Zod schema.
 */
type ZodInfer<T> = T extends z.ZodType ? z.infer<T> : never;
/**
 * Retrieves the value of the given key from the object type T,
 * or returns an empty object if the key does not exist.
 */
type ValueOrEmpty<T, K extends string> = K extends keyof T ? T[K] : {};
export type RequestKeys = keyof NonNullable<RouteConfig["request"]>;

/**
 * Extracts response types from the given route config.
 */
export type ExtractResponse<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"],
> = TConfig["responses"][Code] extends { content: { "application/json": { schema: infer S } } }
  ? ZodInfer<S>
  : never;

/**
 * Extracts request inputs (from `RouteConfig["request"]`) type from the given route config.
 */
export type ExtractRequest<TConfig extends RouteConfig> = {
  [K in RequestKeys as K extends keyof NonNullable<TConfig["request"]>
    ? K
    : never]: K extends "body"
    ? ZodInfer<
        NonNullable<
          NonNullable<NonNullable<TConfig["request"]>[K]>["content"]["application/json"]
        >["schema"]
      >
    : ZodInfer<NonNullable<TConfig["request"]>[K]>;
};

type TypedResponse<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"] = keyof TConfig["responses"],
> = Omit<Response, "json" | "status"> & {
  status: <C extends Code>(code: C) => TypedResponse<TConfig, C>;
  json: (body: ExtractResponse<TConfig, Code>) => void;
};

type TypedRequestHandler<
  TConfig extends RouteConfig,
  Code extends keyof TConfig["responses"] = keyof TConfig["responses"],
> = RequestHandler<
  ValueOrEmpty<ExtractRequest<TConfig>, "params">,
  ExtractResponse<TConfig, Code>,
  ValueOrEmpty<ExtractRequest<TConfig>, "body">,
  ValueOrEmpty<ExtractRequest<TConfig>, "query">
>;

/**
 * A typed Express request handler based on the given route config.
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

export type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
