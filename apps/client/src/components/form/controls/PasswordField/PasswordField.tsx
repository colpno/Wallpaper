import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { type ChangeEvent, type FocusEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { GoEye, GoEyeClosed } from "react-icons/go";

import Button from "@/components/ui/Button";
import Input, { type InputProps } from "@/components/ui/Input";
import { mergeRefs } from "@/utils/merge-ref";

import Label from "../../Label";
import PasswordStrengthGuide from "./components/PasswordStrengthGuide";

type Props = {
  name: string;
  label?: React.ReactNode;
  showStrength?: boolean;
  labelHint?: string;
} & InputProps;

function PasswordField({ label, showStrength, labelHint, ...props }: Props) {
  const { control } = useFormContext();
  const [inputType, setInputType] = useState<"text" | "password">("password");
  const [isTouched, setIsTouched] = useState(false);

  const handleEyeClick = (): void => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={props.defaultValue ?? ""}
      disabled={props.disabled}
      render={({ field }) => {
        const ref = props.ref ? mergeRefs(field.ref, props.ref) : field.ref;

        const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
          setIsTouched(true);
          field.onChange(e);
          props.onChange?.(e);
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
              <Input
                {...props}
                {...field}
                type={inputType}
                ref={ref}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                addons={{
                  end: (
                    <Button
                      variant="ghost"
                      size="icon-md"
                      onClick={handleEyeClick}
                      aria-label="Reveal password"
                      className="text-lg"
                    >
                      {inputType === "text" ? <GoEyeClosed /> : <GoEye />}
                    </Button>
                  ),
                }}
              />
            </FormControl>

            <FormMessage className="m-2" />

            {showStrength && <PasswordStrengthGuide value={field.value} isTouched={isTouched} />}
          </FormItem>
        );
      }}
    />
  );
}

export default PasswordField;
