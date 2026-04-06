import type { FormProps } from "./Form.types";

import { zodResolver } from "@hookform/resolvers/zod";
import { Form as UIForm } from "@repo/ui/components";
import { type DefaultValues, type FieldValues, type SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/ui/Button";

function Form<TFormData extends FieldValues>({
  children,
  schema,
  onSubmit,
  defaultValues,
  showButtons = true,
  slotProps,
  ...props
}: FormProps<TFormData>) {
  const methods = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<TFormData>,
  });

  const submitHandler: SubmitHandler<TFormData> = async (data) => {
    await onSubmit(data);
  };

  return (
    <UIForm {...methods}>
      <form {...props} onSubmit={methods.handleSubmit(submitHandler)}>
        {typeof children === "function" ? children(methods) : children}

        {showButtons && (
          <Button type="submit" {...slotProps?.submitButton}>
            {slotProps?.submitButton?.children ?? "Submit"}
          </Button>
        )}
      </form>
    </UIForm>
  );
}

export default Form;
