import z from "~/configs/zod.config";

export default function createMessageObjectSchema(defaultMessage: string) {
  const schema = z.object({
    message: z.string(),
  });

  const example: z.infer<typeof schema> = {
    message: defaultMessage,
  };

  return schema.openapi({
    example,
  });
}
