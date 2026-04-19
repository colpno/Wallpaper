import type { AddOne, CheckSaved, GetMany } from "./saved-idea.types.js";
import type { RequestSchemas } from "@/types/common.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { PinDB, SavedIdeaAPIs, SavedIdeaDB, UserDB } from "@repo/types";

import { z } from "@/lib/zod.js";
import { createQueryFilterSchema } from "@/utils/create-query-filter-schema.js";
import {
  httpErrorSchema,
  httpNotFoundSchema,
  httpValidationErrorSchema,
  metaPaginationSchema,
  objectIdSchema,
  stringSchema,
} from "@/utils/schemas.js";

import { pinSchema } from "../pin/pin.schemas.js";
import { userSchema } from "../user/user.schemas.js";
import * as handlers from "./saved-idea.handlers.js";

export const savedIdeaSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: stringSchema,
    updatedAt: stringSchema,
    savedBy: stringSchema,
    pin: stringSchema,
  })
  .openapi("SavedIdea") satisfies ZodType<SavedIdeaDB>;

export const queryFilterSchema = createQueryFilterSchema<SavedIdeaDB<UserDB, PinDB>>()(
  {
    user: z.string(),
    pin: z.string(),
  },
  {
    embeddableFields: ["savedBy", "pin"],
    selectableFields: [
      ...(Object.keys(savedIdeaSchema.shape) as Array<keyof typeof savedIdeaSchema.shape>),
      ...(Object.keys(userSchema.shape).map(
        (k) => `savedBy.${k}`
      ) as Array<`savedBy.${keyof typeof userSchema.shape}`>),
      ...(Object.keys(pinSchema.shape).map(
        (k) => `pin.${k}`
      ) as Array<`pin.${keyof typeof pinSchema.shape}`>),
    ],
    sortableFields: [
      "createdAt",
      "updatedAt",
      "pin.createdAt",
      "pin.updatedAt",
      "pin.removedAt",
      "pin.photoWidth",
      "pin.photoHeight",
      "pin.photoAspectRatio",
    ] satisfies SavedIdeaAPIs.SortableFields[],
  }
);

export const requestSchemas = {
  getMany: {
    query: queryFilterSchema
      .pick({
        embed: true,
        select: true,
        limit: true,
        page: true,
        sort: true,
      })
      .extend({
        userId: objectIdSchema,
      }),
    responses: {
      [HttpStatusCodes.OK]: z.union([
        z.array(savedIdeaSchema),
        z.object({
          data: z.array(savedIdeaSchema),
          meta: metaPaginationSchema,
        }),
      ]) satisfies ZodType<GetMany["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  checkSaved: {
    query: z.object({
      userId: objectIdSchema,
      pinId: objectIdSchema,
    }) satisfies ZodType<CheckSaved["query"]>,
    responses: {
      [HttpStatusCodes.OK]: z.object({ saved: z.boolean() }) satisfies ZodType<
        CheckSaved["response"]
      >,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  addOne: {
    body: savedIdeaSchema
      .pick({
        savedBy: true,
      })
      .extend({
        pin: objectIdSchema,
      }) satisfies ZodType<AddOne["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: savedIdeaSchema satisfies ZodType<AddOne["response"]>,
      [HttpStatusCodes.CONFLICT]: httpErrorSchema,
      [HttpStatusCodes.BAD_REQUEST]: httpErrorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
