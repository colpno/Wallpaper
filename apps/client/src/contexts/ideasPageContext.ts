import { createContext, useContext } from "react";

export type ViewOption = "standard" | "compact";

export type IdeasPageContextState = {
  pin: {
    createdByYou: boolean;
    viewOptions: ViewOption;
    toggleCreatedByYou: (status: boolean) => void;
    setViewOption: (option: ViewOption) => void;
  };
};

export const defaultState: IdeasPageContextState = {
  pin: {
    viewOptions: "compact",
    createdByYou: false,
    setViewOption: () => {},
    toggleCreatedByYou: () => {},
  },
};

export const IdeasPageProvider = createContext<IdeasPageContextState>(defaultState);

export const useIdeasPage = () => {
  const context = useContext(IdeasPageProvider);

  if (!context) {
    throw new Error("useIdeasPage must be used within IdeasPageProvider");
  }

  return context;
};
