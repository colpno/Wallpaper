import type { User, UserDB } from "@repo/types";
import { model, Schema } from "mongoose";

import { generateSalt, hash } from "../auth/auth.services.js";
import { PinModel } from "../pin/pin.model.js";

type SchemaType = Omit<User, "birthdate"> & {
  birthdate: Date;
};

const schema = new Schema<SchemaType>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    avatarUrl: String,
    avatarCloudinaryId: String,
  },
  {
    timestamps: true,
  }
);

schema.pre("save", function (next) {
  this.username = `${this.firstName}${this.lastName}`.toLowerCase();
  next();
});

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

  await PinModel.deleteMany({ pinOwner: doc._id });
});

export const UserModel = model("users", schema);
