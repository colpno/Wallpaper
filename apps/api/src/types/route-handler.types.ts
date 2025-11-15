import type { KnownKeys } from "./common.types";
import type z from "@/lib/zod";
import type { RequestHandler, Response } from "express";
import type mongoose from "mongoose";

import type {
  RouteConfig,
  ZodMediaTypeObject,
  ZodRequestBody,
} from "@asteasolutions/zod-to-openapi";

export type RequestContentType =
  | keyof KnownKeys<NonNullable<NonNullable<RouteConfig["request"]>["body"]>["content"]>
  | "multipart/form-data";

export type TypedRouteConfig = Omit<RouteConfig, "request"> & {
  request?: Omit<NonNullable<RouteConfig["request"]>, "body"> & {
    body?: Omit<ZodRequestBody, "content"> & {
      content: Partial<Record<RequestContentType, ZodMediaTypeObject>>;
    };
  };
};

type ObjectIdToString<T> = T extends string
  ? string | mongoose.mongo.ObjectId
  : T extends mongoose.Document
    ? T
    : T extends mongoose.TreatAsPrimitives
      ? T
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        T extends Record<string, any>
        ? {
            [K in keyof T]: T[K] extends string
              ? string | mongoose.mongo.ObjectId
              : T[K] extends mongoose.Types.DocumentArray<infer ItemType>
                ? mongoose.Types.DocumentArray<ObjectIdToString<ItemType>>
                : T[K] extends mongoose.Types.Subdocument<unknown, unknown, infer SubdocType>
                  ? mongoose.HydratedSingleSubdocument<ObjectIdToString<SubdocType>>
                  : ObjectIdToString<T[K]>;
          }
        : T;

type TypedResponseMethod<T> = T extends z.ZodType
  ? {
      json: (body: ObjectIdToString<z.infer<T>>) => void;
      send: (body: ObjectIdToString<z.infer<T>>) => void;
    }
  : never;

/**
 * A typed version of the Express Response object that
 * infers the response types based on the content type of the route configuration.
 */
type TypedResponse<TConfig extends TypedRouteConfig> = {
  status: <TCode extends keyof TConfig["responses"]>(
    code: TCode
  ) => TConfig["responses"] extends { [K in TCode]: { content: infer TContent } }
    ? TContent["application/json" & keyof TContent] extends { schema: infer TSchema }
      ? TypedResponseMethod<TSchema>
      : Omit<Response, "status" | keyof TypedResponseMethod<unknown>>
    : Omit<Response, "status">;
};

/**
 * A typed version of the Express RequestHandler that
 * infers the request and response types based on the route configuration.
 */
type TypedRequestHandler<TConfig extends TypedRouteConfig> = RequestHandler<
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
 * A typed version of the Express RequestHandler that
 * infers the request and response types based on the route configuration.
 */
export type RouteHandler<TConfig extends TypedRouteConfig> = {
  (
    req: Parameters<TypedRequestHandler<TConfig>>[0],
    res: TypedResponse<TConfig>,
    next: Parameters<TypedRequestHandler<TConfig>>[2]
  ): ReturnType<TypedRequestHandler<TConfig>>;
};
