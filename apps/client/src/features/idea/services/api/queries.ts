import type { IdeaAPIs, PaginationPayload } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { INITIAL_PAGE } from "@/constants/common";

import { checkSaved, getIdeas } from "./apis";
import { IDEA_KEYS } from "./keys";

export const getIdeasInfiniteQueryOptions = <
  TQuery extends Omit<IdeaAPIs.GetMany["query"], "page">,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      getIdeas(
        {
          ...query,
          page: pageParam,
        },
        { signal }
      ).then((response) => response as Extract<typeof response, PaginationPayload<unknown[]>>),
    queryKey: query ? IDEA_KEYS.list(query) : IDEA_KEYS.lists(),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
};

export const checkSavedQueryOptions = (query: IdeaAPIs.CheckSaved["query"]) => {
  return queryOptions({
    queryFn: ({ signal }) => checkSaved(query, { signal }),
    queryKey: IDEA_KEYS.check(query.userId, query.pinId),
  });
};
