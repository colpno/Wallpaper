import type { ResponseConfig, ZodMediaTypeObject } from "@asteasolutions/zod-to-openapi";
import type { ReferenceObject, SchemaObject } from "@asteasolutions/zod-to-openapi/dist/types";

import z from "@/lib/zod";

type Schema = z.ZodType | SchemaObject | ReferenceObject;

type JsonContentReturn<T extends Schema> = {
  content: {
    "application/json": Omit<ZodMediaTypeObject, "schema"> & {
      schema: T;
    };
  };
};

type JsonContentReturnWithDescription<T extends Schema> = JsonContentReturn<T> &
  Pick<ResponseConfig, "description">;

export default function jsonContent<T extends Schema>(schema: T): JsonContentReturn<T>;

export default function jsonContent<T extends Schema>(
  schema: T,
  description: string
): JsonContentReturnWithDescription<T>;

/**
 * Helper function for shortening the syntax
 * for defining JSON content in OpenAPI specs.
 * @param schema Zod schema to be used for the content.
 * @param description Optional description for the content.
 */

export default function jsonContent<T extends Schema>(schema: T, description?: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}
