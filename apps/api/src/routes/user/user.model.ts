import type { User, UserDB } from "@repo/types";
import { model, Schema } from "mongoose";

import { generateSalt, hash } from "../auth/auth.services.js";
import PostModel from "../post/post.model.js";

const schema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    avatarUrl: String,
    avatarCloudinaryId: String,
  },
  {
    timestamps: true,
  }
);

schema.pre("validate", async function (next) {
  if (!this.isModified("password")) return next();

  this.salt = generateSalt();
  this.password = hash(this.password, this.salt).hashedValue;
  next();
});

schema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate();

  if (update && "password" in update && update["password"]) {
    const newSalt = generateSalt();
    const hashedPassword = hash(update["password"], newSalt).hashedValue;
    this.setUpdate({
      ...update,
      salt: newSalt,
      password: hashedPassword,
    });
  }

  next();
});

schema.post("findOneAndDelete", async function (doc?: UserDB) {
  if (!doc) return;

  await PostModel.deleteMany({ postOwner: doc._id });
});

const UserModel = model("users", schema);

export default UserModel;
