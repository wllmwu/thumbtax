import { produce } from "immer";
import { create } from "zustand";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { SpecificationClient } from "#src/specifications/specificationClient";

import type { FilingStatus } from "#src/common/types/filingStatus";
import type { StoreState } from "#src/state/types/storeState";

type StoreActions = {
  setFilingStatus: (status: FilingStatus) => void;
};

const specificationClient = new SpecificationClient();

export const useStore = create<StoreState & StoreActions>((set) => ({
  applicationState: {
    filingStatus: "single" as const,
    formClasses: [],
    formInstances: {},
  },
  uiState: {
    connectionsGraphNodePositions: {},
  },
  userPreferences: {
    browserSaveEnabled: true,
  },
  workbook: {},
  history: {
    past: [],
    future: [],
  },
  setFilingStatus: (status) => {
    set((state) => {
      const newState = produce(state, (draft) => {
        draft.applicationState.filingStatus = status;
      });
      const newWorkbook = computeWorkbook(
        specificationClient.getAllForms(),
        newState.applicationState.formInstances,
        newState.applicationState.filingStatus,
        state.workbook,
      );
      return {
        ...newState,
        workbook: newWorkbook,
      };
    }, true);
  },
}));
