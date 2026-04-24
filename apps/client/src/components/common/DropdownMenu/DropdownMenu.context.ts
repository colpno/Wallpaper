import type { ContextState } from "./DropdownMenu.types";

import { createContext, useContext } from "react";

export const DropdownMenuProvider = createContext<ContextState>({});

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuProvider);

  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenuProvider.");
  }

  return context;
};
