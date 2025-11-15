import type { ValidationError } from "@/constants/schema.constants";
import type z from "@/lib/zod";

import logger from "@/lib/logger";

/**
 * Create a structured error object from a ZodError instance.
 * @param error ZodError object.
 * @returns Structured error object or null if no error is provided.
 */
export default function createErrorObjectFromZod<T>(error: z.ZodError<T>) {
  logger.error(
    `Missing path due to symbol type: ${JSON.stringify(error.issues.filter((issue) => issue.path.some((p) => typeof p === "symbol")))}`
  );

  const errorObj: ValidationError[number] = {
    name: error.name,
    issues: error.issues.map((issue) => ({
      code: issue.code,
      path: issue.path.filter((p) => typeof p !== "symbol"),
      message: issue.message,
    })),
  };

  return errorObj;
}
