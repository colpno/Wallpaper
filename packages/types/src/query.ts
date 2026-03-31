import type { FlattenObject, FlattenObjectKeys, KnownKeys, UnwrapArray } from "./helpers.js";
import type { PopulateOptions, QueryOptions, SortOrder as BaseSortOrder, Types } from "mongoose";

export type FilterOperators<T> = {
  eq?: T;
  ne?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  all?: T[];
  in?: T[];
  nin?: T[];
  exists?: boolean;
  regex?: string;
  options?: "i" | "m" | "x" | "s" | "u";
  size?:
    | number
    | {
        eq?: number;
        ne?: number;
        gt?: number;
        gte?: number;
        lt?: number;
        lte?: number;
      };
};

export type FilterCondition<T> = T | FilterOperators<T>;
export type Filter<T extends Record<string, unknown>> = {
  [K in keyof T]: K extends `${string}_id`
    ? FilterCondition<string | Types.ObjectId>
    : FilterCondition<T[K]>;
};

export type SortOrder = BaseSortOrder;
export type Sort<T extends string> =
  | string
  | Partial<Record<T, SortOrder | { $meta: unknown }>>
  | [T, SortOrder][];

export type SelectValue = boolean | 0 | 1;
export type Select<T extends string> = string | { [K in T]?: SelectValue };

export type EmbedOptions<O> = Omit<
  PopulateOptions,
  "path" | "select" | "match" | "options" | "populate"
> &
  {
    [K in keyof O]?: {
      path: K;
      select?: Select<FlattenObjectKeys<UnwrapArray<O[K]>>>;
      match?: Filter<FlattenObject<UnwrapArray<O[K]>>>;
      options?: Omit<KnownKeys<QueryOptions>, "projection" | "sort"> & {
        projection?: Select<FlattenObjectKeys<UnwrapArray<O[K]>>>;
        sort?: Sort<FlattenObjectKeys<UnwrapArray<O[K]>>>;
      };
      populate?: FlattenObject<UnwrapArray<O[K]>> extends string
        ?
            | FlattenObject<UnwrapArray<O[K]>>
            | FlattenObject<UnwrapArray<O[K]>>[]
            | EmbedOptions<FlattenObject<UnwrapArray<O[K]>>>
            | EmbedOptions<FlattenObject<UnwrapArray<O[K]>>>[]
        :
            | string
            | string[]
            | EmbedOptions<Record<string, unknown>>
            | EmbedOptions<Record<string, unknown>>[];
    };
  }[keyof O];

/**
 * Query filter type that for MongoDB queries.
 * @template TData - The data type to query.
 * @template TSelectable - Flattened keys of `Data` included in projection.
 * @template TSortable - Flattened keys of `Data` included in sort.
 * @template TEmbeddable - Flattened keys of `Data` included in populate.
 */
export type QueryFilter<
  TData,
  TSelectable extends string | undefined = undefined,
  TSortable extends string | undefined = undefined,
  TEmbeddable extends string | undefined = undefined,
> = Partial<
  {
    limit: number;
    page: number;
    select: Select<[TSelectable] extends [string] ? TSelectable : FlattenObjectKeys<TData>>;
    sort: Sort<TSortable extends string ? TSortable : FlattenObjectKeys<TData>>;
    embed: TEmbeddable extends string
      ?
          | TEmbeddable
          | TEmbeddable[]
          | EmbedOptions<Pick<FlattenObject<TData>, TEmbeddable & keyof FlattenObject<TData>>>
          | EmbedOptions<Pick<FlattenObject<TData>, TEmbeddable & keyof FlattenObject<TData>>>[]
      :
          | FlattenObjectKeys<TData>
          | FlattenObjectKeys<TData>[]
          | EmbedOptions<FlattenObject<TData>>
          | EmbedOptions<FlattenObject<TData>>[];
  } & Filter<FlattenObject<TData>>
>;
