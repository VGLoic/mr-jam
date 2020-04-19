import { useState } from "react";
// Types
import { MrStates } from "./mergeRequests.types";

export interface UseMrState {
  selectedMrState: MrStates;
  selectMrState: (mrState: MrStates) => void;
}
export const useMrState = (): UseMrState => {
  const [selectedMrState, setSelectedMrState] = useState<MrStates>(
    MrStates.Opened
  );

  const selectMrState = (mrState: MrStates) => setSelectedMrState(mrState);

  return {
    selectMrState,
    selectedMrState,
  };
};
