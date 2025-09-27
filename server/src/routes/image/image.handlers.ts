import { HttpStatusCodes } from "@wallpaper/shared";
import type { UploadApiResponse } from "cloudinary";

import type { FileType } from "@/constants/schema.constants";
import { fileToBase64, queryWithOptions, urlToBlob } from "@/helpers";
import env from "@/lib/env";
import logger from "@/lib/logger";
import { destroyFile, uploadFile } from "@/services/cloudinary.service";
import type { Image, RouteHandler } from "@/types";

import ImageModel from "./image.model";
import type * as routes from "./image.routes";

/** Convert Cloudinary upload response to Image object. */
const cloudinaryToImage = (img: UploadApiResponse): Omit<Image, "createdAt" | "updatedAt"> => ({
  url: img.secure_url,
  publicId: img.public_id,
  width: img.width,
  height: img.height,
  format: img.format,
  bytes: img.bytes,
});

/** Upload an image to Cloudinary and return the upload response. */
const uploadImage = async (file: FileType) => {
  const dataURI = fileToBase64(file);
  const now = new Date();
  const folder = `${env.CLOUDINARY_FOLDER}/${now.getFullYear()}/${now.getMonth() + 1}`;
  return uploadFile(dataURI, {
    folder,
    resource_type: "image",
  });
};

/** Erase an image from Cloudinary. */
const eraseImage = async (publicId: string) => destroyFile(publicId, { resource_type: "image" });

export const getMany: RouteHandler<routes.GetManyRoute> = async (req, res, next) => {
  try {
    const result = await queryWithOptions(ImageModel, req.query);

    const blobbedResult = await Promise.all(
      result.map(async (image) => ({
        ...image.toObject(),
        url: await urlToBlob(image.url),
      }))
    );

    return res.status(HttpStatusCodes.OK).json(blobbedResult);
  } catch (error) {
    next(error);
  }
};

export const add: RouteHandler<routes.AddRoute> = async (req, res, next) => {
  try {
    const { images: files } = req.body;

    const response = await Promise.all(files.map(uploadImage));

    await ImageModel.insertMany(response.map(cloudinaryToImage));

    return res.status(HttpStatusCodes.OK).json({
      message: "Images uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateOneById: RouteHandler<routes.UpdateOneByIdRoute> = async (req, res, next) => {
  try {
    const { image: file } = req.body;
    const { id } = req.params;

    const image = await ImageModel.findById(id);

    if (!image) {
      logger.error(`Image with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Image not found" });
    }

    const img = await uploadImage(file);

    await eraseImage(image.publicId);

    const updatedImage = await ImageModel.findByIdAndUpdate(id, cloudinaryToImage(img), {
      new: true,
    });

    if (!updatedImage) {
      logger.error(
        `Image with id ${id.toString()} not found after update with new data ${JSON.stringify(img)}`
      );
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ message: "Image not found after update" });
    }

    return res.status(HttpStatusCodes.OK).json({
      message: "Images uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOneById: RouteHandler<routes.DeleteOneByIdRoute> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const image = await ImageModel.findByIdAndDelete(id);

    if (!image) {
      logger.error(`Image with id ${id.toString()} not found`);
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "Image not found" });
    }

    await eraseImage(image.publicId);

    return res.status(HttpStatusCodes.OK).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMany: RouteHandler<routes.DeleteManyRoute> = async (req, res, next) => {
  try {
    const ids = req.body;

    const images = await ImageModel.find({ _id: { $in: ids } });

    const imagesToErase = images.map((img) => img.publicId);

    const imagesDeletion = await ImageModel.deleteMany({ _id: { $in: ids } });

    if (imagesDeletion.deletedCount === 0) {
      logger.error(
        `No images found to delete with ids: ${ids.map((id) => id.toString()).join(", ")}`
      );
      return res.status(HttpStatusCodes.NOT_FOUND).json({ message: "No images found to delete" });
    }

    await Promise.all(imagesToErase.map(eraseImage));

    return res.status(HttpStatusCodes.OK).json({
      message: "Images deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
