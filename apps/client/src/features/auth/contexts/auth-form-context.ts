import { createContext, type Dispatch, type SetStateAction, useContext } from "react";

export type AuthFormContextState = {
  form: "login" | "register";
  setForm: Dispatch<SetStateAction<AuthFormContextState["form"]>>;
};

export const AuthFormContext = createContext<AuthFormContextState>({
  form: "login",
  setForm: (newType) => newType,
});

export const useAuthFormContext = () => {
  const context = useContext(AuthFormContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthContext");
  }

  return context;
};
