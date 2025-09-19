import z from "~/configs/zod.config";

const errorSchema = z.object({
  success: z.boolean(),
  error: z.object({
    name: z.string(),
    issues: z.array(
      z.object({
        code: z.string(),
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      })
    ),
  }),
});

export type ErrorType = z.infer<typeof errorSchema>;

export default function createErrorSchema<T extends z.ZodType>(schema: T) {
  const { error } = schema.safeParse(
    // Mock data that will trigger a validation error
    schema.def.type === "array"
      ? [
          (schema as unknown as z.ZodArray<z.ZodType>).element.def.type === "string"
            ? 123
            : "invalid",
        ]
      : {}
  );

  const errorExample: z.infer<typeof errorSchema>["error"] = error
    ? {
        name: error.name,
        issues: error.issues.map((issue: z.ZodError["issues"][number]) => ({
          code: issue.code as string,
          path: issue.path as (string | number)[],
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };

  return errorSchema.openapi({
    example: {
      success: false,
      error: errorExample,
    },
  });
}
