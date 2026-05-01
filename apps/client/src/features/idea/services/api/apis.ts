import type { AxiosRequestConfig } from "axios";

import { API_ROUTES } from "@repo/shared";
import type { IdeaAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const getIdeas = <TQuery extends IdeaAPIs.GetMany["query"]>(
  query?: TQuery,
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<IdeaAPIs.GetMany<TQuery>["response"]>({
    ...options,
    url: API_ROUTES.IDEA.getMany.path(),
    method: API_ROUTES.IDEA.getMany.method,
    params: query,
  });

export const checkSaved = (
  query: IdeaAPIs.CheckSaved["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "query">
) =>
  request<IdeaAPIs.CheckSaved["response"]>({
    ...options,
    url: API_ROUTES.IDEA.checkSaved.path(),
    method: API_ROUTES.IDEA.checkSaved.method,
    params: query,
  });

export const addIdea = (body: IdeaAPIs.AddOne["body"]) =>
  request<IdeaAPIs.AddOne["response"], typeof body>({
    url: API_ROUTES.IDEA.addOne.path(),
    method: API_ROUTES.IDEA.addOne.method,
    data: body,
  });

export const deleteIdeaById = (params: IdeaAPIs.DeleteOneById["params"]) =>
  request<IdeaAPIs.DeleteOneById["response"]>({
    url: API_ROUTES.IDEA.deleteOneById.path(params.id),
    method: API_ROUTES.IDEA.deleteOneById.method,
  });
