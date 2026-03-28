import type { ZodObjectShapeMap } from "@/types/common.js";
import type { ObjectIdToString } from "mongoose";

import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";
import type { Post } from "@repo/types";

import {
  errorSchema,
  type File,
  fileSchema,
  notFoundSchema,
  objectIdSchema,
  paginationMetaSchema,
  validationErrorSchema,
} from "@/constants/schemas.js";
import jsonContent from "@/helpers/json-content.js";
import multipartContent from "@/helpers/multipart-content.js";
import registerRoute from "@/helpers/register-route.js";
import { registry } from "@/lib/openapi.js";
import z, { atLeastOneFieldDefined } from "@/lib/zod.js";

import { postSchema, queryFilterSchema } from "./post.schemas.js";

const tags = ["Post"];
const basePath = "/posts";

export const getOneById = registerRoute({
  tags,
  method: "get",
  path: `${basePath}/{id}`,
  summary: "Get a post by ID",
  description: "Retrieve a post by its ID.",
  request: {
    params: registry.register(
      "GetPostByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
    query: registry.register(
      "GetPostByIdQuery",
      queryFilterSchema.pick({
        select: true,
        embed: true,
      })
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register("GetPostByIdResponse", postSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const getMany = registerRoute({
  tags,
  method: "get",
  path: basePath,
  summary: "Get multiple posts",
  description: "Retrieve multiple posts.",
  request: {
    query: registry.register("GetPostsQuery", queryFilterSchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register(
        "GetPostsResponse",
        z.object({
          data: z.array(postSchema),
          meta: paginationMetaSchema,
        })
      ),
      "Successful Response"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const add = registerRoute({
  tags,
  method: "post",
  path: basePath,
  summary: "Add a post",
  description: "Create a new post.",
  request: {
    body: multipartContent(
      registry.register(
        "AddPostBody",
        z.object({
          postTitle: z.string(),
          postDescription: z.string().optional(),
          postOwner: objectIdSchema,
          photo: fileSchema,
          photoBlurHash: z.string(),
        } satisfies ZodObjectShapeMap<
          Partial<ObjectIdToString<Post>> & {
            photo: File;
          }
        >)
      )
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      registry.register("AddPostResponse", postSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorSchema, "Bad Request"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

const updateBody = z
  .object({
    postTitle: z.string(),
    postDescription: z.string(),
    photo: fileSchema,
    photoBlurHash: z.string(),
  } satisfies ZodObjectShapeMap<Partial<Post> & { photo: File }>)
  .partial()
  .superRefine((data, ctx) => {
    if (data.photo && !data.photoBlurHash) {
      ctx.addIssue({
        code: "custom",
        path: ["photoBlurHash"],
        message: "photoBlurHash is required when photo is provided",
      });
    }
  })
  .refine(atLeastOneFieldDefined, {
    message: "At least one field must be provided for update",
  });
export const updateOneById = registerRoute({
  tags,
  method: "put",
  path: `${basePath}/{id}`,
  summary: "Update a post by ID",
  description: "Update an existing post using its unique ID.",
  request: {
    params: registry.register(
      "UpdatePostByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
    body: {
      content: {
        "multipart/form-data": {
          schema: registry.register("UpdatePostByIdBody", updateBody),
        },
        "application/json": {
          schema: registry.register("UpdatePostByIdBody", updateBody.omit({ photo: true })),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register("UpdatePostByIdResponse", postSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorSchema, "Bad Request"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const removeOneById = registerRoute({
  tags,
  method: "delete",
  path: `${basePath}/{id}`,
  summary: "Softly remove a post by ID",
  description: "Softly remove a single post using its unique ID.",
  request: {
    params: registry.register(
      "RemovePostByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const removeMany = registerRoute({
  tags,
  method: "delete",
  path: basePath,
  summary: "Remove multiple posts",
  description: "Remove multiple posts using its unique IDs.",
  request: {
    body: jsonContent(
      registry.register(
        "RemovePostsParams",
        z.object({
          ids: z.array(objectIdSchema).min(1),
        })
      )
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const undoRemoval = registerRoute({
  tags,
  method: "put",
  path: `${basePath}/undo-removal`,
  summary: "Undo removal of multiple posts",
  description: "Undo removal of multiple posts.",
  request: {
    body: jsonContent(
      registry.register(
        "UndoRemovalPostsParams",
        z.object({
          ids: z.array(objectIdSchema).min(1),
        })
      )
    ),
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const search = registerRoute({
  tags,
  method: "post",
  path: `${basePath}/search`,
  summary: "Search for similar posts",
  description: "Search for similar posts using an image or text.",
  request: {
    query: registry.register("PostSearchQuery", queryFilterSchema),
    body: jsonContent(
      registry.register(
        "PostSearchBody",
        z.object({
          search: z.string(),
        })
      )
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register(
        "PostSearchResponse",
        z.array(
          postSchema
            .omit({
              descriptionEmbeddings: true,
              photoCloudinaryId: true,
            })
            .extend({
              score: z.number(),
            })
        )
      ),
      "Successful Response"
    ),
    [HttpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(errorSchema, "Service Unavailable (local)"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export type GetOneByIdRoute = typeof getOneById;
export type GetManyRoute = typeof getMany;
export type AddRoute = typeof add;
export type UpdateOneByIdRoute = typeof updateOneById;
export type RemoveOneByIdRoute = typeof removeOneById;
export type RemoveManyRoute = typeof removeMany;
export type UndoRemovalRoute = typeof undoRemoval;
export type SearchRoute = typeof search;
