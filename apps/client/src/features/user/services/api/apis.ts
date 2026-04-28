import type { AxiosRequestConfig } from "axios";

import { API_ROUTES } from "@repo/shared";
import type { UserAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const getUser = <TQuery extends UserAPIs.GetOne["query"]>(
  query: TQuery,
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<UserAPIs.GetOne<TQuery>["response"]>({
    ...options,
    url: API_ROUTES.USER.getOne.path(),
    method: API_ROUTES.USER.getOne.method,
    params: query,
  });
