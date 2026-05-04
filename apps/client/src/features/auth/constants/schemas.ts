import type { AuthAPIs } from "@repo/types";
import { addYears } from "date-fns";
import z, { ZodType } from "zod";

export const registerFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  birthdate: z
    .date("Invalid date")
    .max(addYears(new Date(), -6), "You must be at least 6-year-old"),
}) satisfies ZodType<
  Omit<AuthAPIs.Register["body"], "birthdate" | "username"> & {
    birthdate: Date;
  }
>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = registerFormSchema.pick({
  email: true,
  password: true,
}) satisfies ZodType<AuthAPIs.Login["body"]>;
export type LoginFormData = z.infer<typeof loginFormSchema>;
