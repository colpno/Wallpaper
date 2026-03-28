export type PaginationPayload<Data extends unknown[]> = {
  data: Data;
  meta: {
    pageSize: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
};
