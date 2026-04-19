import type { AddOne, CheckSaved, DeleteOneById, GetMany } from "./saved-idea.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { SavedIdeaDB } from "@repo/types";

import { logger } from "@/lib/logger.js";
import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";
import { toPaginationPayload } from "@/utils/converters.js";

import { SavedIdeaModel } from "./saved-idea.model.js";

export const getMany: GetMany["handler"] = async (req, res, next) => {
  try {
    const { options, queryFilters } = organizeQueryInput(req.query);

    const savedIdeas = await buildQueryWithOptions(SavedIdeaModel.find(queryFilters), options).lean<
      SavedIdeaDB[]
    >();

    if (!req.query.limit) {
      return res.status(HttpStatusCodes.OK).json(savedIdeas);
    }

    const totalItems = await SavedIdeaModel.countDocuments({ user: req.query.userId });

    const result = toPaginationPayload({
      data: savedIdeas,
      page: req.query.page ?? 1,
      perPage: req.query.limit,
      totalItems,
    });

    return res.status(HttpStatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

export const checkSaved: CheckSaved["handler"] = async (req, res, next) => {
  try {
    const savedIdea = await SavedIdeaModel.findOne({
      savedBy: req.query.userId,
      pin: req.query.pinId,
    });

    if (!savedIdea) {
      return res.status(HttpStatusCodes.OK).json({ saved: false });
    }

    return res.status(HttpStatusCodes.OK).json({ saved: true });
  } catch (error) {
    return next(error);
  }
};

export const addOne: AddOne["handler"] = async (req, res, next) => {
  try {
    const idea = await SavedIdeaModel.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json(idea.toObject<SavedIdeaDB>());
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

    const idea = await SavedIdeaModel.findByIdAndDelete(id);

    if (!idea) {
      logger.debug(`Saved idea with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Saved idea not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    return next(error);
  }
};
