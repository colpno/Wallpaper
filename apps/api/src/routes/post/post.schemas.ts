import type { ZodObjectShapeMap } from "@/types/common.js";
import type { Types } from "mongoose";

import type { PostDB, UserDB } from "@repo/types";

import { objectIdSchema } from "@/constants/schemas.js";
import buildQueryFilterSchema from "@/helpers/create-query-schema.js";
import z from "@/lib/zod.js";

export const postSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    removedAt: z.string().optional(),
    postTitle: z.string(),
    postOwner: objectIdSchema,
    postDescription: z.string().optional(),
    photoCloudinaryId: z.string().optional(),
    photoUrl: z.string(),
    photoWidth: z.number().int(),
    photoHeight: z.number().int(),
    photoAspectRatio: z.number(),
    photoDescription: z.string(),
    photoBlurHash: z.string(),
    descriptionEmbeddings: z.array(z.number()),
  } satisfies ZodObjectShapeMap<PostDB>)
  .openapi("Post");

export const queryFilterSchema = buildQueryFilterSchema<PostDB<UserDB | string | Types.ObjectId>>(
  {
    removedAt: "string",
    postTitle: "string",
    postDescription: "string",
    postOwner: "string",
    photoWidth: "number",
    photoHeight: "number",
    photoAspectRatio: "number",
  },
  {
    embeddableFields: ["postOwner"],
    projectFields: [
      "_id",
      "__v",
      "createdAt",
      "updatedAt",
      ...(Object.keys(postSchema.shape) as Array<keyof typeof postSchema.shape>),
    ],
    sortableFields: [
      "createdAt",
      "updatedAt",
      "removedAt",
      "photoWidth",
      "photoHeight",
      "photoAspectRatio",
    ],
  }
).openapi({ type: "object" });
