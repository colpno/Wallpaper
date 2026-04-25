import type { PaginationPayload, PinAPIs } from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { INITIAL_PAGE } from "@/constants/common";

import { getPinById, getPins, getPinsWithSaves, searchPins } from "./apis";
import { PIN_KEYS } from "./keys";

export const getPinsInfiniteQueryOptions = <
  TQuery extends
    | ({
        includeSaves?: false;
      } & Omit<PinAPIs.GetMany["query"], "page">)
    | ({
        includeSaves: true;
        pinOwner: string;
      } & Omit<PinAPIs.GetMany["query"], "page" | "pinOwner">),
>(
  query: TQuery
) => {
  const { includeSaves, ...rest } = query;

  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      (includeSaves
        ? getPinsWithSaves(
            {
              ...rest,
              pinOwner: rest.pinOwner as string,
              page: pageParam,
            },
            { signal }
          )
        : getPins(
            {
              ...rest,
              page: pageParam,
            },
            { signal }
          )
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

export const getPinsWithSavesInfiniteQueryOptions = <
  TQuery extends Omit<PinAPIs.GetManyWithSaves["query"], "page">,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      getPinsWithSaves(
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

export const searchPinsInfiniteQueryOptions = <
  TQuery extends Omit<PinAPIs.Search["query"], "page">,
>(
  body: PinAPIs.Search["body"],
  query: TQuery
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
