import type * as routes from "./user.routes.js";
import type { File } from "@/constants/schemas.js";
import type { RouteHandler } from "@/types/route-handler.js";

import { HttpStatusCodes } from "@repo/shared";
import type { User, UserDB } from "@repo/types";

import { hash } from "@/helpers/crypto.js";
import HttpError from "@/helpers/HttpError.js";
import logger from "@/lib/logger.js";

import { eraseMedia, uploadMedia } from "../media/media.handlers.js";
import UserModel from "./user.model.js";

export const signin: RouteHandler<routes.SigninRoute> = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).lean<UserDB>();

    if (user && user.password === hash(req.body.password, user.salt).hashedValue) {
      return res.status(HttpStatusCodes.OK).json(user);
    }

    return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
  } catch (error) {
    next(error);
  }
};

export const register: RouteHandler<routes.RegisterRoute> = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(HttpStatusCodes.CONFLICT).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json(newUser.toObject<UserDB>());
  } catch (error) {
    next(error);
  }
};

export const updateOneById: RouteHandler<routes.UpdateUserByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      logger.error(`User with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const updateData: Partial<User> = { ...req.body };

    if ("avatar" in req.body && req.body.avatar) {
      const addedMedia = await uploadMedia(req.body.avatar as File);
      updateData.avatarUrl = addedMedia.secure_url;

      if (user.avatarUrl) await eraseMedia(user.avatarUrl);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean<UserDB>();

    if (!updatedUser) {
      logger.error(
        `User with id ${id.toString()} not found after update with new data ${JSON.stringify(updateData)}`
      );
      throw new HttpError(HttpStatusCodes.NOT_FOUND, "User not found after update");
    }

    return res.status(HttpStatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteOneById: RouteHandler<routes.DeleteUserByIdRoute> = async (req, res, next) => {
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
