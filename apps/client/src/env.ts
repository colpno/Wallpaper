import { z } from "zod";

const schema = z.object({
  API_URL: z.url(),
});

let env: z.infer<typeof schema>;

try {
  const noEmptyProcessEnv = Object.fromEntries(
    Object.entries(import.meta.env).filter(([, value]) => value !== "")
  );
  env = {
    ...import.meta.env,
    ...schema.parse(noEmptyProcessEnv),
  };
} catch (e) {
  console.error("❌ Invalid environment variables:", e);
  throw e;
}

export default env as typeof env & ImportMetaEnv;
