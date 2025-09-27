import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ImageModel = model("images", schema);

export default ImageModel;
