import type { FormProps } from "@/components/form/Form";
import type { FieldValues } from "react-hook-form";

import { cn } from "@repo/ui/lib";
import z from "zod";

import DatePickerField from "@/components/form/controls/DatePickerField";
import PasswordField from "@/components/form/controls/PasswordField";
import TextField from "@/components/form/controls/TextField";
import Form from "@/components/form/Form";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";

type Props<TFormData extends FieldValues> = React.ComponentProps<"div"> &
  Pick<FormProps<TFormData>, "onSubmit"> & {
    slotProps?: Pick<FormProps<TFormData>, "slotProps"> & {
      form?: Omit<FormProps<TFormData>, "schema" | "children" | "showButtons" | "slotProps">;
    };
  };

const schema = z.any();

function SignupForm<TFormData extends FieldValues>({
  onSubmit,
  slotProps,
  ...props
}: Props<TFormData>) {
  return (
    <div
      className={cn(
        "min-h-100 w-[450px] overflow-clip rounded-4xl bg-background px-2.5 py-8",
        props.className
      )}
    >
      <Heading variant="h1" className="px-4 text-center text-[26px]">
        Welcome to Pinterest
      </Heading>

      <Typography className="mb-5.5 px-4 text-center">Find new ideas to try</Typography>

      <div className="mx-auto w-[268px]">
        <Form
          {...slotProps?.form}
          onSubmit={onSubmit}
          schema={schema}
          showButtons={false}
          className={cn("space-y-2.5", slotProps?.form?.className)}
        >
          <TextField name="email" label="Email" />

          <PasswordField name="password" label="Password" showStrength />

          <DatePickerField
            name="birthdate"
            label="Birthdate"
            placeholder="mm / dd / yyyy"
            labelHint="To help keep Pinterest safe, we now require your birthdate. Your birthdate also helps us provide more personalized recommendations and relevant ads. We won't share this information without your permission and it won't be visible on your profile."
          />

          <Button type="submit" size="sm" className="w-full">
            Continue
          </Button>
        </Form>

        <Typography size="xs" className="mt-2 px-4 text-center font-extralight">
          By continuing, you agree to Pinterest&apos;s{" "}
          <Link href="#" className="underline">
            Terms of Service
          </Link>{" "}
          and acknowledge you&apos;ve read our
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
          .{" "}
          <Link href="#" className="underline">
            Notice at collection
          </Link>
          .
        </Typography>

        <Typography size="xs" className="mt-3 text-center">
          Already a member?{" "}
          <Typography as="span" size="xs" className="font-bold">
            Log in
          </Typography>
        </Typography>
      </div>
    </div>
  );
}

export default SignupForm;
