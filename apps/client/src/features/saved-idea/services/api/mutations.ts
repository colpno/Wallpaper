import { mutationOptions } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query/client";

import { addSavedIdea } from "./apis";
import { SAVED_IDEA_KEYS } from "./keys";

export const addSavedIdeaMutationOptions = () =>
  mutationOptions({
    mutationFn: addSavedIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAVED_IDEA_KEYS.lists() });
    },
  });
