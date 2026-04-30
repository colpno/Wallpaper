import type { AddOne, CheckSaved, DeleteOneById, GetMany } from "./saved-idea.types.js";
import type { RequestSchemas } from "@/types/common.js";
import type { NormalizeFilterOperators } from "@/utils/parse-filter-operators.js";
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

import { selectableFields as selectablePinFields } from "../pin/pin.schemas.js";
import { selectableFields as selectableUserFields } from "../user/user.schemas.js";
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

export const selectableFields: SavedIdeaAPIs.Fields[] = [
  ...(Object.keys(savedIdeaSchema.shape) as Array<keyof typeof savedIdeaSchema.shape>),
  ...selectablePinFields.map((field) => `pin.${field}` as const),
  ...selectableUserFields.map((field) => `savedBy.${field}` as const),
];

export const sortableFields: SavedIdeaAPIs.SortableFields[] = [
  "createdAt",
  "updatedAt",
  "pin.createdAt",
  "pin.updatedAt",
  "pin.photoWidth",
  "pin.photoHeight",
  "pin.photoAspectRatio",
];

export const embeddableFields: SavedIdeaAPIs.EmbeddableFields[] = ["savedBy", "pin"];

export const queryFilterSchema = createQueryFilterSchema<SavedIdeaDB<UserDB, PinDB<UserDB>>>()(
  {
    savedBy: stringSchema,
    pin: stringSchema,
  },
  {
    embeddableFields,
    selectableFields,
    sortableFields,
  }
);

export const requestSchemas = {
  getMany: {
    query: queryFilterSchema satisfies ZodType<NormalizeFilterOperators<GetMany["query"]>>,
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
