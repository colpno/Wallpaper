import type { NormalizeFilterOperators } from "@/utils/parse-filter-operators.js";
import type { FilterQuery } from "mongoose";

import type { KnownKeys, QueryFilter, SavedIdeaAPIs, SavedIdeaDB } from "@repo/types";

import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";

import { SavedIdeaModel } from "./saved-idea.model.js";

export const findSavedIdeas = async (
  filter?: NormalizeFilterOperators<NonNullable<SavedIdeaAPIs.GetMany["query"]>>
): Promise<SavedIdeaDB[] | { data: SavedIdeaDB[]; totalItems: number }> => {
  const { options, queryFilters } = organizeQueryInput(filter);

  const savedIdeas = await buildQueryWithOptions(SavedIdeaModel.find(queryFilters), options).lean<
    SavedIdeaDB[]
  >();

  if (filter?.limit) {
    const totalItems = await SavedIdeaModel.countDocuments(queryFilters);

    return {
      data: savedIdeas,
      totalItems,
    };
  }

  return savedIdeas;
};

export const findSavedIdea = async (
  filter?: Pick<QueryFilter<SavedIdeaDB>, "select" | "embed"> & KnownKeys<FilterQuery<SavedIdeaDB>>
): Promise<SavedIdeaDB | null> => {
  const { options } = organizeQueryInput(filter);

  return buildQueryWithOptions(SavedIdeaModel.findOne(filter), options).lean<SavedIdeaDB>();
};
