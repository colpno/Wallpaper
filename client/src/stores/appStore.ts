import { create } from 'zustand';

import { Theme } from '~/types/index.ts';

interface State {
  theme: Theme;
}

interface Action {
  setTheme: (theme: Theme) => void;
}

const initialState: State = {
  theme: (localStorage.getItem('theme') as Theme | null) || 'light',
};

const useAppStore = create<State & Action>((set) => ({
  ...initialState,
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  },
}));

export default useAppStore;
