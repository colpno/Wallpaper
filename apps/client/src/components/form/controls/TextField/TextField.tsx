import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { useFormContext } from "react-hook-form";

import Input, { type InputProps } from "@/components/ui/Input";

import Label from "../../Label";

type Props = InputProps & {
  name: string;
  label?: React.ReactNode;
  labelHint?: string;
};

function TextField({ label, labelHint, ...props }: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={props.defaultValue ?? ""}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem className="block! space-y-1.5">
          {!!label && (
            <Label hint={labelHint} className="ml-2 font-normal">
              {label}
            </Label>
          )}

          <FormControl>
            <Input {...props} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default TextField;
