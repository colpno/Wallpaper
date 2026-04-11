import type { AxiosRequestConfig } from "axios";

import { API_ROUTES } from "@repo/shared";
import type { PinAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const getPins = (
  query?: PinAPIs.GetMany["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<PinAPIs.GetMany["response"]>({
    ...options,
    url: API_ROUTES.PIN.getMany.path(),
    method: API_ROUTES.PIN.getMany.method,
    params: query,
  });

export const getPinById = (
  params: PinAPIs.GetOneById["params"],
  query?: PinAPIs.GetOneById["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<PinAPIs.GetOneById["response"]>({
    ...options,
    url: API_ROUTES.PIN.getOneById.path(params.id),
    method: API_ROUTES.PIN.getOneById.method,
    params: query,
  });

export const addPin = (body: PinAPIs.AddOne["body"]) =>
  request<PinAPIs.AddOne["response"], typeof body>({
    url: API_ROUTES.PIN.addOne.path(),
    method: API_ROUTES.PIN.addOne.method,
    data: body,
  });

export const updatePinById = (
  params: PinAPIs.UpdateOneById["params"],
  body: PinAPIs.UpdateOneById["body"]
) =>
  request<PinAPIs.UpdateOneById["response"], typeof body>({
    url: API_ROUTES.PIN.updateOneById.path(params.id),
    method: API_ROUTES.PIN.updateOneById.method,
    data: body,
  });

export const removePinById = (params: PinAPIs.RemoveOneById["params"]) =>
  request<PinAPIs.RemoveOneById["response"]>({
    url: API_ROUTES.PIN.removeOneById.path(params.id),
    method: API_ROUTES.PIN.removeOneById.method,
  });

export const removePins = (body: PinAPIs.RemoveMany["body"]) =>
  request<PinAPIs.RemoveMany["response"], typeof body>({
    url: API_ROUTES.PIN.removeMany.path(),
    method: API_ROUTES.PIN.removeMany.method,
    data: body,
  });

export const undoPinsRemoval = (body: PinAPIs.UndoRemoval["body"]) =>
  request<PinAPIs.UndoRemoval["response"], typeof body>({
    url: API_ROUTES.PIN.undoRemoval.path(),
    method: API_ROUTES.PIN.undoRemoval.method,
    data: body,
  });

export const searchPins = (
  body: PinAPIs.Search["body"],
  query?: PinAPIs.Search["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<PinAPIs.Search["response"], typeof body>({
    ...options,
    url: API_ROUTES.PIN.search.path(),
    method: API_ROUTES.PIN.search.method,
    data: body,
    params: query,
  });
