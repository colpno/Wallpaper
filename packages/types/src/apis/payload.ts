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

export type GeneralErrorPayload = {
  message: string;
  stack?: string;
};

export type ValidationErrorPayload = { path: string; message: string }[];

export type FailedPayload = GeneralErrorPayload | ValidationErrorPayload;
