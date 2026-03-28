import type { ZodObjectShapeMap } from "@/types/common.js";

import { HttpStatusPhrases } from "@repo/shared";
import type { UserDB } from "@repo/types";
import { Types } from "mongoose";

import createMessageObjectSchema from "@/helpers/create-message-object-schema.js";
import z from "@/lib/zod.js";

export const errorSchema = createMessageObjectSchema().extend({
  stack: z
    .string()
    .optional()
    .openapi({ description: "Available only in non-production environments" }),
});
export type Error = z.infer<typeof errorSchema>;

export const validationErrorSchema = z
  .array(
    z.object({
      name: z.string(),
      issues: z.array(
        z.object({
          code: z.string(),
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string(),
        })
      ),
    })
  )
  .openapi("ValidationError");
export type ValidationError = z.infer<typeof validationErrorSchema>;

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const objectIdSchema = z
  .union([z.string(), z.instanceof(Types.ObjectId)])
  .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid ObjectId" })
  .transform((val) => val.toString())
  .openapi({ type: "string", format: "string" });

export const fileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]).openapi({
      description: "Allowed MIME types: image/jpeg, image/png, image/webp, image/gif",
    }),
    size: z.number().max(5 * 1024 * 1024), // 5MB
    buffer: z.instanceof(Buffer).openapi({ type: "string", format: "binary" }),
  } satisfies ZodObjectShapeMap<
    Omit<Express.Multer.File, "destination" | "filename" | "path" | "stream">
  >)
  .openapi({ type: "string", format: "binary" });
export type File = z.infer<typeof fileSchema>;

export const paginationMetaSchema = z
  .object({
    totalItems: z
      .number()
      .int()
      .nonnegative()
      .openapi({ description: "Total number of items available" }),
    itemCount: z
      .number()
      .int()
      .nonnegative()
      .openapi({ description: "Number of items returned in the current response" }),
    itemsPerPage: z
      .number()
      .int()
      .nonnegative()
      .openapi({ description: "Number of items per page" }),
    totalPages: z.number().int().nonnegative().openapi({ description: "Total number of pages" }),
    currentPage: z.number().int().nonnegative().openapi({ description: "Current page number" }),
  })
  .openapi("PaginationMeta");

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
