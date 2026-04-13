import type { AuthAPIs } from "@repo/types";
import { create, type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import { env } from "@/configs/env";
import { decrypt, encrypt } from "@/features/auth/services/crypto";

export type State = {
  user:
    | ({
        id: AuthAPIs.Login["response"]["_id"];
      } & Omit<AuthAPIs.Login["response"], "_id">)
    | null;
};

export type Actions = {
  login: (user: AuthAPIs.Login["response"]) => void;
  logout: () => void;
};

export type Store = State & Actions;

export type ImmerStateCreator<T> = StateCreator<Store, [["zustand/immer", never], never], [], T>;

const state: ImmerStateCreator<Store> = (set) => ({
  user: null,
  login: ({ _id, ...rest }) =>
    set((state) => {
      state.user = { ...rest, id: _id };
    }),
  logout: () =>
    set((state) => {
      state.user = null;
    }),
});

const persistOptions: PersistOptions<State> = {
  name: "wallpaper",
  partialize: (state) => ({
    user: state.user,
  }),
  storage: {
    getItem: (name) => {
      const value = localStorage.getItem(name);
      return value ? decrypt(value, env.VITE_LOCAL_STORAGE_SECRET_KEY) : null;
    },
    setItem: (name, value) => {
      const encrypted = encrypt(value, env.VITE_LOCAL_STORAGE_SECRET_KEY);
      localStorage.setItem(name, encrypted);
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  },
};

export const store = create(
  immer(persist<Store>(state, persistOptions as unknown as PersistOptions<Store>))
);

export const useStore = <U>(selector: (state: Store) => U) => store(useShallow(selector));
