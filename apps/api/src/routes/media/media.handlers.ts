import type * as routes from "./media.routes";
import type { RouteHandler } from "@/types/route-handler.types";

import { HttpStatusCodes } from "@repo/shared";

import { type File } from "@/constants/schema.constants";
import env from "@/env";
import fileToBase64 from "@/helpers/file-to-base64";
import * as cloudinary from "@/services/cloudinary.service";

import ExpiredMediaModel from "./expired-media.model";

type CloudinaryDeleteFilesResponse = {
  deleted: Record<string, "deleted">;
  partial: boolean | Record<string, unknown>;
};

export const uploadMedia = async (file: File) => {
  const dataURI = fileToBase64(file);
  const now = new Date();
  const folder = `${env.CLOUDINARY_FOLDER}/${now.getFullYear()}/${now.getMonth() + 1}`;
  return cloudinary.uploadFile(dataURI, {
    folder,
  });
};

export const eraseMedia = cloudinary.deleteFile;

export const deleteExpiredMedias: RouteHandler<routes.DeleteExpiredMediasRoute> = async (
  _,
  res,
  next
) => {
  try {
    const expiredMedias = await ExpiredMediaModel.find(
      {
        createdAt: {
          $lte: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
        },
      },
      "publicId"
    );

    if (expiredMedias.length === 0) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "No expired medias found",
      });
    }

    const publicIds = expiredMedias.map((m) => m.publicId);
    const deletedPublicIds: string[] = [];

    // Delete in chunks of 100 to avoid Cloudinary limits
    // https://cloudinary.com/documentation/admin_api#delete_resources
    for (let i = 0; i < publicIds.length; i += 100) {
      const chunk = publicIds.slice(i, i + 100);
      const result: CloudinaryDeleteFilesResponse = await cloudinary.deleteFiles(chunk);
      Object.keys(result.deleted).forEach((publicId) => {
        if (result.deleted[publicId] === "deleted") {
          deletedPublicIds.push(publicId);
        }
      });
    }

    if (deletedPublicIds.length === 0) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({
        message: "No expired medias found",
      });
    }

    await ExpiredMediaModel.deleteMany({
      publicId: { $in: deletedPublicIds },
    });

    res.status(HttpStatusCodes.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
