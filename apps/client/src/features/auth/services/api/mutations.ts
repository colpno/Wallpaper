import { mutationOptions } from "@tanstack/react-query";

import { login, register } from "./apis";

export const loginMutationOptions = () =>
  mutationOptions({
    mutationFn: login,
  });

export const registerMutationOptions = () =>
  mutationOptions({
    mutationFn: register,
  });
