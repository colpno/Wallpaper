import type { SavedIdeaAPIs } from "@repo/types";
import { queryOptions } from "@tanstack/react-query";

import { checkSaved } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

export const checkSavedQueryOptions = (params: SavedIdeaAPIs.CheckSaved["params"]) => {
  return queryOptions({
    queryFn: ({ signal }) => checkSaved(params, { signal }),
    queryKey: SAVED_IDEA_KEYS.savedPin(params.pinId),
  });
};
