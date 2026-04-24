import type { Pin } from "@repo/types";
import { model, Schema, type Types } from "mongoose";

const schema = new Schema<Pin<Types.ObjectId>>(
  {
    pinTitle: String,
    pinOwner: {
      type: Schema.ObjectId,
      ref: "users",
      required: true,
    },
    pinDescription: String,
    photoCloudinaryId: String,
    photoBlurHash: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    photoWidth: {
      type: Number,
      required: true,
    },
    photoHeight: {
      type: Number,
      required: true,
    },
    photoAspectRatio: {
      type: Number,
      required: true,
    },
    photoDescription: {
      type: String,
      required: true,
    },
    descriptionEmbeddings: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PinModel = model("pins", schema);
