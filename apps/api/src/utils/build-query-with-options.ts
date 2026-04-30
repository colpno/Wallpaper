import { Query } from "mongoose";

type Command = "limit" | "page" | "select" | "sort" | "embed";
const commands: Command[] = ["limit", "page", "select", "sort", "embed"];

type OrganizeQueryResult<T> = {
  options: Pick<T, Command & keyof T>;
  queryFilters: Omit<T, Command>;
};

export const organizeQueryInput = <T extends Record<string, unknown>>(
  args?: T
): OrganizeQueryResult<T> => {
  const options: Partial<Record<Command, unknown>> = {};
  const queryFilters: Record<string, unknown> = {};

  if (!args) {
    return {
      options: {},
      queryFilters: {},
    } as OrganizeQueryResult<T>;
  }

  for (const key in args) {
    if (commands.includes(key as Command)) {
      options[key as Command] = args[key];
    } else {
      queryFilters[key] = args[key];
    }
  }

  return {
    options: options,
    queryFilters: queryFilters,
  } as OrganizeQueryResult<T>;
};

export const buildQueryWithOptions = <
  QueryResultType,
  QueryDocType,
  TQuery extends Query<QueryResultType, QueryDocType>,
  TOptions extends Partial<Record<Command, unknown>>,
>(
  query: TQuery,
  options: TOptions
) => {
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
    const skip = (((page as number) ?? 1) - 1) * (limit as number);
    query = query.skip(skip).limit(limit as number);
  }

  return query;
};
