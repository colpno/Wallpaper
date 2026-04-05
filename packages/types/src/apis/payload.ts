export type PaginationPayload<D extends unknown[]> = {
  data: D;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export type FailedPayload = {
  message: string;
  stack?: string;
};
