import { z } from "zod";

export const httpErrorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
});
export type HttpError = z.infer<typeof httpErrorSchema>;

export const httpValidationErrorSchema = z.array(
  z.object({
    path: z.string(),
    message: z.string(),
  })
);
export type HttpValidationError = z.infer<typeof httpValidationErrorSchema>;
