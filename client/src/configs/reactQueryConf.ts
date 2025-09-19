import {
  Mutation,
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryKey,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';

const onQuerySuccess = (
  _data: unknown,
  query: Query<unknown, unknown, unknown, QueryKey>
): void => {
  if (query.meta?.successMessage) {
    toast.success(`${query.meta.successMessage}:`);
  }
};

const onQueryError = (error: unknown, query: Query<unknown, unknown, unknown, QueryKey>): void => {
  if (query.meta?.errorToast) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};

const onMutationSuccess = (
  _data: unknown,
  _variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
): void => {
  if (mutation.meta?.successMessage) {
    toast.success(`${mutation.meta.successMessage}:`);
  }
};

const onMutationError = (
  error: unknown,
  _variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
): void => {
  if (mutation.meta?.showErrorToast) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.message);
    }
    if (error instanceof Error) {
      toast.error(error.message);
    }
  }
};

export const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
  queryCache: new QueryCache({
    onSuccess: onQuerySuccess,
    onError: onQueryError,
  }),
  mutationCache: new MutationCache({
    onError: onMutationError,
    onSuccess: onMutationSuccess,
  }),
};

const queryClient = new QueryClient(config);

export default queryClient;
