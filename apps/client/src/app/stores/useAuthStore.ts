import type { ImmerStateCreator } from "./useStore";

import type { AuthAPIs } from "@repo/types";

export type AuthStoreState = {
  user:
    | ({
        id: AuthAPIs.Login["response"]["_id"];
      } & Omit<AuthAPIs.Login["response"], "_id">)
    | null;
};

export type AuthStoreActions = {
  login: (user: AuthAPIs.Login["response"]) => void;
  logout: () => void;
};

export type AuthStore = {
  auth: AuthStoreState & AuthStoreActions;
};

export const authSlice: ImmerStateCreator<AuthStore> = (set) => ({
  auth: {
    user: null,
    login: ({ _id, ...rest }) =>
      set((state) => {
        state.auth.user = { ...rest, id: _id };
      }),
    logout: () =>
      set((state) => {
        state.auth.user = null;
      }),
  },
});
