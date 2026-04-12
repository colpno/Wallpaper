import { httpErrorSchema, httpValidationErrorSchema } from "@repo/shared";
import { toast } from "@repo/ui/components";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import ValidationErrorList from "./ValidationErrorList";

const onError = (error: unknown): void => {
  const parseHttpValidationErrorResult = httpValidationErrorSchema.safeParse(error);
  if (parseHttpValidationErrorResult.success) {
    toast.warning(<ValidationErrorList issues={parseHttpValidationErrorResult.data} />);
    return;
  }

  const parseHttpErrorResult = httpErrorSchema.safeParse(error);
  if (parseHttpErrorResult.success) {
    toast.error(parseHttpErrorResult.data.message);
    return;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60, // 1 hours
    },
  },
  queryCache: new QueryCache({
    onError,
  }),
  mutationCache: new MutationCache({
    onError,
  }),
});
