import type { SavedIdea } from "@repo/types";
import { model, Schema, type Types } from "mongoose";

import { HttpError } from "@/utils/HttpError.js";

import { PinModel } from "../pin/pin.model.js";

const schema = new Schema<SavedIdea<Types.ObjectId, Types.ObjectId>>(
  {
    savedBy: {
      type: Schema.ObjectId,
      ref: "users",
      required: true,
    },
    pin: {
      type: Schema.ObjectId,
      ref: "pins",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ savedBy: 1, pin: 1 }, { unique: true });
schema.index({ savedBy: 1, createdAt: -1 });
schema.index({ pin: 1 });

schema.pre("save", async function (next) {
  const pin = await PinModel.findOne({ _id: this.pin });

  if (pin?.pinOwner.toString() === this.savedBy.toString()) {
    next(new HttpError(409, "Owner cannot save their own pins"));
  }

  next();
});

export const SavedIdeaModel = model("saved_ideas", schema);
