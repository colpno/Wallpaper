import type { SavedIdeaAPIs } from "@repo/types";
import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addSavedIdea, deleteSavedIdeaById } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

export const addSavedIdeaMutationOptions = () =>
  mutationOptions({
    mutationFn: addSavedIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_IDEA_KEYS.lists() });
    },
  });

export const deleteSavedIdeaByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (params: SavedIdeaAPIs.DeleteOneById["params"]) => deleteSavedIdeaById(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_IDEA_KEYS.lists() });
    },
  });
