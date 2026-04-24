import z from "zod";

export const pinCreationSchema = z.object({
  photo: z.instanceof(FileList),
  title: z.string().optional(),
  description: z.string().optional(),
});
export type PinCreationFormData = z.infer<typeof pinCreationSchema>;
