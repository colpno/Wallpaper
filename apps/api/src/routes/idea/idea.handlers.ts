import type { AddOne, CheckSaved, DeleteOneById, GetMany } from "./idea.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { IdeaDB } from "@repo/types";

import { logger } from "@/lib/logger.js";
import { toPaginationPayload } from "@/utils/converters.js";

import { IdeaModel } from "./idea.model.js";
import { findIdeas } from "./idea.services.js";

export const getMany: GetMany["handler"] = async (req, res, next) => {
  try {
    const result = await findIdeas(req.query);

    if (Array.isArray(result)) {
      return res.status(HttpStatusCodes.OK).json(result);
    }

    const { data, totalItems } = result;
    const paginatedResult = toPaginationPayload({
      data,
      page: req.query.page ?? 1,
      perPage: req.query.limit ?? 1,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(paginatedResult);
  } catch (error) {
    return next(error);
  }
};

export const checkSaved: CheckSaved["handler"] = async (req, res, next) => {
  try {
    const result = await IdeaModel.findOne({
      savedBy: req.query.userId,
      pin: req.query.pinId,
    });

    if (!result) {
      return res.status(HttpStatusCodes.OK).json({ saved: false });
    }

    return res.status(HttpStatusCodes.OK).json({ saved: true });
  } catch (error) {
    return next(error);
  }
};

export const addOne: AddOne["handler"] = async (req, res, next) => {
  try {
    const result = await IdeaModel.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json(result.toObject<IdeaDB>());
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return res.status(HttpStatusCodes.CONFLICT).json({ message: "This pin is already saved" });
    }

    return next(error);
  }
};

export const deleteOneById: DeleteOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await IdeaModel.findByIdAndDelete(id);

    if (!result) {
      logger.debug(`Idea with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Idea not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};
