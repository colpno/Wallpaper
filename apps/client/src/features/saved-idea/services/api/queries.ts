import type { PaginationPayload, SavedIdeaAPIs } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { INITIAL_PAGE } from "@/constants/common";

import { checkSaved, getSavedIdeas } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

export const getSavedIdeasInfiniteQueryOptions = <
  TQuery extends Omit<SavedIdeaAPIs.GetMany["query"], "page">,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      getSavedIdeas(
        {
          ...query,
          page: pageParam,
        },
        { signal }
      ).then((response) => response as Extract<typeof response, PaginationPayload<unknown[]>>),
    queryKey: query ? SAVED_IDEA_KEYS.list(query) : SAVED_IDEA_KEYS.lists(),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
};

export const checkSavedQueryOptions = (query: SavedIdeaAPIs.CheckSaved["query"]) => {
  return queryOptions({
    queryFn: ({ signal }) => checkSaved(query, { signal }),
    queryKey: SAVED_IDEA_KEYS.check(query.userId, query.pinId),
  });
};
