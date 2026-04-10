import { toast } from "@repo/ui/components";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const onQuerySuccess = (result: unknown) => {
  if (
    typeof result === "object" &&
    result !== null &&
    "message" in result &&
    typeof result.message === "string"
  ) {
    toast.error(result.message);
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
    onSuccess: onQuerySuccess,
  }),
  mutationCache: new MutationCache({}),
});
