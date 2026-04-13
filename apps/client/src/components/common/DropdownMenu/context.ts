import type { ContextState } from "./DropdownMenu.types";

import { createContext, useContext } from "react";

export const DropdownMenuContext = createContext<ContextState>({});

export const useDropdownMenuContext = () => useContext(DropdownMenuContext);
