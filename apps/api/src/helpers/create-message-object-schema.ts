import z from "@/lib/zod";

/**
 * Creates a Zod schema for message only.
 * @param message The message to be used in the schema example.
 * @returns A Zod schema for message objects with an example.
 */
export default function createMessageObjectSchema(message?: string) {
  const schema = z.object({
    message: z.string(),
  });

  const example: z.infer<typeof schema> | undefined = message ? { message } : undefined;

  return schema.openapi({ example });
}
