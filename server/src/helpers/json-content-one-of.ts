import {
  OpenApiGeneratorV31,
  OpenAPIRegistry,
  ResponseConfig,
  ZodMediaTypeObject,
} from "@asteasolutions/zod-to-openapi";
import { ReferenceObject, SchemaObject } from "@asteasolutions/zod-to-openapi/dist/types";

import z from "~/configs/zod.config";

type JsonContentReturn<T extends z.ZodType> = {
  content: {
    "application/json": Omit<ZodMediaTypeObject, "schema"> & {
      schema: T | SchemaObject | ReferenceObject;
    };
  };
};

type JsonContentReturnWithDescription<T extends z.ZodType> = JsonContentReturn<T> &
  Pick<ResponseConfig, "description">;

export default function jsonContentOneOf<T extends z.ZodSchema>(schemas: T[]): JsonContentReturn<T>;

export default function jsonContentOneOf<T extends z.ZodSchema>(
  schemas: T[],
  description: string
): JsonContentReturnWithDescription<T>;

/**
 * Generates an OpenAPI response definition with a oneOf schema for the provided Zod schemas.
 * @param schemas Array of Zod schemas to be used in the oneOf.
 * @param description Optional description for the response.
 * @returns OpenApi response definition with oneOf schema.
 */
export default function jsonContentOneOf<T extends z.ZodSchema>(
  schemas: T[],
  description?: string
) {
  const oneOf = () => {
    const registry = new OpenAPIRegistry();

    schemas.forEach((schema, index) => {
      registry.register(index.toString(), schema);
    });

    const generator = new OpenApiGeneratorV31(registry.definitions);
    const components = generator.generateComponents();

    return components.components?.schemas ? Object.values(components.components!.schemas!) : [];
  };

  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(),
        },
      },
    },
    description,
  };
}
