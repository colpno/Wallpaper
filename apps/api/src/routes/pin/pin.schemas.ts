import type {
  AddOne,
  DeleteOneById,
  GetMany,
  GetManyWithSaves,
  GetOneById,
  Search,
  UpdateOneById,
} from "./pin.types.js";
import type { RequestSchemas, ZodObjectShapeMap } from "@/types/common.js";
import type { NormalizeFilterOperators } from "@/utils/parse-filter-operators.js";
import type { ZodType } from "zod";

import { HttpStatusCodes } from "@repo/shared";
import type { PinAPIs, PinDB, UserDB } from "@repo/types";

import { z } from "@/lib/zod.js";
import { createQueryFilterSchema } from "@/utils/create-query-filter-schema.js";
import {
  httpErrorSchema,
  httpNotFoundSchema,
  httpValidationErrorSchema,
  metaPaginationSchema,
  objectIdSchema,
  paginationPayloadSchema,
  placeholderFileSchema,
  stringSchema,
} from "@/utils/schemas.js";

import * as handlers from "./pin.handlers.js";

export const pinSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: stringSchema,
    updatedAt: stringSchema,
    pinOwner: objectIdSchema,
    pinTitle: stringSchema.optional(),
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

export const selectableFields: PinAPIs.Fields[] = Object.keys(pinSchema.shape) as Array<
  keyof typeof pinSchema.shape
>;

export const sortableFields: PinAPIs.SortableFields[] = [
  "createdAt",
  "updatedAt",
  "photoWidth",
  "photoHeight",
  "photoAspectRatio",
];

export const embeddableFields: PinAPIs.EmbeddableFields[] = ["pinOwner"];

const queryFilterSchema = createQueryFilterSchema<PinDB<UserDB>>()(
  {
    pinTitle: stringSchema,
    pinDescription: stringSchema,
    pinOwner: stringSchema,
    photoWidth: z.number(),
    photoHeight: z.number(),
    photoAspectRatio: z.number(),
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
        z.array(pinSchema),
        z.object({
          data: z.array(pinSchema),
          meta: metaPaginationSchema,
        }),
      ]) satisfies ZodType<GetMany["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  getManyWithSaves: {
    query: queryFilterSchema.omit({ pinOwner: true }).extend({
      pinOwner: stringSchema,
    }) satisfies ZodType<NormalizeFilterOperators<GetManyWithSaves["query"]>>,
    responses: {
      [HttpStatusCodes.OK]: z.union([
        z.array(pinSchema),
        z.object({
          data: z.array(pinSchema),
          meta: metaPaginationSchema,
        }),
      ]) satisfies ZodType<GetManyWithSaves["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
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
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },

  addOne: {
    body: pinSchema
      .pick({
        pinTitle: true,
        pinDescription: true,
        pinOwner: true,
      })
      .extend({
        photo: placeholderFileSchema,
      }) satisfies ZodType<AddOne["body"]>,
    responses: {
      [HttpStatusCodes.CREATED]: pinSchema satisfies ZodType<AddOne["response"]>,
      [HttpStatusCodes.BAD_REQUEST]: httpErrorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
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
      } satisfies Record<keyof Omit<Required<UpdateOneById["body"]>, "photo">, true>)
      .extend({
        photo: placeholderFileSchema,
      })
      .partial(),
    responses: {
      [HttpStatusCodes.OK]: pinSchema satisfies ZodType<UpdateOneById["response"]>,
      [HttpStatusCodes.NOT_FOUND]: httpNotFoundSchema,
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

  search: {
    query: queryFilterSchema
      .pick({
        limit: true,
        page: true,
        select: true,
        sort: true,
      })
      .extend({
        lastSmallestScore: z.coerce.number().openapi({
          description: "The smallest score amongst the last search results, used in pagination.",
        }),
      }) satisfies ZodType<Search["query"]>,
    body: z.union([
      z.object({
        text: stringSchema,
      }),
      z.object({
        embedding: pinSchema.shape.descriptionEmbeddings,
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
      ).extend({
        message: z.string().optional(),
      }) satisfies ZodType<Search["response"]>,
      [HttpStatusCodes.SERVICE_UNAVAILABLE]: httpErrorSchema,
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: httpValidationErrorSchema,
    },
  },
} satisfies RequestSchemas<keyof typeof handlers>;
