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

export type UserKeys = keyof User;
