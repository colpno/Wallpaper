import type { AuthAPIs } from "@repo/types";
import z, { ZodType } from "zod";

export const signupFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  birthdate: z.date(),
}) satisfies ZodType<
  Omit<AuthAPIs.Register["body"], "birthdate"> & {
    birthdate: Date;
  }
>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
