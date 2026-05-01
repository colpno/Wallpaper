import type { NormalizeFilterOperators } from "@/utils/parse-filter-operators.js";
import type { FilterQuery } from "mongoose";

import type { IdeaAPIs, IdeaDB, KnownKeys, QueryFilter } from "@repo/types";

import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";

import { IdeaModel } from "./idea.model.js";

export const findIdeas = async (
  filter?: NormalizeFilterOperators<NonNullable<IdeaAPIs.GetMany["query"]>>
): Promise<IdeaDB[] | { data: IdeaDB[]; totalItems: number }> => {
  const { options, queryFilters } = organizeQueryInput(filter);

  const ideas = await buildQueryWithOptions(IdeaModel.find(queryFilters), options).lean<IdeaDB[]>();

  if (filter?.limit) {
    const totalItems = await IdeaModel.countDocuments(queryFilters);

    return {
      data: ideas,
      totalItems,
    };
  }

  return ideas;
};

export const findIdea = async (
  filter?: Pick<QueryFilter<IdeaDB>, "select" | "embed"> & KnownKeys<FilterQuery<IdeaDB>>
): Promise<IdeaDB | null> => {
  const { options } = organizeQueryInput(filter);

  return buildQueryWithOptions(IdeaModel.findOne(filter), options).lean<IdeaDB>();
};
