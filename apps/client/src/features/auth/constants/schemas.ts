import type { AuthAPIs } from "@repo/types";
import { isDate } from "date-fns";
import z, { ZodType } from "zod";

export const signupFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  birthdate: z.string().nonempty().refine(isDate),
}) satisfies ZodType<AuthAPIs.Register["body"]>;
export type SignupFormData = z.infer<typeof signupFormSchema>;
