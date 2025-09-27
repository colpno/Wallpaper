import type { ErrorType } from "@/constants/schema.constants";
import type z from "@/lib/zod";

/**
 * Create a structured error object from a ZodError instance.
 * @param error ZodError object.
 * @returns Structured error object or null if no error is provided.
 */

export default function createErrorObjectFromZod<T extends unknown>(error?: z.ZodError<T>) {
  if (!error) return null;

  const errorObj: ErrorType = {
    name: error.name,
    issues: error.issues.map((issue) => ({
      code: issue.code,
      path: issue.path.filter((p) => typeof p !== "symbol"),
      message: issue.message,
    })),
  };

  return errorObj;
}
