import type { PaginationPayload, PinAPIs } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { getPinById, getPins, searchPins } from "./apis";
import { PIN_KEYS } from "./keys";

export const getPinsInfiniteQueryOptions = <
  TQuery extends Omit<PinAPIs.GetMany["query"], "page" | "limit"> &
    Required<Pick<PinAPIs.GetMany["query"], "page" | "limit">>,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal }) =>
      getPins(query, { signal }).then(
        (response) => response as Extract<typeof response, PaginationPayload<unknown[]>>
      ),
    queryKey: query ? PIN_KEYS.list(query) : PIN_KEYS.lists(),
    initialPageParam: query.page,
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

export const searchPinsQueryOptions = (
  body: PinAPIs.Search["body"],
  query: Omit<PinAPIs.Search["query"], "limit" | "page"> &
    Required<Pick<PinAPIs.Search["query"], "limit" | "page">>
) =>
  infiniteQueryOptions({
    queryFn: () => searchPins(body, query),
    queryKey: "text" in body && body.text ? PIN_KEYS.search(body.text) : PIN_KEYS.lists(),
    initialPageParam: query.page,
    getNextPageParam: (lastPageResult) =>
      lastPageResult.meta.currentPage < lastPageResult.meta.totalPages
        ? lastPageResult.meta.currentPage + 1
        : undefined,
    select: (data) => data.pages.flatMap((page) => page.data),
  });
