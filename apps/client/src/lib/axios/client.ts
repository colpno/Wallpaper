import type { FailedPayload } from "@repo/types";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { env } from "@/configs/env";

export const axiosClient = axios.create({
  baseURL: env.VITE_API_URL,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (axiosError: AxiosError<FailedPayload>) => Promise.reject(axiosError.response?.data)
);

export const request = <ResponsePayload, RequestBody = never>(
  config: AxiosRequestConfig<RequestBody>
) => {
  return axiosClient<never, ResponsePayload, RequestBody>(config);
};
