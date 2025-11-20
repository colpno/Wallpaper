import type { Comment } from "@/types/model.types";

import { model, Schema } from "mongoose";

const schema = new Schema<Comment>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    text: String,
  },
  {
    timestamps: true,
  }
);

schema.index({ postId: 1 });

const CommentModel = model("comments", schema);

export default CommentModel;
