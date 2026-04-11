import type { Login, Register } from "./auth.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { AuthAPIs, UserDB } from "@repo/types";

import { UserModel } from "../user/user.model.js";
import { hash } from "./auth.services.js";

export const login: Login["handler"] = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).lean<UserDB>();

    if (user && user.password === hash(req.body.password, user.salt).hashedValue) {
      const { username, email, avatarUrl, _id } = user;
      const result: AuthAPIs.Login["response"] = { username, email, avatarUrl, _id };

      return res.status(HttpStatusCodes.OK).json(result);
    }

    return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "User is not registered" });
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

    const { _id, username, email, avatarUrl } = await UserModel.create(req.body);

    const result: Register["response"] = { _id: _id.toString(), username, email, avatarUrl };

    return res.status(HttpStatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};
