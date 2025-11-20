import type * as routes from "./comment.routes";
import type { RouteHandler } from "@/types/route-handler.types";

import { HttpStatusCodes } from "@repo/shared";

import HttpError from "@/helpers/HttpError";
import queryWithOptions from "@/helpers/query-with-options";
import logger from "@/lib/logger";

import CommentModel from "./comment.model";

export const getMany: RouteHandler<routes.GetManyRoute> = async (req, res, next) => {
  try {
    const comments = await queryWithOptions(CommentModel, "find", req.query);
    const totalItems = await CommentModel.estimatedDocumentCount();

    return res.status(HttpStatusCodes.OK).json({
      data: comments,
      meta: {
        totalItems,
        itemCount: comments.length,
        itemsPerPage: req.query.limit || comments.length,
        totalPages: Math.ceil(totalItems / (req.query.limit || comments.length || 1)),
        currentPage: req.query.page || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const add: RouteHandler<routes.AddRoute> = async (req, res, next) => {
  try {
    const newComment = await CommentModel.create(req.body);
    return res.status(HttpStatusCodes.CREATED).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const updateOneById: RouteHandler<routes.UpdateOneByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await CommentModel.findById(id);

    if (!comment) {
      logger.error(`Comment with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Comment not found" });
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedComment) {
      logger.error(
        `Comment with id ${id.toString()} not found after update with new data ${JSON.stringify(req.body)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "Comment not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteOneById: RouteHandler<routes.DeleteOneByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await CommentModel.findByIdAndDelete(id);

    if (!comment) {
      logger.error(`Comment with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Comment not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
