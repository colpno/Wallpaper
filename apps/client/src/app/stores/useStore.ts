import type { AuthAPIs } from "@repo/types";
import { create, type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

export type State = {
  user:
    | ({
        id: AuthAPIs.Login["response"]["_id"];
      } & Pick<AuthAPIs.Login["response"], "avatarUrl" | "username" | "email">)
    | null;
};

export type Actions = {
  login: (user: AuthAPIs.Login["response"]) => void;
};

export type Store = State & Actions;

export type ImmerStateCreator<T> = StateCreator<Store, [["zustand/immer", never], never], [], T>;

const state: ImmerStateCreator<Store> = (set) => ({
  user: null,
  login: (user) =>
    set((state) => {
      state.user = {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        email: user.email,
      };
    }),
});

const persistOptions: PersistOptions<State> = {
  name: "wallpaper",
  partialize: (state) => ({
    user: state.user,
  }),
};

export const store = create(
  immer(persist<Store>(state, persistOptions as unknown as PersistOptions<Store>))
);

export const useStore = <U>(selector: (state: Store) => U) => store(useShallow(selector));
