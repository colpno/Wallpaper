import type { ExpiredMedia } from "@/types/model.types";

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

const ExpiredMediaModel = model("expired_medias", schema);

export default ExpiredMediaModel;
