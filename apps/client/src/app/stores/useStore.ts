import { create, type StateCreator, useStore as useZustandStore } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { env } from "@/configs/env";
import { decrypt, encrypt } from "@/features/auth/services/crypto";

import { authSlice, type AuthStore } from "./useAuthStore";
import { draftSlice, type DraftStore } from "./useDraftStore";

export type ImmerStateCreator<T> = StateCreator<Store, [["zustand/immer", never], never], [], T>;

export type Store = AuthStore & DraftStore;

type PersistedStore = {
  auth: Pick<Store["auth"], "user">;
};

const persistOptions: PersistOptions<Store, PersistedStore> = {
  name: "wallpaper",
  partialize: (state) => ({
    auth: {
      user: state.auth.user,
    },
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

const rootSlice: ImmerStateCreator<Store> = (...parameters) => ({
  ...authSlice(...parameters),
  ...draftSlice(...parameters),
});

export const store = create<Store>()(persist(immer(rootSlice), persistOptions));

export const useStore = <T>(selector: (state: Store) => T) => useZustandStore(store, selector);
