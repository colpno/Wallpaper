// ---- helpers ----
/** Maximum recursion depth. */
type MaxDepth = 5;

/** "previous" table for decrementing a depth counter. */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Primitive detection (treat these as leaves). */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Join two path pieces. */
type Join<K extends string, P extends string> = `${K}${"" extends P ? "" : "."}${P}`;

/** Extract the item type of an array. */
export type UnwrapArray<T> = T extends Array<infer I> ? I : T;

/** Detect if T is a plain object (and not a primitive, array, or special object). */
export type IsPlainObject<T> =
  UnwrapArray<T> extends Primitive ? false : UnwrapArray<T> extends object ? true : false;

/**
 * Produce dot-joined properties from `TObject`
 * if its value type is plain object
 * (stop at depth 0 = Prev[0] = never).
 */
export type FlattenObjectKeys<TObject, TDepth extends number = MaxDepth> = [TDepth] extends [0]
  ? never
  : {
      [K in Extract<keyof TObject, string>]: IsPlainObject<TObject[K]> extends true
        ? Join<K, FlattenObjectKeys<UnwrapArray<TObject[K]>, Prev[TDepth]>>
        : TObject[K] extends Array<infer U>
          ? IsPlainObject<U> extends true
            ? Join<K, FlattenObjectKeys<U, Prev[TDepth]>>
            : K
          : K;
    }[Extract<keyof TObject, string>];

/**
 * Extract the type of `TPath` from `TObject`
 * (stop at depth 0 = Prev[0] = never).
 */
export type FlattenedObjectKeysValue<
  TObject,
  TPath extends string,
  TDepth extends number = MaxDepth,
> = [TDepth] extends [0]
  ? never
  : TPath extends `${infer K}.${infer Rest}`
    ? K extends keyof TObject
      ? FlattenedObjectKeysValue<UnwrapArray<TObject[K]>, Rest, Prev[TDepth]>
      : never
    : TPath extends keyof TObject
      ? TObject[TPath]
      : never;

// ---- sort types ----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SortDirection = "asc" | "desc" | 1 | -1 | { $meta: any };

export type Sort<TObject extends Record<string, unknown>, TDepth extends number = MaxDepth> = {
  [K in FlattenObjectKeys<TObject, TDepth>]?: SortDirection;
} & {
  [K in string]: SortDirection;
};

// ---- select types ----
export type SelectValue = 1 | true | 0 | false | string | object;

export type Select<TObject extends Record<string, unknown>, TDepth extends number = MaxDepth> =
  | Array<
      FlattenObjectKeys<TObject, TDepth> | `-${FlattenObjectKeys<TObject, TDepth>}` | keyof TObject
    >
  | ({
      [K in FlattenObjectKeys<TObject, TDepth>]?: SelectValue;
    } & {
      [K in string]: SelectValue;
    });

// ---- populate/embed types ----
export type EmbedOptions<
  TObject extends Record<string, unknown>,
  TDepth extends number = MaxDepth,
> = {
  [K in keyof TObject]: {
    /** Path to populate. */
    path: K;
    /**
     * If true Mongoose will always set `path` to a document, or `null` if no document was found.
     * If false Mongoose will always set `path` to an array, which will be empty if no documents are found.
     * Inferred from schema by default.
     */
    justOne?: boolean;
    /**
     * Set to `true` to execute any populate queries one at a time, as opposed to in parallel.
     * We recommend setting this option to `true` if using transactions, especially if also populating multiple paths or paths with multiple models.
     * MongoDB server does **not** support multiple operations in parallel on a single transaction.
     */
    ordered?: boolean;
  } & (UnwrapArray<TObject[K]> extends Record<string, unknown>
    ? {
        /** Fields to select. */
        select?: Select<UnwrapArray<TObject[K]>>;
        /** Query conditions to match. */
        match?: Filter<UnwrapArray<TObject[K]>, TDepth>;
        /** Deep populate. */
        populate?: Embed<UnwrapArray<TObject[K]>>;
        options?: Pick<ApiQuery<UnwrapArray<TObject[K]>, TDepth>, "sort" | "limit" | "page">;
      }
    : {
        /** Fields to select. */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        select?: Select<any>;
        /** Query conditions to match. */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        match?: Filter<any>;
        /** Deep populate. */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        populate?: Embed<any>;
        options?: Pick<ApiQuery<Record<string, unknown>>, "sort" | "limit" | "page">;
      });
}[keyof TObject];

export type Embed<TObject extends Record<string, unknown>> =
  | keyof TObject
  | Array<keyof TObject>
  | EmbedOptions<TObject>
  | Array<EmbedOptions<TObject>>;

// ---- main types ----
/** Object of operators. */
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
} & (T extends string
  ? {
      regex?: string;
      /**
       * Used in conjunction with `regex` to modify the search behavior. Possible values are:
       * - `i`: case-insensitive matching.
       * - `m`: multiline matching.
       * - `x`: verbose regexps (in which whitespace is ignored and # starts a comment).
       * - `s`: dotall mode (allows . to match newline characters).
       * - `u`: unicode matching.
       * @see https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-options
       */
      options?: "i" | "m" | "x" | "s" | "u";
    }
  : object) &
  (T extends Array<unknown>
    ? {
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
      }
    : object);

/**
 * @template TObject - The object type to create a query filter for.
 * @template TDepth - Maximum recursion depth (default 5).
 */
type Filter<TObject extends Record<string, unknown>, TDepth extends number = MaxDepth> = {
  [K in FlattenObjectKeys<TObject, TDepth>]?:
    | FlattenedObjectKeysValue<TObject, K, TDepth>
    | FlattenedObjectKeysValue<TObject, K, TDepth>[]
    | FilterOperatorsObject<FlattenedObjectKeysValue<TObject, K, TDepth>>;
} & {
  [K in string]: unknown | unknown[] | FilterOperatorsObject<unknown>;
};

/**
 * @template TObject - The object type to create a query filter for.
 * @template TDepth - The maximum depth of nested objects (default 5).
 */
export type ApiQuery<
  TObject extends Record<string, unknown> | unknown = unknown,
  TDepth extends number = MaxDepth,
> = {
  page?: number;
  limit?: number;
} & (TObject extends Record<string, unknown>
  ? {
      select?: Select<TObject>;
      sort?: Sort<TObject>;
      embed?: Embed<TObject>;
      or?: Filter<TObject, TDepth>[];
      and?: Filter<TObject, TDepth>[];
      nor?: Filter<TObject, TDepth>[];
      not?: Filter<TObject, TDepth>;
    } & Filter<TObject, TDepth>
  : object);
