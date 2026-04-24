import { FormControl, FormField, FormItem, FormMessage, Textarea } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useFormContext } from "react-hook-form";

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
  };
} & React.ComponentProps<typeof Textarea>;

function TextareaField({ label, slotProps, labelHint, ...props }: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={props.defaultValue ?? ""}
      disabled={props.disabled}
      render={({ field }) => {
        const ref = props.ref ? mergeRefs(field.ref, props.ref) : field.ref;

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
              <Textarea
                {...props}
                {...field}
                ref={ref}
                className={cn(
                  "rounded-2xl border-gray-400 px-4 py-1.25 text-base! focus-within:ring-1! focus-within:ring-blue-500!",
                  "disabled:cursor-default disabled:border-gray-300 disabled:bg-secondary disabled:opacity-100 disabled:placeholder:text-gray-400",
                  props.className
                )}
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

export default TextareaField;
