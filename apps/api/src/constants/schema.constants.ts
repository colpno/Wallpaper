import type { ZodObjectShapeMap } from "@/types";

import { HttpStatusPhrases } from "@repo/shared";
import { Types } from "mongoose";

import { createMessageObjectSchema } from "@/helpers";
import z from "@/lib/zod";

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
    mimetype: z.enum(["image/jpeg", "image/png", "image/gif"]),
    size: z.number().max(5 * 1024 * 1024), // 5MB
    buffer: z.instanceof(Buffer).openapi({ type: "string", format: "binary" }),
  } satisfies ZodObjectShapeMap<
    Omit<Express.Multer.File, "destination" | "filename" | "path" | "stream">
  >)
  .openapi({ type: "string", format: "binary" });
export type File = z.infer<typeof fileSchema>;
