import type { User, UserDB } from "@/models/user.js";

export type Login = {
  body: Pick<User, "email" | "password">;
  response: Pick<UserDB, "_id" | "avatarUrl" | "username" | "email" | "firstName" | "lastName">;
};

export type Register = {
  body: Pick<User, "email" | "password" | "birthdate">;
  response: Login["response"];
};
