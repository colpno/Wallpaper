export interface ApiDataResponse<D> {
  readonly data: D;
}

export interface ApiPaginatedResponse<D extends unknown[]> extends ApiDataResponse<D> {
  readonly pagination: {
    readonly total: number;
    readonly page: number;
    readonly perPage: number;
    readonly pages: number;
  };
}

export type ApiResponse<D extends unknown | unknown[]> = D extends unknown[]
  ? ApiPaginatedResponse<D>
  : ApiDataResponse<D>;
