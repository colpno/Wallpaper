import type { FlattenObject, FlattenObjectKeys, KnownKeys, UnwrapArray } from "./helpers.js";
import type {
  PopulateOptions,
  QueryOptions,
  SortOrder as MongooseSortOrder,
  Types,
} from "mongoose";

export type FilterOperatorsObject<T> = {
  eq?: T;
  ne?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  all?: UnwrapArray<T>[];
  in?: UnwrapArray<T>[];
  nin?: UnwrapArray<T>[];
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

export type QueryFilterOperators = keyof FilterOperatorsObject<unknown>;

export type FilterCondition<T> = T | FilterOperatorsObject<T>;
export type Filter<T> = {
  [K in keyof T]: K extends `${string}_id`
    ? FilterCondition<string | Types.ObjectId>
    : FilterCondition<T[K]>;
};

export type SelectValue = boolean | 0 | 1;
export type Select<T extends string | number | symbol = string> = Partial<Record<T, SelectValue>>;

export type SortOrder = Extract<MongooseSortOrder, "asc" | "desc">;
export type Sort<T extends string | number | symbol = string> =
  | Partial<Record<T, SortOrder>>
  | [T, SortOrder][];

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
 * @template Data - The data type to query.
 * @template Pro - Flattened keys of `Data` included in projection.
 * @template S - Flattened keys of `Data` included in sort.
 * @template Pop - Flattened keys of `Data` included in populate.
 */
export type QueryFilter<
  Data,
  Pro extends string | undefined = undefined,
  S extends string | undefined = undefined,
  Pop extends string | undefined = undefined,
> = Partial<
  {
    limit: number;
    page: number;
    select: Select<Pro extends string ? Pro : FlattenObjectKeys<Data>>;
    sort: Sort<S extends string ? S : FlattenObjectKeys<Data>>;
    embed: Pop extends string
      ?
          | Pop
          | Pop[]
          | EmbedOptions<Pick<FlattenObject<Data>, Pop & keyof FlattenObject<Data>>>
          | EmbedOptions<Pick<FlattenObject<Data>, Pop & keyof FlattenObject<Data>>>[]
      :
          | FlattenObjectKeys<Data>
          | FlattenObjectKeys<Data>[]
          | EmbedOptions<FlattenObject<Data>>
          | EmbedOptions<FlattenObject<Data>>[];
  } & Filter<FlattenObject<Data>>
>;
