import type { UserAPIs } from "@repo/types";
import { queryOptions } from "@tanstack/react-query";

import { USER_KEYS } from "@/features/user/services/api/keys";

import { getUser } from "./apis";

export const getUserQueryOptions = <TQuery extends UserAPIs.GetOne["query"]>(query: TQuery) =>
  queryOptions({
    queryFn: ({ signal }) => getUser(query, { signal }),
    queryKey: USER_KEYS.item(query),
  });
