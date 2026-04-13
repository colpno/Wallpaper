import type { FormProps } from "@/components/form/Form";

import { cn } from "@repo/ui/lib";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { useStore } from "@/app/stores/useStore";
import PasswordField from "@/components/form/controls/PasswordField";
import TextField from "@/components/form/controls/TextField";
import Form from "@/components/form/Form";
import Button from "@/components/ui/Button";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";

import { type LoginFormData, loginFormSchema } from "../../constants/schemas";
import { useAuthFormContext } from "../../contexts/auth-form-context";
import { loginMutationOptions } from "../../services/api/mutations";

type Props = {
  slotProps?: FormProps<LoginFormData>["slotProps"] & {
    form?: Omit<FormProps<LoginFormData>, "schema" | "children" | "showButtons" | "slotProps">;
  };
} & React.ComponentProps<"div">;

function LoginForm({ slotProps, ...props }: Props) {
  const { setForm } = useAuthFormContext();
  const { mutateAsync } = useMutation(loginMutationOptions());
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const handleSubmit = async (formData: LoginFormData) => {
    const user = await mutateAsync(formData);
    login(user);
    navigate(ROUTES.HOME());
  };

  return (
    <div
      className={cn(
        "min-h-100 w-112.5 overflow-clip rounded-4xl bg-background px-2.5 py-8",
        props.className
      )}
    >
      <Heading variant="h1" className="mb-5.5 text-center text-[26px]">
        Welcome to Pinterest
      </Heading>

      <div className="mx-auto w-67">
        <Form
          {...slotProps?.form}
          slotProps={slotProps}
          onSubmit={handleSubmit}
          schema={loginFormSchema}
          showButtons={false}
          className={cn("space-y-2.5", slotProps?.form?.className)}
        >
          <TextField name="email" label="Email" placeholder="Email" aria-label="Email field" />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Password"
            aria-label="Password field"
          />

          <Button type="submit" size="sm" className="w-full" aria-label="Submit button">
            Log in
          </Button>
        </Form>

        <button
          type="button"
          onClick={() => setForm("register")}
          className="mx-auto mt-3 flex cursor-pointer text-xs font-bold"
        >
          Not on Pinterest yet? Sign up
        </button>

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
      </div>
    </div>
  );
}

export default LoginForm;
