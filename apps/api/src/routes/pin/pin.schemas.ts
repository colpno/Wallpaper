import type {
  AddOne,
  GetMany,
  GetOneById,
  RemoveMany,
  RemoveOneById,
  Search,
  UndoRemoval,
  UpdateOneById,
} from "./pin.types.js";
import type { RequestSchemas, ZodObjectShapeMap } from "@/types/common.js";
import type { Types } from "mongoose";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { PinDB, UserDB } from "@repo/types";

import { z } from "@/lib/zod.js";
import { createQueryFilterSchema } from "@/utils/create-query-filter-schema.js";
import {
  errorSchema,
  metaPaginationSchema,
  notFoundSchema,
  objectIdSchema,
  paginationPayloadSchema,
  placeholderFileSchema,
  stringSchema,
  validationErrorSchema,
} from "@/utils/schemas.js";

import * as handlers from "./pin.handlers.js";

export const pinSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: stringSchema,
    updatedAt: stringSchema,
    removedAt: stringSchema.optional(),
    pinTitle: stringSchema,
    pinOwner: objectIdSchema,
    pinDescription: stringSchema.optional(),
    photoCloudinaryId: stringSchema.optional(),
    photoBlurHash: stringSchema,
    photoUrl: stringSchema,
    photoWidth: z.number().int(),
    photoHeight: z.number().int(),
    photoAspectRatio: z.number(),
    photoDescription: stringSchema,
    descriptionEmbeddings: z.array(z.number()),
  } satisfies ZodObjectShapeMap<PinDB>)
  .openapi("Pin");

const queryFilterSchema = createQueryFilterSchema<PinDB<UserDB | string | Types.ObjectId>>()(
  {
    removedAt: z.string(),
    pinTitle: z.string(),
    pinDescription: z.string(),
    pinOwner: z.string(),
    photoWidth: z.number(),
    photoHeight: z.number(),
    photoAspectRatio: z.number(),
  },
  {
    embeddableFields: ["pinOwner"],
    selectableFields: Object.keys(pinSchema.shape) as Array<keyof typeof pinSchema.shape>,
    sortableFields: [
      "createdAt",
      "updatedAt",
      "removedAt",
      "photoWidth",
      "photoHeight",
      "photoAspectRatio",
    ],
  }
);

export const requestSchemas = {
  getMany: {
    query: queryFilterSchema,
    responses: {
      [HttpStatusCodes.OK]: z.union([
        z.array(pinSchema),
        z.object({
          data: z.array(pinSchema),
          meta: metaPaginationSchema,
        }),
      ]) satisfies ZodType<GetMany["response"]>,
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  getOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<GetOneById["params"]>,
    query: queryFilterSchema.pick({
      select: true,
      embed: true,
    } satisfies Record<keyof GetOneById["query"], true>),
    responses: {
      [HttpStatusCodes.OK]: pinSchema satisfies ZodType<GetOneById["response"]>,
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  addOne: {
    body: pinSchema
      .pick({
        pinTitle: true,
        pinDescription: true,
        pinOwner: true,
        photoBlurHash: true,
      })
      .extend({
        photo: placeholderFileSchema,
      }) satisfies ZodType<AddOne["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: pinSchema satisfies ZodType<AddOne["response"]>,
      [HttpStatusCodes.BAD_REQUEST]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  updateOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<UpdateOneById["params"]>,
    body: pinSchema
      .pick({
        pinTitle: true,
        pinDescription: true,
        photoBlurHash: true,
      } satisfies Record<keyof Omit<Required<UpdateOneById["body"]>, "photo">, true>)
      .extend({
        photo: placeholderFileSchema,
      })
      .partial(),
    responses: {
      [HttpStatusCodes.OK]: pinSchema satisfies ZodType<UpdateOneById["response"]>,
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.BAD_REQUEST]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  removeOneById: {
    params: z.object({
      id: objectIdSchema,
    }) satisfies ZodType<RemoveOneById["params"]>,
    responses: {
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  removeMany: {
    body: z.object({
      ids: z.array(objectIdSchema).min(1),
    }) satisfies ZodType<RemoveMany["body"]>,
    responses: {
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  undoRemoval: {
    body: z.object({
      ids: z.array(objectIdSchema).min(1),
    }) satisfies ZodType<UndoRemoval["body"]>,
    responses: {
      [HttpStatusCodes.NOT_FOUND]: notFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },

  search: {
    query: queryFilterSchema,
    body: z.union([
      z.object({
        text: stringSchema,
      }),
      z.object({
        image: placeholderFileSchema,
      }),
    ]) satisfies ZodType<Search["body"]>,
    responses: {
      [HttpStatusCodes.OK]: paginationPayloadSchema(
        z.array(
          pinSchema
            .omit({
              descriptionEmbeddings: true,
              photoCloudinaryId: true,
            })
            .extend({
              score: z.number(),
            })
        )
      ) satisfies ZodType<Search["response"]>,
      [HttpStatusCodes.SERVICE_UNAVAILABLE]: errorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: validationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
