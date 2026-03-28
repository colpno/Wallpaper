/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { create, type StateCreator } from "zustand";
import { devtools, persist, type PersistOptions } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

/* 
export interface ExampleState {
  mode: "light" | "dark";
  setMode: (mode: ExampleState["mode"]) => void;
}

const example = ((set) => ({
  mode: "light" as ExampleState["mode"],
  setMode: (mode: ExampleState["mode"]) =>
    set((state) => {
      state.global.mode = mode;
    }),
})) as ImmerStateCreator<ExampleState>;

export default example;
*/

export type Store = {
  // example: ExampleState;
};

export type ImmerStateCreator<T> = StateCreator<Store, [["zustand/immer", never], never], [], T>;

const state: StateCreator<Store> = (..._args) => ({
  // example: example(...args),
});

const persistOptions: PersistOptions<Store> = {
  name: "wallpaper",
  // @ts-expect-error - `partialize` requires all fields of a state to be present, but we only want to persist a subset
  partialize: (state) => ({
    // example: {
    //   key: state.example.key,
    // },
  }),
};

const store = create(devtools(immer(persist<Store>(state, persistOptions))));

const useStore = <U>(selector: (state: Store) => U) => store(useShallow(selector));

export { store };
export default useStore;
