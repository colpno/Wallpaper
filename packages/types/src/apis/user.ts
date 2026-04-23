import type { User, UserDB } from "@/models/user.js";

export type UpdateOneById = {
  params: {
    id: string;
  };
  body: Partial<
    Pick<User, "email" | "password" | "username"> & {
      avatar: File;
    }
  >;
  response: Pick<UserDB, "_id" | "username" | "email" | "avatarUrl" | "firstName" | "lastName">;
};

export type DeleteOneById = {
  params: {
    id: string;
  };
  response: never;
};
