import type { ZodObjectShapeMap } from "@/types/common.types";
import type { Comment, DefaultModelProps } from "@/types/model.types";
import type { ObjectIdToString } from "mongoose";

import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

import {
  commentSchema,
  errorSchema,
  notFoundSchema,
  objectIdSchema,
  paginationMetaSchema,
  validationErrorSchema,
} from "@/constants/schema.constants";
import createQuerySchema from "@/helpers/create-query-schema";
import jsonContent from "@/helpers/json-content";
import registerRoute from "@/helpers/register-route";
import { registry } from "@/lib/openapi";
import z, { atLeastOneFieldDefined } from "@/lib/zod";

const tags = ["Comment"];
const basePath = "/comments";
const querySchema = createQuerySchema<ObjectIdToString<Comment>>((schemas) => ({
  createdAt: schemas.date,
  updatedAt: schemas.date,
  owner: objectIdSchema,
  postId: objectIdSchema,
  text: schemas.string,
}));

export const getMany = registerRoute({
  tags,
  method: "get",
  path: basePath,
  summary: "Get multiple comments",
  description: "Retrieve multiple comments.",
  request: {
    query: registry.register("GetCommentsQuery", querySchema),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register(
        "GetCommentsResponse",
        z.object({
          data: z.array(commentSchema),
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
  summary: "Add a comment",
  description: "Create a new comment.",
  request: {
    body: jsonContent(
      registry.register(
        "AddCommentBody",
        z.object({
          owner: objectIdSchema,
          postId: objectIdSchema,
          text: z.string().optional(),
        } satisfies ZodObjectShapeMap<Omit<ObjectIdToString<Comment>, keyof DefaultModelProps>>)
      )
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      registry.register("AddCommentResponse", commentSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorSchema, "Bad Request"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const updateOneById = registerRoute({
  tags,
  method: "put",
  path: `${basePath}/{id}`,
  summary: "Update a comment by ID",
  description: "Update an existing comment using its unique ID.",
  request: {
    params: registry.register(
      "UpdateCommentByIdParams",
      z.object({
        id: objectIdSchema,
      })
    ),
    body: jsonContent(
      registry.register(
        "UpdateCommentByIdBody",
        z
          .object({
            text: z.string(),
          } satisfies ZodObjectShapeMap<Pick<Comment, "text">>)
          .partial()
          .refine(atLeastOneFieldDefined, {
            message: "At least one field must be provided for update",
          })
      )
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      registry.register("UpdateCommentByIdResponse", commentSchema),
      "Successful Response"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, HttpStatusPhrases.NOT_FOUND),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(errorSchema, "Bad Request"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(validationErrorSchema, "Validation Error"),
  },
});

export const deleteOneById = registerRoute({
  tags,
  method: "delete",
  path: `${basePath}/{id}`,
  summary: "Remove a comment by ID",
  description: "Remove a single comment using its unique ID.",
  request: {
    params: registry.register(
      "RemoveCommentByIdParams",
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

export type GetManyRoute = typeof getMany;
export type AddRoute = typeof add;
export type UpdateOneByIdRoute = typeof updateOneById;
export type DeleteOneByIdRoute = typeof deleteOneById;
