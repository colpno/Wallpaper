// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Register } from '@tanstack/react-query';

interface Meta {
  queryMeta: {
    /**
     * Specify a success message to be shown in a toast when the query is successful.
     */
    successMessage?: string;
    /**
     * An error message coming from the backend will be shown in a toast.
     */
    errorToast?: boolean;
  };
  mutationMeta: {
    /**
     * Specify a success message to be shown in a toast when the mutation is successful.
     */
    successMessage?: string;
    /**
     * An error message coming from the backend will be shown in a toast.
     */
    showErrorToast?: boolean;
  };
}

declare module '@tanstack/query-core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Register extends Meta {}
}
