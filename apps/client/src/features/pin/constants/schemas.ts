import z from "zod";

export const pinCreationSchema = z.object({
  id: z.string(),
  photo: z.instanceof(FileList),
  title: z.string().optional(),
  description: z.string().optional(),
});
export type PinCreationFormData = z.infer<typeof pinCreationSchema>;
