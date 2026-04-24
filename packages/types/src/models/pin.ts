import type { User, UserDB } from "./user.js";
import type { DefaultModelProps } from "@/common.js";
import type { Types } from "mongoose";

type ObjectId = Types.ObjectId;

/**
 * @param O Owner type, one of User, string, or ObjectId.
 */
export type Pin<O extends User | UserDB | string | ObjectId = string> = {
  pinOwner: O;
  pinTitle?: string;
  pinDescription?: string;
  photoCloudinaryId?: string;
  photoBlurHash: string;
  photoUrl: string;
  photoWidth: number;
  photoHeight: number;
  /** Float number, rounded to two decimal places. */
  photoAspectRatio: number;
  /** AI generated. */
  photoDescription: string;
  descriptionEmbeddings: number[];
};

/**
 * @param O Owner type, one of User, string, or ObjectId.
 */
export type PinDB<O extends User | UserDB | string | ObjectId = string> = Pin<O> &
  DefaultModelProps;
