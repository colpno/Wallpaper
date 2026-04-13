import type { FormProps } from "@/components/form/Form";

import { cn } from "@repo/ui/lib";
import { useMutation } from "@tanstack/react-query";

import DatePickerField from "@/components/form/controls/DatePickerField";
import PasswordField from "@/components/form/controls/PasswordField";
import TextField from "@/components/form/controls/TextField";
import Form from "@/components/form/Form";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";

import { type RegisterFormData, registerFormSchema } from "../../constants/schemas";
import { useAuthFormContext } from "../../contexts/auth-form-context";
import { registerMutationOptions } from "../../services/api/mutations";

type Props = {
  slotProps?: FormProps<RegisterFormData>["slotProps"] & {
    form?: Omit<FormProps<RegisterFormData>, "schema" | "children" | "showButtons" | "slotProps">;
  };
} & React.ComponentProps<"div">;

function RegisterForm({ slotProps, ...props }: Props) {
  const { setForm } = useAuthFormContext();
  const { mutateAsync } = useMutation(registerMutationOptions());

  const handleSubmit = async (formData: RegisterFormData) => {
    await mutateAsync({
      ...formData,
      birthdate: formData.birthdate.toISOString(),
    });
  };

  return (
    <div
      className={cn(
        "min-h-100 w-112.5 overflow-clip rounded-4xl bg-background px-2.5 py-8",
        props.className
      )}
    >
      <Heading variant="h1" className="text-center text-[26px]">
        Welcome to Pinterest
      </Heading>

      <Typography className="mb-5.5 text-center">Find new ideas to try</Typography>

      <div className="mx-auto w-67">
        <Form
          {...slotProps?.form}
          slotProps={slotProps}
          onSubmit={handleSubmit}
          schema={registerFormSchema}
          showButtons={false}
          className={cn("space-y-2.5", slotProps?.form?.className)}
        >
          <TextField name="email" label="Email" placeholder="Email" aria-label="Email field" />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Create a password"
            showStrength
            aria-label="Password field"
          />

          <DatePickerField
            name="birthdate"
            label="Birthdate"
            placeholder="mm/dd/yyyy"
            labelHint="To help keep Pinterest safe, we now require your birthdate. Your birthdate also helps us provide more personalized recommendations and relevant ads. We won't share this information without your permission and it won't be visible on your profile."
            aria-label="Birthdate field"
          />

          <Button type="submit" size="sm" className="w-full" aria-label="Submit button">
            Continue
          </Button>
        </Form>

        <Typography size="xs" className="mt-2 px-4 text-center font-extralight">
          By continuing, you agree to Pinterest&apos;s{" "}
          <Link to="#" className="underline">
            Terms of Service
          </Link>{" "}
          and acknowledge you&apos;ve read our
          <Link to="#" className="underline">
            Privacy Policy
          </Link>
          .{" "}
          <Link to="#" className="underline">
            Notice at collection
          </Link>
          .
        </Typography>

        <Typography size="xs" className="mt-3 text-center">
          Already a member?{" "}
          <button
            type="button"
            onClick={() => setForm("login")}
            className="inline cursor-pointer text-xs font-bold"
          >
            Login
          </button>
        </Typography>
      </div>
    </div>
  );
}

export default RegisterForm;
