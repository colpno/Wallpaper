import type { NormalizeFilterOperators } from "@/utils/parse-filter-operators.js";
import type { Types } from "mongoose";

import type { Pin, PinAPIs, PinDB, QueryFilter, Select } from "@repo/types";
import { encode } from "blurhash";
import sharp from "sharp";

import { describeImage, toEmbeddings } from "@/services/embedding.js";
import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";
import { uploadMedia } from "@/utils/media.js";
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

  const filterPipeline = new PipelineBuilder().build({
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

export const findPins = async (
  filter?: NormalizeFilterOperators<NonNullable<PinAPIs.GetMany["query"]>>
): Promise<PinDB[] | { data: PinDB[]; totalItems: number }> => {
  const { options, queryFilters } = organizeQueryInput(filter);

  const pins = await buildQueryWithOptions(PinModel.find(queryFilters), options).lean<PinDB[]>();

  if (filter?.limit) {
    const totalItems = await PinModel.countDocuments(queryFilters);

    return {
      data: pins,
      totalItems,
    };
  }

  return pins;
};

export const findPinById = async (
  id: string | Types.ObjectId,
  filter?: NormalizeFilterOperators<NonNullable<PinAPIs.GetOneById["query"]>>
): Promise<PinDB | null> => {
  const { options } = organizeQueryInput(filter);

  return buildQueryWithOptions(PinModel.findById(id), options).lean<PinDB>();
};

export const uploadPhoto = async (file: Express.Multer.File) => {
  const sharpInstance = sharp(file.buffer);

  const webp = await sharpInstance.clone().webp({ quality: 90 }).toBuffer();

  const [uploadedMedia, aiDescription, { data, info }] = await Promise.all([
    uploadMedia({ buffer: webp, mimetype: "image/webp" }),
    describeImage(file),
    sharpInstance
      .clone()
      .resize(32, 32, { fit: "inside" })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true }),
  ]);

  const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);

  return {
    photoBlurHash: blurhash,
    photoCloudinaryId: uploadedMedia.public_id,
    photoUrl: uploadedMedia.secure_url,
    photoWidth: uploadedMedia.width,
    photoHeight: uploadedMedia.height,
    photoAspectRatio: Math.round((uploadedMedia.width / uploadedMedia.height) * 100) / 100,
    photoDescription: aiDescription,
    descriptionEmbeddings: await toEmbeddings(aiDescription),
  } satisfies Omit<Pin, "pinOwner">;
};
