// ---- helpers ----
/** Maximum recursion depth. */
type MaxDepth = 5;

/** "previous" table for decrementing a depth counter. */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Primitive detection (treat these as leaves). */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Extract the item type of an array. */
type UnwrapArray<T> = T extends Array<infer I> ? I : T;

/** Detect if T is a plain object (and not a primitive, array, or special object). */
type IsPlainObject<T> =
  UnwrapArray<T> extends Primitive ? false : UnwrapArray<T> extends object ? true : false;

/** Join two path pieces. */
type Join<K extends string, P extends string> = `${K}${"" extends P ? "" : "."}${P}`;

// ---- populate/embed types ----
type PopulateQueryOptions<TObject extends Record<string, any>> = {
  /** 1 for ascending, -1 for descending */
  sort?: Record<keyof TObject, 1 | -1>;
  skip?: number;
  limit?: number;
};

type PopulateOptions<
  TObject extends Record<string, any>,
  TPath extends keyof TObject = keyof TObject,
> = {
  /** Path to populate. */
  path: TPath;
  /** Fields to select. */
  select?: string;
  /** Query conditions to match. */
  match?: Partial<UnwrapArray<TObject[TPath]>>;
  /** Query options like sort, limit, etc. */
  options?: PopulateQueryOptions<TObject>;
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
} & (UnwrapArray<TObject[TPath]> extends Record<string, any>
  ? {
      /** Deep populate. */
      populate?:
        | keyof UnwrapArray<TObject[TPath]>
        | Array<keyof UnwrapArray<TObject[TPath]>>
        | PopulateOptions<UnwrapArray<TObject[TPath]>>
        | Array<PopulateOptions<UnwrapArray<TObject[TPath]>>>;
    }
  : {});

export type Populate<TObject extends Record<string, any>> =
  | keyof TObject
  | Array<keyof TObject>
  | PopulateOptions<TObject>
  | Array<PopulateOptions<TObject>>;

// ---- main types ----

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

/** Object of operators. */
export type FilterOperatorsObject<T> = {
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
} & (T extends string
  ? {
      regex?: T;
      /**
       * `'i'` for case-insensitive matching.\
       * `'m'` for multiline matching.\
       * `'x'` for verbose regexps (in which whitespace is ignored and # starts a comment).\
       * `'s'` for dotall mode (allows . to match newline characters).\
       * `'u'` for unicode matching.
       */
      options?: "i" | "m" | "x" | "s" | "u";
    }
  : {}) &
  (T extends Array<any>
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
    : {});

/**
 * @template TObject - The object type to create a query filter for.
 * @template TDepth - Maximum recursion depth (default 5).
 */
type Filter<TObject extends Record<string, any>, TDepth extends number = MaxDepth> = {
  [K in FlattenObjectKeys<TObject, TDepth>]?:
    | FlattenedObjectKeysValue<TObject, K, TDepth>
    | FlattenedObjectKeysValue<TObject, K, TDepth>[]
    | FilterOperatorsObject<FlattenedObjectKeysValue<TObject, K, TDepth>>;
};

/**
 * @template TObject - The object type to create a query filter for.
 * @template TDepth - The maximum depth of nested objects (default 5).
 */
export type ApiQuery<
  TObject extends Record<string, any> | unknown = unknown,
  TDepth extends number = MaxDepth,
> = {
  page?: number;
  limit?: number;
} & (TObject extends Record<string, any>
  ? {
      select?: Array<keyof TObject | `-${keyof TObject & string}`>;
      sort?: Record<keyof TObject, "asc" | "desc">;
      embed?: Populate<TObject>;
      or?: Filter<TObject, TDepth>[];
      and?: Filter<TObject, TDepth>[];
      nor?: Filter<TObject, TDepth>[];
      not?: Filter<TObject, TDepth>;
    } & Filter<TObject, TDepth>
  : {});
