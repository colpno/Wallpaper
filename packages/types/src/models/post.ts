import type { User, UserDB } from "./user.js";
import type { DefaultModelProps } from "@/common.js";
import type { Types } from "mongoose";

type ObjectId = Types.ObjectId;

/**
 * @param O Owner type, one of User, string, or ObjectId.
 */
export type Post<O extends User | UserDB | string | ObjectId = string> = {
  removedAt?: string;
  postTitle: string;
  postOwner: O;
  postDescription?: string;
  photoCloudinaryId?: string;
  photoUrl: string;
  photoWidth: number;
  photoHeight: number;
  /** Float number, rounded to two decimal places. */
  photoAspectRatio: number;
  /** AI generated. */
  photoDescription: string;
  photoBlurHash: string;
  descriptionEmbeddings: number[];
};

/**
 * @param O Owner type, one of User, string, or ObjectId.
 */
export type PostDB<O extends User | UserDB | string | ObjectId = string> = Post<O> &
  DefaultModelProps;
