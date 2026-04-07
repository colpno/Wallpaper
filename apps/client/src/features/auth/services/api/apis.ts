import { API_ROUTES } from "@repo/shared";
import type { AuthAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const login = (body: AuthAPIs.Login["body"]) =>
  request<AuthAPIs.Login["response"], typeof body>({
    url: API_ROUTES.AUTH.login.path(),
    method: API_ROUTES.AUTH.login.method,
    data: body,
  });

export const register = (body: AuthAPIs.Register["body"]) =>
  request<AuthAPIs.Register["response"], typeof body>({
    url: API_ROUTES.AUTH.register.path(),
    method: API_ROUTES.AUTH.register.method,
    data: body,
  });
