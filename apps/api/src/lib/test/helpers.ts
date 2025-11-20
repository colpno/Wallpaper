import type { File } from "@/constants/schema.constants";
import type { RequestContentType, TypedRouteConfig } from "@/types/route-handler.types";
import type z from "zod";

import createTestClient from "@/helpers/create-test-client";
import postRouter from "@/routes/post/post.index";
import * as postRoutes from "@/routes/post/post.routes";

type ExtractRequestSchema<
  TConfig extends TypedRouteConfig,
  TMethod extends keyof TConfig["request"],
  TContentType extends RequestContentType = RequestContentType,
> = TMethod extends "body"
  ? TConfig["request"] extends { body: { content: infer MediaObject } }
    ? MediaObject[TContentType & keyof MediaObject] extends { schema: infer S }
      ? S
      : never
    : never
  : TConfig["request"] extends { [K in Exclude<TMethod, "body">]: infer S }
    ? S
    : never;

type InferSchema<
  TConfig extends TypedRouteConfig,
  TMethod extends keyof TConfig["request"],
  TContentType extends RequestContentType = RequestContentType,
> = z.infer<ExtractRequestSchema<TConfig, TMethod, TContentType>>;

type AddPostBody = InferSchema<typeof postRoutes.add, "body", "multipart/form-data">;

export const addPost = (body?: Omit<AddPostBody, "photo"> & { photo: string }) => {
  const { photo, ...rest } = body || {};
  const client = createTestClient(postRouter)[postRoutes.add.method](postRoutes.add)();
  if (photo) {
    client.attach("photo" as keyof Pick<AddPostBody, "photo">, photo);
  }
  return client.field(rest);
};

type UpdatePostByIdBodyJson = InferSchema<
  typeof postRoutes.updateOneById,
  "body",
  "application/json"
>;
type UpdatePostByIdBodyMultipart = InferSchema<
  typeof postRoutes.updateOneById,
  "body",
  "multipart/form-data"
>;
type UpdatePostByIdParams = InferSchema<typeof postRoutes.updateOneById, "params">;

export const updatePostById = (
  params?: UpdatePostByIdParams,
  body?: UpdatePostByIdBodyJson | UpdatePostByIdBodyMultipart
) => {
  const client = createTestClient(postRouter);
  if (body && "photo" in body && body.photo) {
    const { photo, ...rest } = body;
    return client[postRoutes.updateOneById.method](postRoutes.updateOneById)({
      params,
    })
      .attach(
        "photo" as keyof Pick<UpdatePostByIdBodyMultipart, "photo">,
        photo as Exclude<UpdatePostByIdBodyMultipart["photo"], File> & string
      )
      .field(rest);
  }
  return client[postRoutes.updateOneById.method](postRoutes.updateOneById)({
    params,
    body,
  });
};
