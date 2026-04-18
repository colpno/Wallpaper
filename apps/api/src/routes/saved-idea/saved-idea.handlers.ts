import type { AddOne, CheckSaved } from "./saved-idea.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { SavedIdeaDB } from "@repo/types";

import { SavedIdeaModel } from "./saved-idea.model.js";

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
