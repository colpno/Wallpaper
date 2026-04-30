import type { DeleteOneById, GetOne, UpdateOneById } from "./user.types.js";
import type { RequestSchemas } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { UserAPIs, UserDB } from "@repo/types";

import { z } from "@/lib/zod.js";
import { escapeHTML } from "@/utils/converters.js";
import { createQueryFilterSchema } from "@/utils/create-query-filter-schema.js";
import {
  atLeastOneField,
  escapedStringSchema,
  httpNotFoundSchema,
  httpValidationErrorSchema,
  objectIdSchema,
  placeholderFileSchema,
  stringSchema,
} from "@/utils/schemas.js";

import * as handlers from "./user.handlers.js";

export const userSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: escapedStringSchema,
    updatedAt: escapedStringSchema,
    email: z.email(),
    firstName: escapedStringSchema,
    lastName: escapedStringSchema,
    username: escapedStringSchema,
    birthdate: escapedStringSchema,
    password: z.string().min(6).transform(escapeHTML),
    salt: escapedStringSchema,
    avatarUrl: z.url().optional(),
    avatarCloudinaryId: escapedStringSchema.optional(),
  })
  .openapi("User") satisfies ZodType<UserDB>;

export const selectableFields: UserAPIs.Fields[] = Object.keys(userSchema.shape) as Array<
  keyof typeof userSchema.shape
>;

export const sortableFields: UserAPIs.SortableFields[] = [
  "createdAt",
  "updatedAt",
  "firstName",
  "lastName",
  "username",
  "email",
  "birthdate",
];

const queryFilterSchema = createQueryFilterSchema<UserDB>()(
  {
    firstName: stringSchema,
    lastName: stringSchema,
    username: stringSchema,
    email: stringSchema,
    birthdate: stringSchema,
    avatarUrl: z.url(),
  },
  {
    selectableFields,
    sortableFields,
  }
);

export const requestSchemas = {
  getOne: {
    query: queryFilterSchema
      .pick({
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        birthdate: true,
        avatarUrl: true,
        select: true,
        embed: true,
      } satisfies Record<keyof GetOne["query"], true>)
      .refine(atLeastOneField),
    responses: {
      [HttpStatusCodes.OK]: userSchema.pick({
        _id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatarUrl: true,
      }) satisfies ZodType<GetOne["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

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
      [HttpStatusCodes.OK]: userSchema.pick({
        _id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatarUrl: true,
      }) satisfies ZodType<UpdateOneById["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  deleteOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<DeleteOneById["params"]>,
    responses: {
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
