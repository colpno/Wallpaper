import AuthService from './service.ts';

export interface LoginReqBody {
  email: string;
  password: string;
}

export interface RegisterReqBody extends LoginReqBody {
  phone: string;
}

export interface RefreshTokenReqReturn {
  accessToken: string;
}

type ServiceMethodArgs<T> = T extends (...args: infer A) => Promise<unknown> ? A : never;

export type AuthServiceLoginArgs = ServiceMethodArgs<typeof AuthService.login>;

export type AuthServiceRegisterArgs = ServiceMethodArgs<typeof AuthService.register>;
