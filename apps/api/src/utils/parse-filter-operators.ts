import type { KnownKeys } from "@/types/common.js";
import type { QuerySelector, RootQuerySelector } from "mongoose";

import type { FilterOperators } from "@repo/types";

type Operators = keyof FilterOperators<unknown>;

/** Recursively normalizes filter operators in the given type `T` to MongoDB operators. */
export type NormalizeFilterOperators<T> =
  T extends Array<infer U>
    ? Array<NormalizeFilterOperators<U>>
    : T extends Record<string, unknown>
      ? {
          [K in keyof T as K extends Operators ? `$${K}` : K]?: NormalizeFilterOperators<T[K]>;
        }
      : T;

const operatorMap: Record<
  Operators,
  keyof QuerySelector<unknown> | keyof KnownKeys<RootQuerySelector<unknown>>
> = {
  eq: "$eq",
  ne: "$ne",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  all: "$all",
  in: "$in",
  nin: "$nin",
  regex: "$regex",
  options: "$options",
  size: "$size",
  exists: "$exists",
};

/**
 * Recursively parses filter operators to MongoDB operators.
 * @param input The value to parse.
 * @returns Valid MongoDB operators.
 * @example
 * parseCondition("active") // "active"
 * parseCondition({ size: { gt: 1 } }) // { $size: { $gt: 1 } }
 * parseCondition({ all: ["john", "joe"] }) // { $all: [ 'john', 'joe' ] }
 */
export const parseFilterOperators = <T>(input: T): NormalizeFilterOperators<T> => {
  if (typeof input !== "object" || !input || input instanceof Date) {
    return input as NormalizeFilterOperators<T>;
  }

  if (Array.isArray(input)) {
    return input.map(parseFilterOperators) as NormalizeFilterOperators<T>;
  }

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!(key in operatorMap)) {
      output[key] = parseFilterOperators(value);
      continue;
    }

    const mongoOp = operatorMap[key as Operators];

    output[mongoOp] = parseFilterOperators(value);
  }

  return output as NormalizeFilterOperators<T>;
};
