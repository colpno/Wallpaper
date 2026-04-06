import type { ExpiredMedia } from "@repo/types";
import { model, Schema } from "mongoose";

const schema = new Schema<ExpiredMedia>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ExpiredMediaModel = model("expired_medias", schema);
