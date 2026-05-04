import type { FocusEvent } from "react";

import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { useFormContext } from "react-hook-form";

import DatePicker, {
  type DatePickerProps,
  type DatePickerValue,
  type Mode,
} from "@/components/ui/DatePicker";
import { mergeRefs } from "@/utils/merge-ref";

import Label from "../../Label";

type Props<TMode extends Mode> = {
  name: string;
  label?: React.ReactNode;
  labelHint?: string;
} & Partial<DatePickerProps<TMode>>;

function DatePickerField<TMode extends Mode = "single">({
  label,
  required,
  name,
  labelHint,
  ...props
}: Props<TMode>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      disabled={!!props.disabled}
      defaultValue=""
      render={({ field }) => {
        const ref = props.ref ? mergeRefs(field.ref, props.ref) : field.ref;

        const handleInputChange = (date: DatePickerValue<TMode>): void => {
          field.onChange(date);
          props.onChange?.(date);
        };

        const handleInputBlur = (e: FocusEvent<HTMLInputElement, Element>): void => {
          field.onBlur();
          props.onBlur?.(e);
        };

        return (
          <FormItem className="block! space-y-1.5">
            {!!label && (
              <Label hint={labelHint} className="m-2 font-normal">
                {label}
              </Label>
            )}

            <FormControl>
              <DatePicker
                {...props}
                {...field}
                calendarProps={{
                  showOutsideDays: true,
                  ...props.calendarProps,
                }}
                ref={ref}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required={required}
              />
            </FormControl>

            <FormMessage className="m-2" />
          </FormItem>
        );
      }}
    />
  );
}

export default DatePickerField;
