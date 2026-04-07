import type { User, UserDB } from "@/models/user.js";

export type Login = {
  body: Pick<User, "email" | "password">;
  response: UserDB;
};

export type Register = {
  body: Pick<User, "email" | "password" | "birthdate">;
  response: UserDB;
};
