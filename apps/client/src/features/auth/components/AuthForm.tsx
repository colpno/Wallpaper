import { useState } from "react";

import { AuthFormContext, type AuthFormContextState } from "../contexts/auth-form-context";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type LoginFormProps = React.ComponentProps<typeof LoginForm>;
type RegisterFormProps = React.ComponentProps<typeof RegisterForm>;

type Props<TForm extends AuthFormContextState["form"]> = {
  /**
   * @default
   * "register"
   */
  defaultForm?: TForm;
} & (TForm extends "login" ? LoginFormProps : RegisterFormProps);

function AuthForm<TForm extends AuthFormContextState["form"]>({
  defaultForm = "register" as TForm,
  ...props
}: Props<TForm>) {
  const [form, setForm] = useState<AuthFormContextState["form"]>(defaultForm);
  const contextState: AuthFormContextState = {
    form,
    setForm,
  };

  return (
    <AuthFormContext value={contextState}>
      {contextState.form === "login" ? (
        <LoginForm {...(props as LoginFormProps)} />
      ) : (
        <RegisterForm {...(props as RegisterFormProps)} />
      )}
    </AuthFormContext>
  );
}

export default AuthForm;
