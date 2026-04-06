import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { useFormContext } from "react-hook-form";

import DatePicker, { type DatePickerProps } from "../../../ui/DatePicker";
import Label from "../../Label";

type Props = {
  name: string;
  label?: React.ReactNode;
  labelHint?: string;
} & Omit<DatePickerProps, "value" | "onChange">;

function DatePickerField({ label, required, name, labelHint, ...props }: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      disabled={!!props.disabled}
      defaultValue=""
      render={({ field }) => (
        <FormItem className="block! space-y-1.5">
          {!!label && (
            <Label hint={labelHint} className="ml-2 font-normal">
              {label}
            </Label>
          )}

          <FormControl>
            <DatePicker {...props} {...field} required={required} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default DatePickerField;
