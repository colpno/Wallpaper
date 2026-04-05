import type { DeleteOneById, UpdateOneById } from "./user.types.js";
import type { RequestSchemas, ZodObjectShapeMap } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { UserDB } from "@repo/types";

import z from "@/lib/zod.js";
import {
  notFoundSchema,
  objectIdSchema,
  placeholderFileSchema,
  stringSchema,
  validationErrorSchema,
} from "@/utils/schemas.js";

import * as handlers from "./user.handlers.js";

export const userSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: stringSchema,
    updatedAt: stringSchema,
    email: z.email(),
    username: z.string().min(3).max(30),
    password: z.string().min(6),
    salt: z.string(),
    avatarUrl: stringSchema.optional(),
    avatarCloudinaryId: stringSchema.optional(),
  } satisfies ZodObjectShapeMap<UserDB>)
  .openapi("User");

export const requestSchemas = {
  updateOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<UpdateOneById["params"]>,
    body: userSchema
      .pick({
        email: true,
        password: true,
        username: true,
      })
      .partial()
      .extend({
        avatar: placeholderFileSchema,
      }) satisfies ZodType<UpdateOneById["body"]>,
    responses: {
      [HttpStatusCodes.OK]: userSchema satisfies ZodType<UpdateOneById["response"]>,
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  deleteOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<DeleteOneById["params"]>,
    responses: {
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
