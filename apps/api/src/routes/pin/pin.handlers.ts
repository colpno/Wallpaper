import type {
  AddOne,
  DeleteOneById,
  GetMany,
  GetManyWithSaves,
  GetOneById,
  Search,
  UpdateOneById,
} from "./pin.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { Pin, PinDB } from "@repo/types";
import { type PipelineStage, Types } from "mongoose";

import { env } from "@/configs/env.js";
import { logger } from "@/lib/logger.js";
import { toEmbeddings } from "@/services/embedding.js";
import { toPaginationPayload } from "@/utils/converters.js";
import { HttpError } from "@/utils/HttpError.js";
import { deleteMedia } from "@/utils/media.js";
import { PipelineBuilder } from "@/utils/PipelineBuilder.js";

import { IdeaModel } from "../idea/idea.model.js";
import { PinModel } from "./pin.model.js";
import { findPinById, findPins, searchPinsByEmbedding, uploadPhoto } from "./pin.services.js";

const pipelineBuilder = new PipelineBuilder({
  fieldToCollectionNameMap: {
    pinOwner: "users",
  },
});

export const getMany: GetMany["handler"] = async (req, res, next) => {
  try {
    const result = await findPins(req.query);

    if (Array.isArray(result)) {
      return res.status(HttpStatusCodes.OK).json(result);
    }

    const { data: pins, totalItems } = result;
    const paginatedPins = toPaginationPayload({
      data: pins,
      page: req.query.page ?? 1,
      perPage: req.query.limit ?? 1,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(paginatedPins);
  } catch (error) {
    return next(error);
  }
};

export const getManyWithSaves: GetManyWithSaves["handler"] = async (req, res, next) => {
  try {
    const { pinOwner, ...query } = req.query;
    const userDefinedPipeline = pipelineBuilder.build(query);
    const userObjectId = new Types.ObjectId(pinOwner);

    const pipeline: PipelineStage[] = [
      // Owned pins
      {
        $match: {
          pinOwner: userObjectId,
        },
      },

      // Saved pins
      {
        $unionWith: {
          coll: "ideas",
          pipeline: [
            {
              $match: {
                savedBy: userObjectId,
              },
            },

            {
              $lookup: {
                from: "pins",
                localField: "pin",
                foreignField: "_id",
                as: "pin",
              },
            },
            { $unwind: "$pin" },

            // Replace root with pin
            {
              $replaceRoot: {
                newRoot: "$pin",
              },
            },
          ],
        },
      },

      // Spread user defined stages
      ...userDefinedPipeline,
    ];

    const result = await PinModel.aggregate<PinDB & { isSaved: boolean; isOwned: boolean }>(
      pipeline
    );

    if (!req.query.limit) {
      return res.status(HttpStatusCodes.OK).json(result);
    }

    const totalOwnedPins = await PinModel.countDocuments({
      pinOwner: userObjectId,
    });
    const totalSavedPins = await IdeaModel.countDocuments({
      savedBy: userObjectId,
    });
    const totalItems = totalOwnedPins + totalSavedPins;

    const paginatedResult = toPaginationPayload({
      data: result,
      page: req.query.page ?? 1,
      perPage: req.query.limit,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(paginatedResult);
  } catch (error) {
    next(error);
  }
};

export const getOneById: GetOneById["handler"] = async (req, res, next) => {
  try {
    const result = await findPinById(req.params.id, req.query);

    if (!result) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Pin not found" });
    }

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const addOne: AddOne["handler"] = async (req, res, next) => {
  try {
    const photo = req.file;

    if (!photo) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        message: "Photo must be provided in order to create a pin",
      });
    }

    const uploadedPhoto = await uploadPhoto(photo);
    const newPin = await PinModel.create({ ...req.body, ...uploadedPhoto });

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
      // Upload new media
      const uploadedMedia = await uploadPhoto(photo);
      Object.assign(updateData, uploadedMedia);

      // Delete old media
      if (pin.photoCloudinaryId) await deleteMedia(pin.photoCloudinaryId);
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

export const deleteOneById: DeleteOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pin = await PinModel.findByIdAndDelete(id);

    if (!pin) {
      logger.debug(`Pin with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Pin not found" });
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
  try {
    if (!env.MONGODB_URI && env.ENVIRONMENT === "test") {
      return res
        .status(HttpStatusCodes.SERVICE_UNAVAILABLE)
        .json({ message: "This feature is not available" });
    }

    const MAX_RESULTS = 500;

    const { limit = 30, page = 1, lastSmallestScore, ...restQuery } = req.query;
    const totalItems = limit * Math.floor(MAX_RESULTS / limit);

    if (limit * page > MAX_RESULTS) {
      return res.status(HttpStatusCodes.OK).json({
        ...toPaginationPayload({
          data: [],
          page,
          perPage: limit,
          totalItems,
        }),
        message: "There are no more results",
      });
    }

    const embeddings =
      "embedding" in req.body ? req.body.embedding : await toEmbeddings(req.body.text);

    const pins = await searchPinsByEmbedding(embeddings, {
      ...restQuery,
      limit,
      page,
      lastSmallestScore,
    });

    const result = toPaginationPayload({
      data: pins,
      page,
      perPage: limit,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};
