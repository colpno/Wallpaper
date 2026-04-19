import type {
  PaginationPayload,
  PinDB,
  SavedIdeaAPIs,
  SavedIdeaDB,
  UnwrapArray,
  UserDB,
} from "@repo/types";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import { INITIAL_PAGE } from "@/constants/common";

import { checkSaved, getSavedIdeasByUserId } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

type PopulatedData<TQuery> = TQuery extends { embed: unknown }
  ? UnwrapArray<TQuery["embed"]> extends "user" | { path: "user" }
    ? SavedIdeaDB<UserDB>
    : UnwrapArray<TQuery["embed"]> extends "pin" | { path: "pin" }
      ? SavedIdeaDB<string, PinDB>
      : SavedIdeaDB<UserDB, PinDB>
  : SavedIdeaDB;

export const getSavedIdeasInfiniteQueryOptions = <
  TQuery extends Omit<SavedIdeaAPIs.GetMany["query"], "page">,
>(
  query: TQuery
) => {
  return infiniteQueryOptions({
    queryFn: ({ signal, pageParam }) =>
      getSavedIdeasByUserId(
        {
          ...query,
          page: pageParam,
        },
        { signal }
      ).then((response) => response as PaginationPayload<PopulatedData<TQuery>[]>),
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
