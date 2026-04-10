import type { ChangeEvent, FocusEvent } from "react";

import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useFormContext } from "react-hook-form";

import Input, { type InputProps } from "@/components/ui/Input";
import { mergeRefs } from "@/utils/merge-ref";

import Label from "../../Label";

type Props = {
  name: string;
  label?: React.ReactNode;
  labelHint?: string;
  slotProps?: {
    fieldContainer?: React.ComponentProps<typeof FormItem>;
    fieldLabel?: React.ComponentProps<typeof Label>;
    fieldMessage?: React.ComponentProps<typeof FormMessage>;
    inputContainer?: NonNullable<InputProps["slotProps"]>["container"];
  } & Omit<NonNullable<InputProps["slotProps"]>, "container">;
} & Omit<InputProps, "slotProps">;

function TextField({ label, labelHint, slotProps, ...props }: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={props.defaultValue ?? ""}
      disabled={props.disabled}
      render={({ field }) => {
        const ref = props.ref ? mergeRefs(field.ref, props.ref) : field.ref;

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
          field.onChange(e);
          props.onChange?.(e);
        };

        const handleInputBlur = (e: FocusEvent<HTMLInputElement, Element>): void => {
          field.onBlur();
          props.onBlur?.(e);
        };

        return (
          <FormItem
            {...slotProps?.fieldContainer}
            className={cn("block! space-y-1.5", slotProps?.fieldContainer?.className)}
          >
            {!!label && (
              <Label
                {...slotProps?.fieldLabel}
                hint={labelHint}
                className={cn("m-2 font-normal", slotProps?.fieldLabel?.className)}
              >
                {label}
              </Label>
            )}

            <FormControl>
              <Input
                {...props}
                {...field}
                ref={ref}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                slotProps={{
                  ...slotProps,
                  container: slotProps?.inputContainer,
                }}
              />
            </FormControl>

            <FormMessage
              {...slotProps?.fieldMessage}
              className={cn("m-2", slotProps?.fieldMessage?.className)}
            />
          </FormItem>
        );
      }}
    />
  );
}

export default TextField;
