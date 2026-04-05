import type { ValidationError } from "./schemas.js";
import type { ZodError } from "zod";

/**
 * Converts an OpenAPI path to Express path.
 * @param path An OpenAPI path.
 * @param replacer A callback for replacer if provided.
 * @returns An Express path.
 */
export function openApiToExpressPath(
  path: string,
  replacer?: (match: string, ...slugNames: string[]) => string
): string {
  return path.replace(
    /{(.*?)}/g,
    (match, ...groups) => replacer?.(match, ...groups) ?? `:${groups[0]}`
  );
}

/**
 * Convert Multer file to Base64 string.
 * @param file Multer file object.
 * @returns Base64 string.
 */
export function fileToBase64(file: Pick<Express.Multer.File, "buffer" | "mimetype">): string {
  const content = Buffer.from(file.buffer).toString("base64");
  return "data:" + file.mimetype + ";base64," + content;
}

/**
 * Create a structured error object from a ZodError instance.
 * @param error ZodError object.
 * @returns Structured error object or null if no error is provided.
 */
export function createErrorObjectFromZod<T>(error: ZodError<T>): ValidationError[number] {
  return {
    name: error.name,
    issues: error.issues.map((issue) => ({
      code: issue.code,
      path: issue.path.filter((p) => typeof p !== "symbol").map((p) => p.toString()),
      message: issue.message,
    })),
  };
}
