import { Types } from "mongoose";

import z from "@/lib/zod";

export const errorSchema = z.union([
  z.object({
    message: z.string(),
    stack: z
      .string()
      .optional()
      .openapi({ description: "Available only in non-production environments" }),
  }),
]);
export type ErrorType = z.infer<typeof errorSchema>;

export const objectIdSchema = z
  .union([z.string(), z.instanceof(Types.ObjectId)])
  .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid ObjectId" })
  .transform((val) => val.toString())
  .openapi({ type: "string", format: "string" });
