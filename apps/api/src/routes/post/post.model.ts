import type { DefaultModelProps, ExpiredMedia, Post } from "@/types/model.types";

import { model, Schema, type UpdateQuery } from "mongoose";

import ExpiredMediaModel from "../media/expired-media.model";

const schema = new Schema<Post>(
  {
    removedAt: {
      type: Date,
      expires: "30d",
    },
    postTitle: {
      type: String,
      required: true,
    },
    postOwner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postDescription: String,
    photoCloudinaryId: String,
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
    photoBlurHash: {
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

schema.virtual("comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "postId",
});

schema.post(["updateOne", "findOneAndUpdate"], async function (doc) {
  const updateData = this.getUpdate() as UpdateQuery<Post>;

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
  const updateData = this.getUpdate() as UpdateQuery<Post>;
  const docs = (await this.model.find(this.getQuery())) as Post[];

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

const PostModel = model("posts", schema);

export default PostModel;
