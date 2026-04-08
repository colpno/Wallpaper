import type { DefaultModelProps, ExpiredMedia, Pin } from "@repo/types";
import { model, Schema, type Types, type UpdateQuery } from "mongoose";

import { ExpiredMediaModel } from "../media/expired-media.model.js";

const schema = new Schema<Pin<Types.ObjectId>>(
  {
    removedAt: {
      type: Date,
      expires: "30d",
    },
    pinTitle: {
      type: String,
      required: true,
    },
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

schema.post(["updateOne", "findOneAndUpdate"], async function (doc) {
  const updateData = this.getUpdate() as UpdateQuery<Pin>;

  if (doc) {
    if (updateData.removedAt) {
      await ExpiredMediaModel.create({
        publicId: doc.photoCloudinaryId,
      });
    }

    if (updateData.$unset?.removedAt) {
      await ExpiredMediaModel.deleteOne({ publicId: doc.photoCloudinaryId });
    }
  }
});

schema.post("updateMany", async function () {
  const updateData = this.getUpdate() as UpdateQuery<Pin>;
  const docs = (await this.model.find(this.getQuery())) as Pin[];

  const expiredMedias: Omit<ExpiredMedia, keyof DefaultModelProps>[] = docs
    .filter((doc) => doc.photoCloudinaryId)
    .map((doc) => ({ publicId: doc.photoCloudinaryId! }));

  if (expiredMedias.length > 0) {
    if (updateData.removedAt) {
      await ExpiredMediaModel.insertMany(expiredMedias);
    }

    if (updateData.$unset?.removedAt) {
      await ExpiredMediaModel.deleteMany({
        publicId: { $in: expiredMedias.map((media) => media.publicId) },
      });
    }
  }
});

export const PinModel = model("pins", schema);
