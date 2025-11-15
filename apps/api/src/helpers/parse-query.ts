import type { NormalizeFilterOperators } from "@/types";

import { Types } from "@repo/shared";
import { type Filter } from "mongoose";

import buildMongoFilter from "./build-mongo-filter";

type ParsedQuery<TObject extends Record<string, unknown>> = Partial<
  Pick<Types.ApiQuery<TObject>, "embed" | "page" | "limit">
> & {
  filter: Filter<NormalizeFilterOperators<TObject>>;
  select?: Record<keyof TObject, Extract<Types.SelectValue, number | boolean>>;
  sort?: Record<keyof TObject, Extract<Types.SortDirection, number | string>>;
  skip?: number;
  unset?: Array<keyof TObject>;
};

export function buildEmbedMatch<T extends Record<string, unknown>>(
  embed: Types.EmbedOptions<T>
): Types.EmbedOptions<T> {
  const e = embed as Types.EmbedOptions<Record<string, Record<string, unknown>>>;

  return {
    ...e,
    match: e.match ? buildMongoFilter(e.match) : undefined,
    select: Array.isArray(e.select) ? e.select.join(" ") : e.select,
    populate: e.populate
      ? Array.isArray(e.populate) && typeof e.populate[0] === "object"
        ? (e.populate as Types.EmbedOptions<T>[]).map(buildEmbedMatch)
        : typeof e.populate === "object" && !Array.isArray(e.populate)
          ? buildEmbedMatch(e.populate as Types.EmbedOptions<T>)
          : e.populate
      : undefined,
  } as Types.EmbedOptions<T>;
}

/**
 * Parses a client-provided query object into a structured format.
 * @param args A filter object provided by clients.
 * @returns A parsed query object.
 */
export default function parseQuery<TObject extends Record<string, unknown>>(
  args: Types.ApiQuery<TObject>
): ParsedQuery<TObject> {
  const { embed, sort, select, limit, page, ...filters } = args;

  const parsed = {
    filter: {},
    embed,
    page,
    limit,
    sort,
    select,
  } as ParsedQuery<TObject>;

  if (Object.keys(filters).length > 0) {
    parsed.filter = buildMongoFilter(filters) as Filter<NormalizeFilterOperators<TObject>>;
  }

  if (select && Array.isArray(select)) {
    parsed.select = select.reduce(
      (acc, key) => {
        acc[key as keyof TObject] = key.startsWith("-") ? 0 : 1;
        return acc;
      },
      {} as Record<keyof TObject, 0 | 1>
    );
  }

  if (page && limit) {
    parsed.skip = (page - 1) * limit;
  }

  if (typeof embed === "object" && !Array.isArray(embed)) {
    parsed.embed = buildEmbedMatch(embed);
  }

  if (Array.isArray(embed) && typeof embed[0] === "object") {
    parsed.embed = embed.filter((e) => typeof e === "object").map(buildEmbedMatch);
  }

  return parsed;
}
