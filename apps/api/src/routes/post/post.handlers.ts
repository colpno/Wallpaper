import type {
  AddOne,
  GetMany,
  GetOneById,
  RemoveMany,
  RemoveOneById,
  Search,
  UndoRemoval,
  UpdateOneById,
} from "./post.types.js";
import type { File } from "@/utils/schemas.js";

import { HttpStatusCodes } from "@repo/shared";
import type { PaginationPayload, Post, PostDB } from "@repo/types";

import env from "@/configs/env.js";
import logger from "@/lib/logger.js";
import { describeImage, toEmbeddings } from "@/services/embedding.js";
import buildQueryWithOptions, { organizeQueryInput } from "@/utils/build-query-with-options.js";
import HttpError from "@/utils/HttpError.js";
import PipelineBuilder from "@/utils/PipelineBuilder.js";

import { eraseMedia, uploadMedia } from "../media/media.handlers.js";
import PostModel from "./post.model.js";

const pipelineBuilder = new PipelineBuilder();

export const getMany: GetMany["handler"] = async (req, res, next) => {
  try {
    const { options, queryFilters } = organizeQueryInput(req.query);

    const posts = await buildQueryWithOptions(PostModel.find(queryFilters), options).lean<
      PostDB[]
    >();

    if (!req.query.limit) {
      return res.status(HttpStatusCodes.OK).json(posts);
    }

    const totalItems = await PostModel.countDocuments({});
    const itemsPerPage = req.query.limit;

    const result: PaginationPayload<PostDB[]> = {
      data: posts,
      meta: {
        currentPage: req.query.page ?? 1,
        itemCount: posts.length,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
    };

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getOneById: GetOneById["handler"] = async (req, res, next) => {
  try {
    const { options } = organizeQueryInput(req.query);

    const post = await buildQueryWithOptions(
      PostModel.findById(req.params.id),
      options
    ).lean<PostDB>();

    if (!post) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    return res.status(HttpStatusCodes.OK).json(post);
  } catch (error) {
    return next(error);
  }
};

export const addOne: AddOne["handler"] = async (req, res, next) => {
  try {
    const photo = req.file as File;

    const media = await uploadMedia(photo);
    const aiDescription = await describeImage(photo);

    const newPost = await PostModel.create({
      ...req.body,
      photoCloudinaryId: media.public_id,
      photoUrl: media.secure_url,
      photoWidth: media.width,
      photoHeight: media.height,
      photoAspectRatio: Math.round((media.width / media.height) * 100) / 100,
      photoDescription: aiDescription,
      descriptionEmbeddings: await toEmbeddings(aiDescription),
    });

    return res.status(HttpStatusCodes.CREATED).json(newPost.toObject<PostDB>());
  } catch (error) {
    return next(error);
  }
};

export const updateOneById: UpdateOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = req.file;

    const post = await PostModel.findById(id);

    if (!post) {
      logger.debug(`Post with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    const updateData: Partial<Post> = { ...req.body };

    if (photo) {
      const addedMedia = await uploadMedia(photo as File);
      updateData.photoCloudinaryId = addedMedia.public_id;

      if (post.photoCloudinaryId) await eraseMedia(post.photoCloudinaryId);
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean<PostDB>();

    if (!updatedPost) {
      logger.debug(
        `Post with id ${id.toString()} not found after update with new data ${JSON.stringify(updateData)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "Post not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedPost);
  } catch (error) {
    return next(error);
  }
};

export const removeOneById: RemoveOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findByIdAndUpdate(id, { removedAt: new Date() });

    if (!post) {
      logger.debug(`Post with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

export const removeMany: RemoveMany["handler"] = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const result = await PostModel.updateMany({ _id: { $in: ids } }, { removedAt: new Date() });

    if (result.matchedCount === 0) {
      logger.debug(
        `No posts found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No posts found to delete" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};

export const undoRemoval: UndoRemoval["handler"] = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const result = await PostModel.updateMany(
      {
        _id: { $in: ids },
        removedAt: { $exists: true },
      },
      { $unset: { removedAt: "" } }
    );

    if (result.matchedCount === 0) {
      logger.debug(
        `No posts found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No posts found to delete" });
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

    const posts = await PostModel.aggregate<
      Omit<PostDB, "descriptionEmbeddings" | "photoCloudinaryId"> & { score: number }
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

    const totalItems = await PostModel.countDocuments({});

    const result: PaginationPayload<typeof posts> = {
      data: posts,
      meta: {
        currentPage: req.query.page ?? 1,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};
