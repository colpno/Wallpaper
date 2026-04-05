import type { ResponseConfig, ZodMediaTypeObject } from "@asteasolutions/zod-to-openapi";
import type { ReferenceObject, SchemaObject } from "@asteasolutions/zod-to-openapi/dist/types.js";

import z from "@/lib/zod.js";

type Schema = z.ZodType | SchemaObject | ReferenceObject;

type JsonContentReturn<T extends Schema> = {
  content: {
    "application/json": Omit<ZodMediaTypeObject, "schema"> & {
      schema: T;
    };
  };
};

/**
 * Helper function for shortening the syntax
 * for defining JSON content in OpenAPI specs.
 * @param schema Zod schema to be used for the content.
 * @param description Optional description for the content.
 */
export function jsonContent<T extends Schema>(schema: T): JsonContentReturn<T>;
export function jsonContent<T extends Schema>(
  schema: T,
  description: string
): JsonContentReturn<T> & Pick<ResponseConfig, "description">;
export function jsonContent<T extends Schema>(schema: T, description?: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

type MultipartContentReturn<T extends Schema> = {
  content: {
    "multipart/form-data": {
      schema: T;
    };
  };
};

/**
 * Helper function for shortening the syntax
 * for defining multipart/form-data content in OpenAPI specs.
 * @param schema Zod schema to be used for the content.
 * @param description Optional description for the content.
 */
export function multipartContent<T extends Schema>(schema: T): MultipartContentReturn<T>;
export function multipartContent<T extends Schema>(
  schema: T,
  description: string
): MultipartContentReturn<T> & Pick<ResponseConfig, "description">;
export function multipartContent<T extends Schema>(schema: T, description?: string) {
  return {
    content: {
      "multipart/form-data": {
        schema,
      },
    },
    description,
  };
}
