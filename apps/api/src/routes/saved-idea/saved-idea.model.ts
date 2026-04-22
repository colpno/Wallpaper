import type { SavedIdea } from "@repo/types";
import { model, Schema, type Types } from "mongoose";

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

export const SavedIdeaModel = model("saved_ideas", schema);
