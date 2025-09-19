const BASE_ENDPOINT = '/auth';

export const AUTH_ENDPOINTS = {
  refresh: () => `${BASE_ENDPOINT}/refresh`,
  login: () => `${BASE_ENDPOINT}/login`,
  register: () => `${BASE_ENDPOINT}/register`,
  logout: () => `${BASE_ENDPOINT}/logout`,
};
