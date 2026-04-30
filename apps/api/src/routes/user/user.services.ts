import type { FilterQuery } from "mongoose";

import type { KnownKeys, QueryFilter, User, UserDB } from "@repo/types";
import sharp from "sharp";

import { buildQueryWithOptions, organizeQueryInput } from "@/utils/build-query-with-options.js";
import { uploadMedia } from "@/utils/media.js";

import { UserModel } from "./user.model.js";

export const findUser = async (
  filter: Pick<QueryFilter<UserDB>, "select"> & KnownKeys<FilterQuery<UserDB>>
): Promise<UserDB | null> => {
  const { options, queryFilters } = organizeQueryInput(filter);

  return buildQueryWithOptions(UserModel.findOne(queryFilters), options).lean<UserDB>();
};

export const uploadAvatar = async (file: Express.Multer.File) => {
  const sharpInstance = sharp(file.buffer);

  const webp = await sharpInstance.clone().webp({ quality: 90 }).toBuffer();
  const uploadedMedia = await uploadMedia({ buffer: webp, mimetype: "image/webp" });

  return {
    avatarUrl: uploadedMedia.secure_url,
    avatarCloudinaryId: uploadedMedia.public_id,
  } satisfies Pick<User, "avatarUrl" | "avatarCloudinaryId">;
};
