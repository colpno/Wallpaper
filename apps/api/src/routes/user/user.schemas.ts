import type { DeleteOneById, UpdateOneById } from "./user.types.js";
import type { RequestSchemas, ZodObjectShapeMap } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { UserDB } from "@repo/types";

import z from "@/lib/zod.js";
import {
  atLeastOneField,
  notFoundSchema,
  objectIdSchema,
  placeholderFileSchema,
  validationErrorSchema,
} from "@/utils/schemas.js";

import * as handlers from "./user.handlers.js";

export const userSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    email: z.email(),
    username: z.string(),
    password: z.string().min(6),
    salt: z.string(),
    avatarUrl: z.string().optional(),
    avatarCloudinaryId: z.string().optional(),
  } satisfies ZodObjectShapeMap<UserDB>)
  .openapi("User");

export const requestSchemas = {
  updateOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<UpdateOneById["params"]>,
    body: z
      .object({
        email: z.email().optional(),
        password: z.string().min(6).optional(),
        username: z.string().min(3).max(30).optional(),
      })
      .extend({
        avatar: placeholderFileSchema,
      })
      .refine(atLeastOneField) satisfies ZodType<UpdateOneById["body"]>,
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
