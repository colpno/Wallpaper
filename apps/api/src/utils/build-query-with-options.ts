import type { QueryFilter } from "@repo/types";
import { Query } from "mongoose";

type Command = "limit" | "page" | "select" | "sort" | "embed";

type BuildQuerySettingsReturn<T extends Record<string, unknown>> = {
  queryFilters: Omit<QueryFilter<T>, Command>;
  options: Pick<QueryFilter<T>, Command>;
};

export function organizeQueryInput<T extends Record<string, unknown>>(
  args?: QueryFilter<T>
): BuildQuerySettingsReturn<T> {
  if (!args) {
    return { queryFilters: {} as BuildQuerySettingsReturn<T>["queryFilters"], options: {} };
  }

  const { limit, page, select, sort, embed, ...queryFilters } = args;
  const options: BuildQuerySettingsReturn<T>["options"] = {};

  if (select) {
    options.select = select;
  }

  if (sort) {
    options.sort = sort;
  }

  if (embed) {
    options.embed = embed as typeof options.embed;
  }

  if (page) {
    options.page = page;
  }

  if (limit) {
    options.limit = limit;
  }

  return {
    queryFilters,
    options,
  };
}

export default function buildQueryWithOptions<
  Data extends Record<string, unknown>,
  QueryResultType,
  QueryDocType,
  TQuery extends Query<QueryResultType, QueryDocType>,
>(query: TQuery, options: QueryFilter<Data>) {
  const { limit, page, select, sort, embed } = options;

  if (select) {
    query = query.select(select as Parameters<TQuery["select"]>[0]) as TQuery;
  }

  if (sort) {
    query = query.sort(sort as Parameters<TQuery["sort"]>[0]);
  }

  if (embed) {
    query = query.populate(embed as Parameters<TQuery["populate"]>[0]) as TQuery;
  }

  if (limit) {
    const skip = ((page ?? 1) - 1) * limit;
    query = query.skip(skip).limit(limit);
  }

  return query;
}
