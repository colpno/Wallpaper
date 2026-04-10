import type { ValidationError } from "./schemas.js";
import type { ZodError } from "zod";

import type { PaginationPayload } from "@repo/types";

/**
 * Converts an OpenAPI path to Express path.
 * @param path An OpenAPI path.
 * @param replacer A callback for replacer if provided.
 * @returns An Express path.
 */
export const openApiToExpressPath = (
  path: string,
  replacer?: (match: string, ...slugNames: string[]) => string
): string => {
  return path.replace(
    /{(.*?)}/g,
    (match, ...groups) => replacer?.(match, ...groups) ?? `:${groups[0]}`
  );
};

/**
 * Convert Multer file to Base64 string.
 * @param file Multer file object.
 * @returns Base64 string.
 */
export const fileToBase64 = (file: Pick<Express.Multer.File, "buffer" | "mimetype">): string => {
  const content = Buffer.from(file.buffer).toString("base64");
  return "data:" + file.mimetype + ";base64," + content;
};

/**
 * Create a structured error object from a ZodError instance.
 * @param error ZodError object.
 * @returns Structured error object or null if no error is provided.
 */
export const createErrorObjectFromZod = <T>(error: ZodError<T>): ValidationError => {
  return error.issues.map((issue) => ({
    path: issue.path.filter((p) => typeof p !== "symbol").join("."),
    message: issue.message,
  }));
};

type ToPaginationPayloadInput<T extends unknown[]> = {
  data: T;
  page: number;
  perPage: number;
  totalItems: number;
};

/**
 * Create pagination payload from provided inputs.
 * @param inputs Requirements to construct pagination payload.
 * @returns Pagination payload object.
 */
export const toPaginationPayload = <T extends unknown[]>(
  inputs: ToPaginationPayloadInput<T>
): PaginationPayload<T> => {
  const { data, page = 1, perPage, totalItems } = inputs;
  return {
    data,
    meta: {
      currentPage: page,
      itemCount: data.length,
      itemsPerPage: perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
    },
  };
};
