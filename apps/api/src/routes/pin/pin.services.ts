import type { PinDB, QueryFilter, Select } from "@repo/types";

import { PipelineBuilder } from "@/utils/PipelineBuilder.js";

import { PinModel } from "./pin.model.js";

/**
 * `lastSmallestScore` must be provided to have pagination.
 */
export const searchPinsByEmbedding = async (
  embedding: number[],
  options: Pick<QueryFilter<Record<string, unknown>>, "limit" | "page"> & {
    lastSmallestScore: number;
  }
) => {
  const { limit = 30, page = 1, lastSmallestScore, ...restOptions } = options;
  const searchLimit = limit * page;
  /** @see https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/#fields */
  const numCandidates = searchLimit * 5 <= 10000 ? searchLimit * 5 : 10000;
  const optionSelect = "select" in restOptions && (restOptions.select as Select<string>);
  const select = optionSelect
    ? typeof optionSelect === "object"
      ? {
          ...optionSelect,
          score: true,
        }
      : `${optionSelect} score`
    : undefined;

  const filterPipeline = new PipelineBuilder().build<{ score: number }>({
    ...restOptions,
    select,
    score: { lt: lastSmallestScore },
  });

  const pins = await PinModel.aggregate<
    Omit<PinDB, "descriptionEmbeddings" | "photoCloudinaryId"> & { score: number }
  >([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "descriptionEmbeddings",
        queryVector: embedding,
        numCandidates,
        limit: searchLimit,
      },
    },
    {
      $addFields: {
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $project: {
        descriptionEmbeddings: 0,
        photoCloudinaryId: 0,
      },
    },
    ...filterPipeline,
  ]);

  return pins;
};
