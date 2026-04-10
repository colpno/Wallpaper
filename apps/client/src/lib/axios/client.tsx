import { HttpStatusCodes } from "@repo/shared";
import type { FailedPayload, ValidationErrorPayload } from "@repo/types";
import { toast } from "@repo/ui/components";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

import { env } from "@/configs/env";

import ValidationErrorList from "./ValidationErrorList";

export const axiosClient = axios.create({
  baseURL: env.VITE_API_URL,
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (axiosError: AxiosError<FailedPayload>) => {
    // Show toast
    if (axiosError.status === HttpStatusCodes.UNPROCESSABLE_ENTITY && axiosError.response) {
      // Validation error
      const errors = axiosError.response.data as ValidationErrorPayload;
      toast.error(<ValidationErrorList errors={errors} />);
    } else {
      // General errors
      let message: string = axiosError.message;

      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === "object" &&
        axiosError.response.data !== null &&
        "message" in axiosError.response.data
      ) {
        message = axiosError.response.data.message;
      }

      toast.error(message);
    }

    return Promise.reject(axiosError.response?.data);
  }
);

export const request = <ResponsePayload, RequestBody = never>(
  config: AxiosRequestConfig<RequestBody>
) => {
  return axiosClient<never, ResponsePayload, RequestBody>(config);
};
