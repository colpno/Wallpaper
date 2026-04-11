import type { KnownKeys } from "./common.js";
import type { z } from "@/lib/zod.js";
import type { RequestHandler, Response } from "express";

import type {
  RouteConfig as BaseRouteConfig,
  ZodMediaTypeObject,
  ZodRequestBody,
} from "@asteasolutions/zod-to-openapi";

type MultipartContentType = "multipart/form-data";
export type RequestContentType =
  | keyof KnownKeys<NonNullable<NonNullable<BaseRouteConfig["request"]>["body"]>["content"]>
  | MultipartContentType;

export type RouteConfig = Omit<BaseRouteConfig, "request"> & {
  request?: Omit<NonNullable<BaseRouteConfig["request"]>, "body"> & {
    body?: Omit<ZodRequestBody, "content"> & {
      content: Partial<
        Record<
          Exclude<RequestContentType, MultipartContentType>,
          Omit<ZodMediaTypeObject, "schema"> & {
            schema: z.ZodType;
          }
        > &
          Record<
            MultipartContentType,
            Omit<ZodMediaTypeObject, "schema"> & {
              schema: z.ZodType;
            }
          >
      >;
    };
  };
};

type TypedResponseMethod<T> = T extends z.ZodType
  ? {
      json: (body: z.infer<T>) => void;
      send: (body: z.infer<T>) => void;
    }
  : never;

/**
 * A typed version of the Express Response object that
 * infers the response types based on the content type of the route configuration.
 */
type TypedResponse<TConfig extends RouteConfig> = {
  status: <TCode extends Extract<keyof TConfig["responses"], number>>(
    code: TCode
  ) => TConfig["responses"] extends { [K in TCode]: { content: infer TContent } }
    ? TContent["application/json" & keyof TContent] extends { schema: infer TSchema }
      ? TypedResponseMethod<TSchema> & Omit<Response, keyof TypedResponseMethod<TSchema>>
      : Omit<Response, "status" | keyof TypedResponseMethod<unknown>>
    : Omit<Response, "status">;
} & Omit<Response, "status">;

/**
 * Maps a `RouteConfig` to an Express `RequestHandler` with inferred
 * types for `req.params`, `req.query`, and `req.body`.
 */
type TypedRequestHandler<TConfig extends RouteConfig> = RequestHandler<
  TConfig["request"] extends { params: infer S } ? z.infer<S> : object,
  TConfig["responses"][keyof TConfig["responses"]] extends { content: infer MediaObject }
    ? MediaObject[keyof MediaObject] extends { schema: infer S }
      ? z.infer<S>
      : object
    : object,
  TConfig["request"] extends { body: { content: infer MediaObject } }
    ? MediaObject[keyof MediaObject] extends { schema: infer S }
      ? z.infer<S>
      : object
    : object,
  TConfig["request"] extends { query: infer S } ? z.infer<S> : object
>;

/**
 * Typed route handler based on `RouteConfig`.
 *
 * Same as `TypedRequestHandler`, but replaces `res` with a strongly-typed
 * `TypedResponse` for safe `res.status(...).json(...)`.
 */
export type RouteHandler<TConfig extends RouteConfig> = {
  (
    req: Parameters<TypedRequestHandler<TConfig>>[0],
    res: TypedResponse<TConfig>,
    next: Parameters<TypedRequestHandler<TConfig>>[2]
  ): ReturnType<TypedRequestHandler<TConfig>>;
};
