import { Types } from "@wallpaper/shared";
import { config } from "dotenv";

import type { LogLevel } from "@/types";

import z from "./zod";

config({
  quiet: true,
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z.object({
  NODE_ENV: z
    .enum<Types.Environment[]>(["production", "development", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  BASE_ENDPOINT: z.string().default("/api"),
  CORS_ORIGINS: z.string().transform((val) => val.split(",")),
  MONGODB_URI: z.string(),
  LOGIN_KEY: z.string(),
  LOG_LEVEL: z
    .enum<LogLevel[]>(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),
  CLOUDINARY_FOLDER: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

let env: z.infer<typeof envSchema>;

try {
  const filteredProcessEnv = Object.fromEntries(
    Object.entries(process.env).filter(([_, value]) => value !== "")
  );
  env = envSchema.parse(filteredProcessEnv);
} catch (e) {
  const error = e as z.ZodError;
  console.log("❌ Invalid environment variables:");
  console.error(z.prettifyError(error));
  process.exit(1);
}

export default env;
