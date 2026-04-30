import type { FlattenObject, FlattenObjectKeys } from "./helpers.js";
import type { SortOrder as BaseSortOrder } from "mongoose";

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
  [K in keyof T]?: FilterCondition<T[K]>;
};

export type SortOrder = BaseSortOrder;
export type Sort<T extends string> = string | Partial<Record<T, SortOrder>> | [T, SortOrder][];

export type SelectValue = boolean | 0 | 1;
export type Select<T extends string> = string | { [K in T]?: SelectValue };

export type EmbedOptions<O> = {
  path: keyof O;
  select?: Select<string>;
  match?: Filter<Record<string, unknown>>;
  options?: {
    sort?: Sort<string>;
  };
  populate?:
    | string
    | EmbedOptions<Record<string, unknown>>
    | Array<string | EmbedOptions<Record<string, unknown>>>;
};

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
    sort: Sort<[TSortable] extends [string] ? TSortable : FlattenObjectKeys<TData>>;
    embed: [TEmbeddable] extends [FlattenObjectKeys<TData>]
      ?
          | TEmbeddable
          | EmbedOptions<Pick<FlattenObject<TData>, TEmbeddable>>
          | Array<TEmbeddable | EmbedOptions<Pick<FlattenObject<TData>, TEmbeddable>>>
      :
          | FlattenObjectKeys<TData>
          | EmbedOptions<FlattenObject<TData>>
          | Array<FlattenObjectKeys<TData> | EmbedOptions<FlattenObject<TData>>>;
  } & Filter<FlattenObject<TData>>
>;
