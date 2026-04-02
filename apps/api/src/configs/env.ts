import type { Level } from "@repo/logger";
import type { Environment } from "@repo/types";
import { config } from "dotenv";

import z from "@/lib/zod.js";

config({
  quiet: true,
  path: process.env["NODE_ENV"] === "test" ? ".env.test" : ".env",
});

const stringSchema = <T extends string>(defaultValue: T) =>
  z.string().transform((val) => (val ? val : defaultValue));

const enumSchema = <T extends string>(options: T[], defaultValue: T) =>
  stringSchema(defaultValue).refine((val) => options.some((e) => e === val));

const numberSchema = <T extends number>(defaultValue: T) =>
  z.coerce.number().transform((val) => (val ? val : defaultValue));

const schema = z.object({
  ENVIRONMENT: enumSchema<Environment>(["production", "development", "test"], "development"),
  PORT: numberSchema(3000),
  BASE_ENDPOINT: stringSchema("/api"),
  LOG_LEVEL: enumSchema<Level>(["fatal", "error", "warn", "info", "debug", "trace"], "info"),
  RATE_LIMIT_TIME: numberSchema(30 * 1000), // 30 seconds
  RATE_LIMIT_MAX: numberSchema(60),
  CORS_ORIGINS: z.string().transform((val) => val.split(",")),
  MONGODB_URI: z.string(),
  CLOUDINARY_FOLDER: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  HUGGING_FACE_TOKEN: z.string(),
});

const { error, data: env, success } = schema.safeParse(process.env);

if (!success) {
  console.error(z.prettifyError(error));
  process.exit(1);
}

export default env!;
