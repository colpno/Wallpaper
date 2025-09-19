import { REQUEST_METHODS } from '~/constants/appConstants.ts';
import request from '../request.ts';
import { AUTH_ENDPOINTS } from './config.ts';
import { LoginReqBody, RefreshTokenReqReturn, RegisterReqBody } from './types.ts';

export default class AuthService {
  public static login(body: LoginReqBody) {
    return request({
      url: AUTH_ENDPOINTS.login(),
      method: REQUEST_METHODS.POST,
      data: body,
    });
  }

  public static logout() {
    return request({
      url: AUTH_ENDPOINTS.logout(),
      method: REQUEST_METHODS.POST,
    });
  }

  public static register(body: RegisterReqBody) {
    return request({
      url: AUTH_ENDPOINTS.register(),
      method: REQUEST_METHODS.POST,
      data: body,
    });
  }

  public static refresh() {
    return request<RefreshTokenReqReturn>({
      url: AUTH_ENDPOINTS.refresh(),
      method: REQUEST_METHODS.POST,
    });
  }
}
