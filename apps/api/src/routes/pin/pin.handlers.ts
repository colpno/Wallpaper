import type {
  AddOne,
  GetMany,
  GetOneById,
  RemoveMany,
  RemoveOneById,
  Search,
  UndoRemoval,
  UpdateOneById,
} from "./pin.types.js";
import type { File } from "@/utils/schemas.js";

import { HttpStatusCodes } from "@repo/shared";
import type { Pin, PinDB } from "@repo/types";

import { env } from "@/configs/env.js";
import { logger } from "@/lib/logger.js";
import { describeImage, toEmbeddings } from "@/services/embedding.js";
import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";
import { toPaginationPayload } from "@/utils/converters.js";
import { HttpError } from "@/utils/HttpError.js";
import { PipelineBuilder } from "@/utils/PipelineBuilder.js";

import { eraseMedia, uploadMedia } from "../media/media.handlers.js";
import { PinModel } from "./pin.model.js";

const pipelineBuilder = new PipelineBuilder();

export const getMany: GetMany["handler"] = async (req, res, next) => {
  try {
    const { options, queryFilters } = organizeQueryInput(req.query);

    const pins = await buildQueryWithOptions(PinModel.find(queryFilters), options).lean<PinDB[]>();

    if (!req.query.limit) {
      return res.status(HttpStatusCodes.OK).json(pins);
    }

    const totalItems = await PinModel.countDocuments({});
    const itemsPerPage = req.query.limit;

    const result = toPaginationPayload({
      data: pins,
      page: req.query.page ?? 1,
      perPage: itemsPerPage,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getOneById: GetOneById["handler"] = async (req, res, next) => {
  try {
    const { options } = organizeQueryInput(req.query);

    const pin = await buildQueryWithOptions(
      PinModel.findById(req.params.id),
      options
    ).lean<PinDB>();

    if (!pin) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Pin not found" });
    }

    return res.status(HttpStatusCodes.OK).json(pin);
  } catch (error) {
    return next(error);
  }
};

export const addOne: AddOne["handler"] = async (req, res, next) => {
  try {
    const photo = req.file as File;

    const media = await uploadMedia(photo);
    const aiDescription = await describeImage(photo);

    const newPin = await PinModel.create({
      ...req.body,
      photoCloudinaryId: media.public_id,
      photoUrl: media.secure_url,
      photoWidth: media.width,
      photoHeight: media.height,
      photoAspectRatio: Math.round((media.width / media.height) * 100) / 100,
      photoDescription: aiDescription,
      descriptionEmbeddings: await toEmbeddings(aiDescription),
    });

    return res.status(HttpStatusCodes.CREATED).json(newPin.toObject<PinDB>());
  } catch (error) {
    return next(error);
  }
};

export const updateOneById: UpdateOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = req.file;

    const pin = await PinModel.findById(id);

    if (!pin) {
      logger.debug(`Pin with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Pin not found" });
    }

    const updateData: Partial<Pin> = { ...req.body };

    if (photo) {
      const addedMedia = await uploadMedia(photo as File);
      updateData.photoCloudinaryId = addedMedia.public_id;

      if (pin.photoCloudinaryId) await eraseMedia(pin.photoCloudinaryId);
    }

    const updatedPin = await PinModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean<PinDB>();

    if (!updatedPin) {
      logger.debug(
        `Pin with id ${id.toString()} not found after update with new data ${JSON.stringify(updateData)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "Pin not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedPin);
  } catch (error) {
    return next(error);
  }
};

export const removeOneById: RemoveOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pin = await PinModel.findByIdAndUpdate(id, { removedAt: new Date() });

    if (!pin) {
      logger.debug(`Pin with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Pin not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

export const removeMany: RemoveMany["handler"] = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const result = await PinModel.updateMany({ _id: { $in: ids } }, { removedAt: new Date() });

    if (result.matchedCount === 0) {
      logger.debug(
        `No pins found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No pins found to delete" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

export const undoRemoval: UndoRemoval["handler"] = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const result = await PinModel.updateMany(
      {
        _id: { $in: ids },
        removedAt: { $exists: true },
      },
      { $unset: { removedAt: "" } }
    );

    if (result.matchedCount === 0) {
      logger.debug(
        `No pins found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No pins found to delete" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

/**
 * @requires MongoDB with vector search enabled.
 * @description
 * Not available in testing environment.
 * Available only if MongoDB Community Edition version 8.2+,
 * which mongodb-memory-server does not support yet (mongodb-memory-server 10.2.1 = MongoDB 7.0.24).
 * @see https://typegoose.github.io/mongodb-memory-server/docs/guides/mongodb-server-versions/#mongodb-memory-server-core-version-table
 * @see https://www.mongodb.com/company/blog/product-release-announcements/supercharge-self-managed-apps-search-vector-search-capabilities
 */
export const search: Search["handler"] = async (req, res, next) => {
  if (!env.MONGODB_URI && env.ENVIRONMENT === "test") {
    return res
      .status(HttpStatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "This feature is not available" });
  }

  const { limit = 50, ...queries } = req.query;
  /** @see https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/#fields */
  const numCandidates = limit * 10 <= 10000 ? limit * 10 : 10000;

  try {
    const embeddings = await toEmbeddings(
      "text" in req.body ? req.body.text : await describeImage(req.file!)
    );

    const pins = await PinModel.aggregate<
      Omit<PinDB, "descriptionEmbeddings" | "photoCloudinaryId"> & { score: number }
    >([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "descriptionEmbeddings",
          queryVector: embeddings,
          numCandidates,
          limit,
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
      ...pipelineBuilder.build(queries),
    ]);

    const totalItems = await PinModel.countDocuments({});

    const result = toPaginationPayload({
      data: pins,
      page: req.query.page ?? 1,
      perPage: limit,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};
