import { z } from "zod";

const schema = z.object({
  VITE_API_URL: z.url(),
});

const { error, data } = schema.safeParse(import.meta.env);

if (error) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(error)}`);
}

export const env = data!;
