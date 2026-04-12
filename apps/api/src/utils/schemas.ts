import type { ZodType } from "zod";

import {
  httpErrorSchema as sharedHttpErrorSchema,
  HttpStatusPhrases,
  httpValidationErrorSchema as sharedHttpValidationErrorSchema,
} from "@repo/shared";
import type { GeneralErrorPayload, PaginationPayload, ValidationErrorPayload } from "@repo/types";
import { isObjectIdOrHexString, Types } from "mongoose";

import { z } from "@/lib/zod.js";

export const httpErrorSchema = z
  .object(sharedHttpErrorSchema.shape)
  .openapi("HTTPError") satisfies ZodType<GeneralErrorPayload>;
export type Error = z.infer<typeof httpErrorSchema>;

export const httpValidationErrorSchema = z
  .array(z.object(sharedHttpValidationErrorSchema.element.shape))
  .openapi("HTTPValidationError") satisfies ZodType<ValidationErrorPayload>;
export type ValidationError = z.infer<typeof httpValidationErrorSchema>;

export const httpNotFoundSchema = z
  .object({
    message: z.string(),
  })
  .openapi("HTTPNotFoundError", { example: HttpStatusPhrases.NOT_FOUND });

export const atLeastOneField = (obj: Record<string, unknown>): boolean =>
  Object.keys(obj).length > 0;

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
 * Placeholder schema, to show in openapi documentation.
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
  .openapi("Pagination") satisfies ZodType<PaginationPayload<unknown[]>["meta"]>;

export const paginationPayloadSchema = <T extends z.ZodArray>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    meta: metaPaginationSchema,
  });

export const stringSchema = z.string().trim().nonempty();
