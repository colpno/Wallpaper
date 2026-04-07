import { FormControl, FormField, FormItem, FormMessage } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { type ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { GoEye, GoEyeClosed } from "react-icons/go";

import Dialog from "@/components/dialogs/Dialog";
import Button from "@/components/ui/Button";
import Input, { type InputProps } from "@/components/ui/Input";
import Typography from "@/components/ui/Typography";
import { calculatePasswordStrength } from "@/features/auth/utils/calculate-password-strength";

import Label from "../../Label";

type Props = {
  name: string;
  label?: React.ReactNode;
  showStrength?: boolean;
  labelHint?: string;
} & InputProps;

function PasswordField({ label, showStrength, labelHint, ...props }: Props) {
  const { control } = useFormContext();
  const [inputType, setInputType] = useState<"text" | "password">("password");
  const [hasTypedIn, setHasTypedIn] = useState(false);

  const handleEyeClick = (): void => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setHasTypedIn(true);
    props.onChange?.(e);
  };

  return (
    <FormField
      control={control}
      name={props.name}
      defaultValue={props.defaultValue ?? ""}
      disabled={props.disabled}
      render={({ field }) => {
        const passwordStrength = calculatePasswordStrength(field.value);

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
                addons={{
                  end: (
                    <Button
                      variant="ghost-icon"
                      onClick={handleEyeClick}
                      aria-label="Reveal password"
                      className="text-lg"
                    >
                      {inputType === "text" ? <GoEyeClosed /> : <GoEye />}
                    </Button>
                  ),
                }}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormMessage className="m-2" />

            {showStrength && (
              <>
                <div className="px-2 font-semibold text-gray-500">
                  {hasTypedIn && (
                    <>
                      <div
                        className={cn(
                          "relative mt-5 h-2 w-full rounded-full bg-gray-100 before:absolute before:left-0 before:h-full before:rounded-full before:transition-all before:duration-400 before:content-['']",
                          passwordStrength.label === "weak" && "before:w-1/8 before:bg-red-800",
                          passwordStrength.label === "medium" && "before:w-1/2 before:bg-blue-500",
                          passwordStrength.label === "strong" && "before:w-full before:bg-green-700"
                        )}
                      />

                      <Typography size="xs" className="mt-3 font-bold">
                        {passwordStrength.label === "weak"
                          ? "Make it more complicated"
                          : passwordStrength.label === "medium"
                            ? "Lookin' good"
                            : "Perfection!"}
                      </Typography>
                    </>
                  )}

                  <Typography size="xs" className="mt-1">
                    Use 8 or more letters, numbers and symbols
                  </Typography>
                </div>

                <Dialog
                  title="Password tips"
                  trigger={
                    <Button variant="ghost" size="sm" className="text-xs">
                      Password tips <AiOutlineExclamationCircle />
                    </Button>
                  }
                  slotProps={{
                    trigger: {
                      asChild: true,
                    },
                    contentContainer: {
                      className: cn("space-y-2 **:text-sm!"),
                    },
                  }}
                >
                  <Typography>
                    A strong password helps keep your account safe. Use at least 8 letters, numbers
                    and symbols.
                  </Typography>

                  <div>
                    <Typography className="font-bold">What to avoid</Typography>

                    <ul className="px-8 *:list-disc">
                      <li>Common passwords, words and names</li>
                      <li>Recent dates or dates associated with you</li>
                      <li>Simple patterns and repeated text</li>
                    </ul>
                  </div>
                </Dialog>
              </>
            )}
          </FormItem>
        );
      }}
    />
  );
}

export default PasswordField;
