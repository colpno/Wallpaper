import { Types } from "@wallpaper/shared";
import { type Filter, Model } from "mongoose";

import type { NormalizeFilterOperators } from "@/types";

import buildMongoFilter from "./build-mongo-filter";

type ParsedQuery<TObject extends Record<string, unknown>> = Partial<
  Pick<Types.ApiQuery<TObject>, "embed" | "page" | "limit">
> & {
  filter: Filter<NormalizeFilterOperators<TObject>>;
  select?: string;
  sort?: Record<keyof TObject, 1 | -1>;
  skip?: number;
};

/**
 * Parses a client-provided query object into a structured format.
 * @param args A filter object provided by clients.
 * @returns A parsed query object.
 */

function parseQuery<TObject extends Record<string, unknown>>(
  args?: Types.ApiQuery<TObject>
): ParsedQuery<TObject> {
  if (!args) {
    return { filter: {} };
  }

  const { embed, sort, select, limit, page, ...filters } = args;

  const parsed = {
    filter: {},
    embed,
    page,
    limit,
    sort,
  } as ParsedQuery<TObject>;

  if (Object.keys(filters).length > 0) {
    parsed.filter = buildMongoFilter(filters) as Filter<NormalizeFilterOperators<TObject>>;
  }

  if (select) {
    parsed.select = select.join(" ");
  }

  if (page && limit) {
    parsed.skip = (page - 1) * limit;
  }

  return parsed;
}

/**
 * Executes a Mongoose query based on the provided filter.
 * @param model Mongoose model.
 * @param query A filter object.
 * @returns A promise that resolves to an array of documents matching the query.
 */

export default async function queryWithOptions<T extends Record<string, unknown>>(
  model: Model<T>,
  query?: Types.ApiQuery<T>
) {
  const options = parseQuery(query);

  let q = model.find(options.filter);

  if (options.sort) q = q.sort(options.sort);
  if (options.skip !== undefined) q = q.skip(options.skip);
  if (options.limit !== undefined) q = q.limit(options.limit);
  if (options.select) q = q.select(options.select);
  if (options.embed) q = q.populate(options.embed as any);

  return q.exec();
}
