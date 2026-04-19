import { createContext, useContext } from "react";

export type ViewOption = "standard" | "compact";

export type SavedIdeasContextState = {
  pin: {
    createdByYou: boolean;
    viewOptions: ViewOption;
    toggleCreatedByYou: (status: boolean) => void;
    setViewOption: (option: ViewOption) => void;
  };
};

export const defaultState: SavedIdeasContextState = {
  pin: {
    viewOptions: "compact",
    createdByYou: false,
    setViewOption: () => {},
    toggleCreatedByYou: () => {},
  },
};

export const SaveIdeasContext = createContext<SavedIdeasContextState>(defaultState);

export const useSaveIdeasContext = () => {
  const context = useContext(SaveIdeasContext);

  if (!context) {
    throw new Error("useSaveIdeasContext must be used within SaveIdeasContext");
  }

  return context;
};
