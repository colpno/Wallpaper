import type { PaginationPayload, PinAPIs } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { INITIAL_PAGE } from "@/constants/common";

import { getPinById, getPins, searchPins } from "./apis";
import { PIN_KEYS } from "./keys";

export const getPinsInfiniteQueryOptions = (query: Omit<PinAPIs.GetMany["query"], "page">) => {
  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      getPins(
        {
          ...query,
          page: pageParam,
        },
        { signal }
      ).then((response) => response as Extract<typeof response, PaginationPayload<unknown[]>>),
    queryKey: query ? PIN_KEYS.list(query) : PIN_KEYS.lists(),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
};

export const getPinByIdQueryOptions = <TQuery extends PinAPIs.GetOneById["query"]>(
  params: PinAPIs.GetOneById["params"],
  query?: TQuery
) =>
  queryOptions({
    queryFn: ({ signal }) => getPinById(params, query, { signal }),
    queryKey: PIN_KEYS.item(params),
  });

export const searchPinsInfiniteQueryOptions = (
  body: PinAPIs.Search["body"],
  query: Omit<PinAPIs.Search["query"], "page">
) =>
  infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      searchPins(
        body,
        {
          ...query,
          page: pageParam,
        },
        { signal }
      ),
    queryKey: PIN_KEYS.searchList(body),
    initialPageParam: INITIAL_PAGE,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
