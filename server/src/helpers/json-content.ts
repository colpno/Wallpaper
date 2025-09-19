import { ResponseConfig, ZodMediaTypeObject } from "@asteasolutions/zod-to-openapi";

import z from "~/configs/zod.config";

type JsonContentReturn<T extends z.ZodType> = {
  content: {
    "application/json": Omit<ZodMediaTypeObject, "schema"> & {
      schema: T;
    };
  };
};

type JsonContentReturnWithDescription<T extends z.ZodType> = JsonContentReturn<T> &
  Pick<ResponseConfig, "description">;

export default function jsonContent<T extends z.ZodType>(schema: T): JsonContentReturn<T>;

export default function jsonContent<T extends z.ZodType>(
  schema: T,
  description: string
): JsonContentReturnWithDescription<T>;

export default function jsonContent<T extends z.ZodType>(schema: T, description?: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}
