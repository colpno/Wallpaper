import { useState } from "react";
import { Outlet } from "react-router";

import {
  defaultState,
  type IdeasPageContextState,
  IdeasPageProvider,
  type ViewOption,
} from "@/contexts/ideasPageContext";

import IdeasLayoutHeader from "./components/IdeasLayoutHeader";

function IdeasLayout({ children }: { children?: React.ReactNode }) {
  const [pinStates, setPinStates] = useState<IdeasPageContextState["pin"]>(defaultState.pin);

  const setViewOption = (option: ViewOption) => {
    setPinStates((prev) => ({ ...prev, viewOptions: option }));
  };

  const toggleCreatedByYou = (status: boolean) => {
    setPinStates((prev) => ({ ...prev, createdByYou: status }));
  };

  const contextValue = {
    pin: {
      ...pinStates,
      setViewOption,
      toggleCreatedByYou,
    },
  };

  return (
    <IdeasPageProvider value={contextValue}>
      <IdeasLayoutHeader />

      <div className="pt-6">{children ?? <Outlet />}</div>
    </IdeasPageProvider>
  );
}

export default IdeasLayout;
