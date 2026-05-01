import type { Pin, PinDB } from "./pin.js";
import type { User, UserDB } from "./user.js";
import type { DefaultModelProps } from "@/common.js";
import type { Types } from "mongoose";

export type Idea<
  U extends User | UserDB | string | Types.ObjectId = string,
  P extends Pin | PinDB | PinDB<UserDB> | PinDB<User> | string | Types.ObjectId = string,
> = {
  savedBy: U;
  pin: P;
};

export type IdeaDB<
  U extends User | UserDB | string | Types.ObjectId = string,
  P extends Pin | PinDB | PinDB<UserDB> | PinDB<User> | string | Types.ObjectId = string,
> = Idea<U, P> & DefaultModelProps;
