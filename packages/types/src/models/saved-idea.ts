import type { Pin, PinDB } from "./pin.js";
import type { User, UserDB } from "./user.js";
import type { DefaultModelProps } from "@/common.js";
import type { Types } from "mongoose";

export type SavedIdea<
  U extends User | UserDB | string | Types.ObjectId = string,
  P extends Pin | PinDB | string | Types.ObjectId = string,
> = {
  savedBy: U;
  pin: P;
};

export type SavedIdeaDB<
  U extends User | UserDB | string | Types.ObjectId = string,
  P extends Pin | PinDB | string | Types.ObjectId = string,
> = SavedIdea<U, P> & DefaultModelProps;
