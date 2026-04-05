import type { PaginationPayload, PostAPIs } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getPostById, getPosts, searchPosts } from "./apis";
import { POST_KEYS } from "./keys";

export const getPostsInfiniteQueryOptions = <
  TQuery extends Omit<PostAPIs.GetMany["query"], "page" | "limit"> &
    Required<Pick<PostAPIs.GetMany["query"], "page" | "limit">>,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal }) =>
      getPosts(query, { signal }).then(
        (response) => response as Extract<typeof response, PaginationPayload<unknown[]>>
      ),
    queryKey: query ? POST_KEYS.list(query) : POST_KEYS.lists(),
    initialPageParam: query.page,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
};

export const getPostByIdQueryOptions = <TQuery extends PostAPIs.GetOneById["query"]>(
  params: PostAPIs.GetOneById["params"],
  query?: TQuery
) =>
  queryOptions({
    queryFn: ({ signal }) => getPostById(params, query, { signal }),
    queryKey: POST_KEYS.item(params),
  });

export const searchPostsQueryOptions = (
  body: PostAPIs.Search["body"],
  query?: PostAPIs.Search["query"]
) =>
  queryOptions({
    queryFn: () => searchPosts(body, query),
    queryKey: "text" in body && body.text ? POST_KEYS.search(body.text) : POST_KEYS.lists(),
  });
