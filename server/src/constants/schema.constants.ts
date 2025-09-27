import { HttpStatusPhrases } from "@wallpaper/shared";
import { Types } from "mongoose";

import { createMessageObjectSchema } from "@/helpers";
import z from "@/lib/zod";
import type { TSToZodObjectShape } from "@/types";

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);

export const errorSchema = z.union([
  createMessageObjectSchema(),
  z.object({
    name: z.string(),
    issues: z.array(
      z.object({
        code: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      })
    ),
  }),
]);
export type ErrorType = z.infer<typeof errorSchema>;

export const objectIdSchema = z
  .union([z.string(), z.instanceof(Types.ObjectId)])
  .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid ObjectId" })
  .transform((val) => new Types.ObjectId(val))
  .openapi({ type: "string", format: "objectId" });

export const fileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    size: z.number().max(5 * 1024 * 1024), // 5MB
    buffer: z.instanceof(Buffer).openapi({ type: "string", format: "binary" }),
  } satisfies TSToZodObjectShape<
    Omit<Express.Multer.File, "destination" | "filename" | "path" | "stream">
  >)
  .openapi({ type: "string", format: "binary" });
export type FileType = z.infer<typeof fileSchema>;
