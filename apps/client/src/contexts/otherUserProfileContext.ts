import type { UserDB } from "@repo/types";
import { createContext, useContext } from "react";
export type OtherUserProfileContextState = {
  user: Pick<UserDB, "_id" | "firstName" | "lastName">;
};

export const defaultState: OtherUserProfileContextState = {
  user: {
    _id: "",
    firstName: "",
    lastName: "",
  },
};

export const OtherUserProfileProvider = createContext<OtherUserProfileContextState>(defaultState);

export const useOtherUserProfile = () => {
  const context = useContext(OtherUserProfileProvider);

  if (!context) {
    throw new Error("useOtherUserProfile must be used within OtherUserProfileProvider");
  }

  return context;
};
