import type * as routes from "./post.routes";
import type { Post } from "@/types/model.types";
import type { RouteHandler } from "@/types/route-handler.types";

import { HttpStatusCodes } from "@repo/shared";

import { type File } from "@/constants/schema.constants";
import env from "@/env";
import buildPipeline from "@/helpers/build-pipeline";
import HttpError from "@/helpers/HttpError";
import queryWithOptions from "@/helpers/query-with-options";
import logger from "@/lib/logger";
import { describeImage, toEmbeddings } from "@/services/embedding.service";

import { eraseMedia, uploadMedia } from "../media/media.handlers";
import PostModel from "./post.model";

export const getOneById: RouteHandler<routes.GetOneByIdRoute> = async (req, res, next) => {
  try {
    const post = await queryWithOptions(PostModel, "findOne", {
      ...req.query,
      _id: req.params.id,
    });

    if (!post) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    return res.status(HttpStatusCodes.OK).json(post);
  } catch (error) {
    next(error);
  }
};

export const getMany: RouteHandler<routes.GetManyRoute> = async (req, res, next) => {
  try {
    const posts = await queryWithOptions(PostModel, "find", req.query);
    const totalItems = await PostModel.estimatedDocumentCount();

    return res.status(HttpStatusCodes.OK).json({
      data: posts,
      meta: {
        totalItems,
        itemCount: posts.length,
        itemsPerPage: req.query.limit || posts.length,
        totalPages: Math.ceil(totalItems / (req.query.limit || posts.length || 1)),
        currentPage: req.query.page || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const add: RouteHandler<routes.AddRoute> = async (req, res, next) => {
  try {
    const { photo, ...rest } = req.body;

    const media = await uploadMedia(photo);
    const aiDescription = await describeImage(photo);

    const newPost = await PostModel.create({
      ...rest,
      photoCloudinaryId: media.public_id,
      photoUrl: media.secure_url,
      photoWidth: media.width,
      photoHeight: media.height,
      photoAspectRatio: Math.round((media.width / media.height) * 100) / 100,
      photoDescription: aiDescription,
      descriptionEmbeddings: await toEmbeddings(aiDescription),
    });

    return res.status(HttpStatusCodes.CREATED).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const updateOneById: RouteHandler<routes.UpdateOneByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id);

    if (!post) {
      logger.error(`Post with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    const updateData: Partial<Post> = { ...req.body };

    if ("photo" in req.body && req.body.photo) {
      const addedMedia = await uploadMedia(req.body.photo as File);
      updateData.photoCloudinaryId = addedMedia.public_id;

      if (post.photoCloudinaryId) await eraseMedia(post.photoCloudinaryId);
    }

    const updatedPost = await PostModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedPost) {
      logger.error(
        `Post with id ${id.toString()} not found after update with new data ${JSON.stringify(updateData)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "Post not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const removeOneById: RouteHandler<routes.RemoveOneByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findByIdAndUpdate(id, { removedAt: new Date() });

    if (!post) {
      logger.error(`Post with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Post not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

export const removeMany: RouteHandler<routes.RemoveManyRoute> = async (req, res, next) => {
  try {
    const { ids } = req.body;

    const result = await PostModel.updateMany({ _id: { $in: ids } }, { removedAt: new Date() });

    if (result.matchedCount === 0) {
      logger.error(
        `No posts found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No posts found to delete" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

export const undoRemoval: RouteHandler<routes.UndoRemovalRoute> = async (req, res, next) => {
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
      logger.error(
        `No posts found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No posts found to delete" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
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
export const search: RouteHandler<routes.SearchRoute> = async (req, res, next) => {
  if (!env.MONGODB_URI) {
    return res
      .status(HttpStatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "This feature is not available" });
  }

  const { limit: limitQuery, ...queries } = req.query;
  const { search } = req.body;
  const limit = limitQuery || 50;
  /** @see https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-stage/#fields */
  const numCandidates = limit * 10 <= 10000 ? limit * 10 : 10000;

  try {
    const embeddings = await toEmbeddings(search);

    const results: Array<
      Omit<Post, "descriptionEmbeddings" | "photoCloudinaryId"> & { score: number }
    > = await PostModel.aggregate([
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
      ...buildPipeline(queries),
    ]);

    return res.status(HttpStatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};
