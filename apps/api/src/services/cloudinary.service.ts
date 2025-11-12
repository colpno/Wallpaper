import { v2 as cloudinary } from "cloudinary";

import env from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const uploadFile = cloudinary.uploader.upload;

export const deleteFile = cloudinary.uploader.destroy;

export const deleteFiles = cloudinary.api.delete_resources;
