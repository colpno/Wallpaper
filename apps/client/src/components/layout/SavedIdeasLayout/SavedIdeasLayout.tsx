import { useState } from "react";
import { Outlet } from "react-router";

import {
  defaultState,
  type SavedIdeasContextState,
  SaveIdeasContext,
  type ViewOption,
} from "@/contexts/savedIdeaContext";

import SavedIdeasHeader from "./components/SavedIdeasHeader";

function SavedIdeasLayout({ children }: { children?: React.ReactNode }) {
  const [pinStates, setPinStates] = useState<SavedIdeasContextState["pin"]>(defaultState.pin);

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
    <SaveIdeasContext value={contextValue}>
      <SavedIdeasHeader />

      <div className="pt-6">{children ?? <Outlet />}</div>
    </SaveIdeasContext>
  );
}

export default SavedIdeasLayout;
