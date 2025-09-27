import cloudinary from "@/lib/cloudinary";

export const uploadFile = cloudinary.uploader.upload;

export const destroyFile = cloudinary.uploader.destroy;
