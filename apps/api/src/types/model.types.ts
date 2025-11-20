import type { DefaultTimestampProps, Types } from "mongoose";

export type DefaultModelProps = {
  _id: Types.ObjectId;
  __v: number;
} & DefaultTimestampProps;

export type User = {
  username: string;
  email: string;
  password: string;
  salt: string;
  avatarUrl?: string;
  avatarCloudinaryId?: string;
} & DefaultModelProps;

export type ExpiredMedia = {
  publicId: string;
} & DefaultModelProps;

export type Post = {
  removedAt?: NativeDate;
  postTitle: string;
  postOwner: Types.ObjectId;
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
} & DefaultModelProps;

export type Comment = {
  owner: Types.ObjectId;
  postId: Types.ObjectId;
  text?: string;
} & DefaultModelProps;

export type UserKeys = keyof User;
export type ExpiredMediaKeys = keyof ExpiredMedia;
export type PostKeys = keyof Post;
export type CommentKeys = keyof Comment;
