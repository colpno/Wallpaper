import type { Types } from "@repo/shared";
import { model, Schema } from "mongoose";

const schema = new Schema<Types.ExpiredMedia>(
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
