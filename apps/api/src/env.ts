import { config } from "dotenv";

import z from "./lib/zod";

config({
  quiet: true,
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z
  .object({
    ENVIRONMENT: z.enum(["production", "development", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    BASE_ENDPOINT: z.string().default("/api"),
    LOG_LEVEL: z
      .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
      .default("info"),
    RATE_LIMIT_TIME: z.coerce.number().default(30 * 1000), // 30 seconds
    RATE_LIMIT_MAX: z.coerce.number().default(60),
    CORS_ORIGINS: z
      .string()
      .transform((val) => val.split(","))
      .optional(),
    MONGODB_URI: z.string().optional(),
    CLOUDINARY_FOLDER: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.ENVIRONMENT !== "test") {
      const requiredKeys = [
        "CORS_ORIGINS",
        "MONGODB_URI",
        "CLOUDINARY_FOLDER",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
      ] as const;

      for (const key of requiredKeys) {
        if (!env[key as keyof typeof env]) {
          ctx.addIssue({
            code: "invalid_type",
            expected: key === "CORS_ORIGINS" ? "array" : "string",
            message: `${key} is required in ${env.ENVIRONMENT} environment`,
            path: [key],
          });
        }
      }
    }
  });

let env: z.infer<typeof envSchema>;

try {
  const noEmptyProcessEnv = Object.fromEntries(
    Object.entries(process.env).filter(([, value]) => value !== "")
  );
  env = envSchema.parse(noEmptyProcessEnv);
} catch (e) {
  const error = e as z.ZodError;
  console.log("❌ Invalid environment variables:");
  console.error(z.prettifyError(error));
  process.exit(1);
}

export default env;
