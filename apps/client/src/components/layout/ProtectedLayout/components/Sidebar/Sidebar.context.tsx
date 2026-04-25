import { createContext, type Dispatch, type SetStateAction, useContext } from "react";

export type SubSidebarType = "creation" | "settings" | null;

export type SidebarProviderState = {
  subSidebar: SubSidebarType;
  setSubSidebar: Dispatch<SetStateAction<SidebarProviderState["subSidebar"]>>;
};

export const SidebarProvider = createContext<SidebarProviderState>({
  subSidebar: null,
  setSubSidebar: () => {},
});

export const useSidebar = () => {
  const context = useContext(SidebarProvider);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};
