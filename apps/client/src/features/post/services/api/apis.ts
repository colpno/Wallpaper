import type { AxiosRequestConfig } from "axios";

import { API_ROUTES } from "@repo/shared";
import type { PostAPIs } from "@repo/types";

import { request } from "@/lib/axios/client";

export const getPosts = (
  query?: PostAPIs.GetMany["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<PostAPIs.GetMany["response"]>({
    ...options,
    url: API_ROUTES.POST.getMany.path(),
    method: API_ROUTES.POST.getMany.method,
    params: query,
  });

export const getPostById = (
  params: PostAPIs.GetOneById["params"],
  query?: PostAPIs.GetOneById["query"],
  options?: Omit<AxiosRequestConfig<never>, "url" | "method" | "params">
) =>
  request<PostAPIs.GetOneById["response"]>({
    ...options,
    url: API_ROUTES.POST.getOneById.path(params.id),
    method: API_ROUTES.POST.getOneById.method,
    params: query,
  });

export const addPost = (body: PostAPIs.AddOne["body"]) =>
  request<PostAPIs.AddOne["response"], typeof body>({
    url: API_ROUTES.POST.addOne.path(),
    method: API_ROUTES.POST.addOne.method,
    data: body,
  });

export const updatePostById = (
  params: PostAPIs.UpdateOneById["params"],
  body: PostAPIs.UpdateOneById["body"]
) =>
  request<PostAPIs.UpdateOneById["response"], typeof body>({
    url: API_ROUTES.POST.updateOneById.path(params.id),
    method: API_ROUTES.POST.updateOneById.method,
    data: body,
  });

export const removePostById = (params: PostAPIs.RemoveOneById["params"]) =>
  request<PostAPIs.RemoveOneById["response"]>({
    url: API_ROUTES.POST.removeOneById.path(params.id),
    method: API_ROUTES.POST.removeOneById.method,
  });

export const removePosts = (body: PostAPIs.RemoveMany["body"]) =>
  request<PostAPIs.RemoveMany["response"], typeof body>({
    url: API_ROUTES.POST.removeMany.path(),
    method: API_ROUTES.POST.removeMany.method,
    data: body,
  });

export const undoPostsRemoval = (body: PostAPIs.UndoRemoval["body"]) =>
  request<PostAPIs.UndoRemoval["response"], typeof body>({
    url: API_ROUTES.POST.undoRemoval.path(),
    method: API_ROUTES.POST.undoRemoval.method,
    data: body,
  });

export const searchPosts = (body: PostAPIs.Search["body"], query?: PostAPIs.Search["query"]) =>
  request<PostAPIs.Search["response"], typeof body>({
    url: API_ROUTES.POST.search.path(),
    method: API_ROUTES.POST.search.method,
    data: body,
    params: query,
  });
