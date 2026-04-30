import type { Login, Register } from "./auth.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { UserDB } from "@repo/types";

import { UserModel } from "../user/user.model.js";
import { isSamePassword } from "./auth.services.js";

export const login: Login["handler"] = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).lean<UserDB>();

    if (!user) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User is not registered" });
    }

    if (!isSamePassword(user.password, req.body.password, user.salt)) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Invalid password" });
    }

    return res.status(HttpStatusCodes.OK).json({
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    next(error);
  }
};

export const register: Register["handler"] = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(HttpStatusCodes.CONFLICT).json({ message: "User already exists" });
    }

    const newUser = await UserModel.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json({
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });
  } catch (error) {
    next(error);
  }
};
