import { useMutation } from '@tanstack/react-query';

import AuthService from './service.ts';

export const useLogin = () => {
  return useMutation({
    mutationFn: AuthService.login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: AuthService.logout,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: AuthService.register,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: AuthService.refresh,
  });
};
