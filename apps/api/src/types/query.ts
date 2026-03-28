import type { QueryFilterOperators } from "@repo/types";

/** Recursively normalizes filter operators in the given type `T` to MongoDB operators. */
export type NormalizeFilterOperators<T> = T extends object
  ? {
      [K in keyof T as K extends QueryFilterOperators
        ? `$${K & string}`
        : K]: NormalizeFilterOperators<T[K]>;
    }
  : T extends Array<infer U>
    ? Array<NormalizeFilterOperators<U>>
    : T;
