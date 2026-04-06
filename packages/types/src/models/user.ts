import type { DefaultModelProps } from "@/common.js";

export type User = {
  username: string;
  email: string;
  birthdate: string;
  password: string;
  salt: string;
  avatarUrl?: string;
  avatarCloudinaryId?: string;
};

export type UserDB = User & DefaultModelProps;
