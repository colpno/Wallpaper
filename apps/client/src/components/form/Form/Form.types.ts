import type { FieldValues, UseFormReturn } from "react-hook-form";

import { Button } from "@repo/ui/components";
import z from "zod";

export type FormProps<TFormData extends FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any, TFormData>;
  children: React.ReactNode | ((methods: UseFormReturn<TFormData>) => React.ReactNode);
  onSubmit: (data: TFormData) => void | Promise<void>;
  defaultValues?: TFormData;
  showButtons?: boolean;
  slotProps?: {
    submitButton?: React.ComponentProps<typeof Button>;
  };
} & Omit<React.ComponentProps<"form">, "children" | "onSubmit">;
