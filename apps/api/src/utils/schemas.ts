import type { ZodType } from "zod";

import { HttpStatusPhrases } from "@repo/shared";
import type { FailedPayload, PaginationPayload } from "@repo/types";
import { isObjectIdOrHexString, Types } from "mongoose";

import z from "@/lib/zod.js";

function createMessageObjectSchema(message?: string) {
  const schema = z.object({
    message: z.string(),
  });

  const example: z.infer<typeof schema> | undefined = message ? { message } : undefined;

  return schema.openapi({ example });
}

export const atLeastOneField = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length > 0;

export const errorSchema = createMessageObjectSchema().extend({
  stack: z
    .string()
    .optional()
    .openapi({ description: "Available only in non-production environments" }),
}) satisfies ZodType<FailedPayload>;
export type Error = z.infer<typeof errorSchema>;

export const validationErrorSchema = z
  .array(
    z.object({
      name: z.string(),
      issues: z.array(
        z.object({
          code: z.string(),
          path: z.array(z.string()),
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
  .refine(isObjectIdOrHexString, "Invalid ObjectId")
  .transform((val) => val.toString())
  .openapi({ type: "string", format: "string" });

export const fileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]).openapi({
    description: "Allowed MIME types: image/jpeg, image/png, image/webp, image/gif",
  }),
  size: z.number().max(5 * 1024 * 1024), // 5MB
  buffer: z.instanceof(Buffer),
}) satisfies ZodType<Omit<Express.Multer.File, "stream" | "destination" | "filename" | "path">>;
export type File = z.infer<typeof fileSchema>;

/**
 * Placeholder schema, Multer must handle this.
 */
export const placeholderFileSchema = z.any().openapi({ type: "string", format: "binary" });

export const metaPaginationSchema = z
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
  .openapi("MetaPagination") satisfies ZodType<PaginationPayload<unknown[]>["meta"]>;

export const paginationPayloadSchema = <T extends z.ZodArray>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: metaPaginationSchema,
  });

export const stringSchema = z.string().trim().nonempty();
