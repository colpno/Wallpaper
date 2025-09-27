import { HttpStatusPhrases } from "@wallpaper/shared";
import { Types } from "mongoose";

import { createMessageObjectSchema } from "@/helpers";
import z from "@/lib/zod";

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
