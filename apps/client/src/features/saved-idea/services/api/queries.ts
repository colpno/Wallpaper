import type { SavedIdeaAPIs } from "@repo/types";
import { queryOptions } from "@tanstack/react-query";

import { checkSaved } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

export const checkSavedQueryOptions = (query: SavedIdeaAPIs.CheckSaved["query"]) => {
  return queryOptions({
    queryFn: ({ signal }) => checkSaved(query, { signal }),
    queryKey: SAVED_IDEA_KEYS.check(query.userId, query.pinId),
  });
};
