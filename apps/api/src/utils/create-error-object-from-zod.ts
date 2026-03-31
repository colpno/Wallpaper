import type { ValidationError } from "./schemas.js";
import type { ZodError } from "zod";

/**
 * Create a structured error object from a ZodError instance.
 * @param error ZodError object.
 * @returns Structured error object or null if no error is provided.
 */
export default function createErrorObjectFromZod<T>(error: ZodError<T>) {
  const errorObj: ValidationError[number] = {
    name: error.name,
    issues: error.issues.map((issue) => ({
      code: issue.code,
      path: issue.path.filter((p) => typeof p !== "symbol").map((p) => p.toString()),
      message: issue.message,
    })),
  };

  return errorObj;
}
