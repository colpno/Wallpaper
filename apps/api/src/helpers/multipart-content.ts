import type { ResponseConfig } from "@asteasolutions/zod-to-openapi";
import type { ReferenceObject, SchemaObject } from "@asteasolutions/zod-to-openapi/dist/types";

import z from "@/lib/zod";

type Schema = z.ZodType | SchemaObject | ReferenceObject;

type MultipartContentReturn<T extends Schema> = {
  content: {
    "multipart/form-data": {
      schema: T;
    };
  };
};

type MultipartContentReturnWithDescription<T extends Schema> = MultipartContentReturn<T> &
  Pick<ResponseConfig, "description">;

export default function multipartContent<T extends Schema>(schema: T): MultipartContentReturn<T>;

export default function multipartContent<T extends Schema>(
  schema: T,
  description: string
): MultipartContentReturnWithDescription<T>;

/**
 * Helper function for shortening the syntax
 * for defining multipart/form-data content in OpenAPI specs.
 * @param schema Zod schema to be used for the content.
 * @param description Optional description for the content.
 */
export default function multipartContent<T extends Schema>(schema: T, description?: string) {
  return {
    content: {
      "multipart/form-data": {
        schema,
      },
    },
    description,
  };
}
