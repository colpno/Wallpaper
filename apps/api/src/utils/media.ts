import { env } from "@/configs/env.js";
import { deleteFile, uploadFile } from "@/services/cloudinary.js";

import { fileToBase64 } from "./converters.js";

export const uploadMedia = async (file: Parameters<typeof fileToBase64>[0]) => {
  const dataURI = fileToBase64(file);
  const now = new Date();
  const folder = `${env.CLOUDINARY_FOLDER}/${now.getFullYear()}/${now.getMonth() + 1}`;

  return uploadFile(dataURI, {
    folder,
  });
};

export const deleteMedia = deleteFile;
