import type { AxiosRequestConfig } from "axios";

import { API_ROUTES } from "@repo/shared";
import type { SavedIdeaAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const checkSaved = (
  query: SavedIdeaAPIs.CheckSaved["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "query">
) =>
  request<SavedIdeaAPIs.CheckSaved["response"]>({
    ...options,
    url: API_ROUTES.SAVED_IDEA.checkSaved.path(),
    method: API_ROUTES.SAVED_IDEA.checkSaved.method,
    params: query,
  });

export const addSavedIdea = (body: SavedIdeaAPIs.AddOne["body"]) =>
  request<SavedIdeaAPIs.AddOne["response"], typeof body>({
    url: API_ROUTES.SAVED_IDEA.addOne.path(),
    method: API_ROUTES.SAVED_IDEA.addOne.method,
    data: body,
  });

export const deleteSavedIdeaById = (params: SavedIdeaAPIs.DeleteOneById["params"]) =>
  request<SavedIdeaAPIs.DeleteOneById["response"]>({
    url: API_ROUTES.SAVED_IDEA.deleteOneById.path(params.id),
    method: API_ROUTES.SAVED_IDEA.deleteOneById.method,
  });
