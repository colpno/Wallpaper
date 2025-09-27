import { Types } from "@wallpaper/shared";
import type { Filter } from "mongoose";

import type { NormalizeFilterOperators } from "@/types";

const operatorMap: Record<Types.QueryFilterOperators, `$${Types.QueryFilterOperators}`> = {
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
  and: "$and",
  or: "$or",
  nor: "$nor",
  not: "$not",
};

/**
 * Recursively parses a value from client-provided query operators to MongoDB operators.
 * @param input The input value to parse.
 * @returns Valid MongoDB query.
 */

function parseCondition<T>(input: T): NormalizeFilterOperators<T> {
  if (typeof input !== "object" || !input) return input as NormalizeFilterOperators<T>;
  if (Array.isArray(input)) return input.map(parseCondition) as NormalizeFilterOperators<T>;

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (!(key in operatorMap)) {
      output[key] = parseCondition(value);
      continue;
    }

    const mongoOp = operatorMap[key as Types.QueryFilterOperators];

    output[mongoOp] = parseCondition(value);
  }

  return output as NormalizeFilterOperators<T>;
}

/**
 * Builds a MongoDB filter from an user-provided query object.
 * @param query User-provided query object
 * @returns MongoDB filter object
 * @example
 * buildMongoFilter({
 *   status: 'active',
 *   name: { regex: 'john', options: 'i' },
 *   cars: { size: { gt: 1 } },
 *   or: [{ "person.age": 30 }, { "person.age": { lt: 20 } }],
 * });
 * // {
 * //   status: 'active',
 * //   name: { $regex: 'john', $options: 'i' },
 * //   cars: { $size: { $gt: 1 } },
 * //   "$or": [{ "person.age": 30 }, { "person.age": { $lt: 20 } }]
 * // }
 */

export default function buildMongoFilter<TQuery extends object>(query: TQuery) {
  const filter: Filter<NormalizeFilterOperators<TQuery>> = {};

  for (const [k, v] of Object.entries(query)) {
    Object.assign(filter, parseCondition({ [k]: v }));
  }

  return filter;
}
