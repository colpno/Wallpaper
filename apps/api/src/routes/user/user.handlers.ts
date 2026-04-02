import type { DeleteOneById, UpdateOneById } from "./user.types.js";
import type { File } from "@/utils/schemas.js";

import { HttpStatusCodes } from "@repo/shared";
import type { User, UserDB } from "@repo/types";

import logger from "@/lib/logger.js";
import HttpError from "@/utils/HttpError.js";

import { eraseMedia, uploadMedia } from "../media/media.handlers.js";
import UserModel from "./user.model.js";

export const updateOneById: UpdateOneById["handler"] = async (req, res, next) => {
  try {
    const { id } = req.params;
    const avatar = req.file;

    const user = await UserModel.findById(id);

    if (!user) {
      logger.debug(`User with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const updateData: Partial<User> = { ...req.body };

    if (avatar) {
      const addedMedia = await uploadMedia(avatar as File);
      updateData.avatarUrl = addedMedia.secure_url;

      if (user.avatarUrl) await eraseMedia(user.avatarUrl);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean<UserDB>();

    if (!updatedUser) {
      logger.debug(
        `User with id ${id.toString()} not found after update with new data ${JSON.stringify(updateData)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "User not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteOneById: DeleteOneById["handler"] = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
