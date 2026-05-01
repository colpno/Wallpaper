import type { IdeaAPIs } from "@repo/types";
import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addIdea, deleteIdeaById } from "./apis";
import { IDEA_KEYS } from "./keys";

export const addIdeaMutationOptions = () =>
  mutationOptions({
    mutationFn: addIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
    },
  });

export const deleteIdeaByIdMutationOptions = () =>
  mutationOptions({
    mutationFn: (params: IdeaAPIs.DeleteOneById["params"]) => deleteIdeaById(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IDEA_KEYS.lists() });
    },
  });
