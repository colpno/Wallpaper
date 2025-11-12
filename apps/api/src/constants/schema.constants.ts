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
