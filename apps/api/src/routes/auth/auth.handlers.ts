import type { Login, Register } from "./auth.types.js";

import { HttpStatusCodes } from "@repo/shared";
import type { UserDB } from "@repo/types";

import { UserModel } from "../user/user.model.js";
import { hash } from "./auth.services.js";

export const login: Login["handler"] = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).lean<UserDB>();

    if (user && user.password === hash(req.body.password, user.salt).hashedValue) {
      return res.status(HttpStatusCodes.OK).json(user);
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

    const newUser = await UserModel.create(req.body);

    return res.status(HttpStatusCodes.CREATED).json(newUser.toObject<UserDB>());
  } catch (error) {
    next(error);
  }
};
