import type { ZodObjectShapeMap } from "@/types/common.types";
import type { User } from "@/types/model.types";

import { HttpStatusPhrases } from "@repo/shared";
import { type ObjectIdToString, Types } from "mongoose";

import createMessageObjectSchema from "@/helpers/create-message-object-schema";
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

export const userSchema = z
  .object({
    _id: objectIdSchema,
    __v: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    email: z.email(),
    username: z.string(),
    password: z.string().min(6),
    salt: z.string(),
    avatarUrl: z.string().optional(),
    avatarCloudinaryId: z.string().optional(),
  } satisfies ZodObjectShapeMap<ObjectIdToString<User>>)
  .openapi("User");
