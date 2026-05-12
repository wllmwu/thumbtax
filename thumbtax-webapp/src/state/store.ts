import { produce } from "immer";
import { create } from "zustand";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { SpecificationClient } from "#src/specifications/specificationClient";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";
import type { StoreState } from "#src/state/types/storeState";
import type { UserPreferences } from "#src/state/types/userPreferences";

type StoreActions = {
  initialize: (state: StoreState) => void;
  setFilingStatus: (filingStatus: FilingStatus) => void;
  addFormInstance: (formClass: FormClass) => void;
  removeFormInstance: (
    formClass: FormClass,
    instanceId: FormInstanceId,
  ) => void;
  setFormInstanceLabel: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    label: string,
  ) => void;
  moveFormInstance: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    direction: -1 | 1,
  ) => void;
  moveFormClass: (formClass: FormClass, direction: -1 | 1) => void;
  setBoxInput: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    boxId: BoxIdentifier,
    value: UserInput,
  ) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  undo: () => void;
  redo: () => void;
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
    maximumHistorySize: 50,
  },
  workbook: {},
  history: {
    past: [],
    future: [],
  },
  initialize: (state) => {},
  setFilingStatus: (filingStatus) => {
    set((state) => {
      const newState = produce(state, (draft) => {
        draft.applicationState.filingStatus = filingStatus;
        const newPast = [...state.history.past, state.applicationState];
        if (newPast.length > state.userPreferences.maximumHistorySize) {
          newPast.splice(
            0,
            newPast.length - state.userPreferences.maximumHistorySize,
          );
        }
        draft.history.past = newPast;
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
  addFormInstance: (formClass) => {},
  removeFormInstance: (formClass, instanceId) => {},
  setFormInstanceLabel: (formClass, instanceId, label) => {},
  moveFormInstance: (formClass, instanceId, direction) => {},
  moveFormClass: (formClass, direction) => {},
  setBoxInput: (formClass, instanceId, boxId, value) => {},
  updatePreferences: (preferences) => {},
  undo: () => {},
  redo: () => {},
}));
