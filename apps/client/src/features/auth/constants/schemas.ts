import type { AuthAPIs } from "@repo/types";
import z, { ZodType } from "zod";

export const signupFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must have at least 6 characters"),
  birthdate: z.date("Invalid date"),
}) satisfies ZodType<
  Omit<AuthAPIs.Register["body"], "birthdate"> & {
    birthdate: Date;
  }
>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
