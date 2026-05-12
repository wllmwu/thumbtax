import { type Draft, produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import { SpecificationClient } from "#src/specifications/specificationClient";

import type { BoxIdentifier } from "#src/common/types/boxIdentifier";
import type { FilingStatus } from "#src/common/types/filingStatus";
import type { FormClass } from "#src/common/types/formClass";
import type { FormInstance } from "#src/common/types/formInstance";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { StoreState } from "#src/state/types/storeState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

type StoreActions = {
  initialize: (
    applicationState: ApplicationState,
    uiState: UiState,
    userPreferences: UserPreferences,
  ) => void;
  setFilingStatus: (filingStatus: FilingStatus) => void;
  addFormInstance: (formClass: FormClass) => FormInstanceId;
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

type FullState = StoreState & StoreActions;

type ApplicationStateRecipe = (draft: Draft<ApplicationState>) => void;

function applyApplicationStateChange(
  recipe: ApplicationStateRecipe,
): (state: FullState) => FullState {
  return (state) => {
    const newApplicationState = produce(state.applicationState, recipe);
    if (newApplicationState === state.applicationState) {
      return state;
    }

    const newPast = [...state.history.past, state.applicationState];
    const maximumSize = state.userPreferences.maximumHistorySize;
    if (newPast.length > maximumSize) {
      newPast.splice(0, newPast.length - maximumSize);
    }

    const newWorkbook = computeWorkbook(
      specificationClient.getAllForms(),
      newApplicationState.formInstances,
      newApplicationState.filingStatus,
      state.workbook,
    );

    return {
      ...state,
      applicationState: newApplicationState,
      history: { past: newPast, future: [] },
      workbook: newWorkbook,
    };
  };
}

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

  initialize: (applicationState, uiState, userPreferences) => {
    set(
      (state) => ({
        ...state,
        applicationState,
        uiState,
        userPreferences,
        history: { past: [], future: [] },
        workbook: computeWorkbook(
          specificationClient.getAllForms(),
          applicationState.formInstances,
          applicationState.filingStatus,
          {},
        ),
      }),
      true,
    );
  },

  setFilingStatus: (filingStatus) => {
    set(
      applyApplicationStateChange((draft) => {
        draft.filingStatus = filingStatus;
      }),
      true,
    );
  },

  addFormInstance: (formClass) => {
    const newId = uuidv4();
    set(
      applyApplicationStateChange((draft) => {
        const newInstance: FormInstance = {
          id: newId,
          class: formClass,
          label: "",
          inputs: {},
        };
        const existing = draft.formInstances[formClass];
        if (existing) {
          existing.push(newInstance);
        } else {
          draft.formInstances[formClass] = [newInstance];
          draft.formClasses.push(formClass);
        }
      }),
      true,
    );
    return newId;
  },

  removeFormInstance: (formClass, instanceId) => {
    set(
      applyApplicationStateChange((draft) => {
        const instances = draft.formInstances[formClass];
        if (!instances) return;
        const index = instances.findIndex(({ id }) => id === instanceId);
        if (index === -1) return;
        instances.splice(index, 1);
        if (instances.length === 0) {
          delete draft.formInstances[formClass];
          const classIndex = draft.formClasses.indexOf(formClass);
          if (classIndex !== -1) {
            draft.formClasses.splice(classIndex, 1);
          }
        }
      }),
      true,
    );
  },

  setFormInstanceLabel: (formClass, instanceId, label) => {
    set(
      applyApplicationStateChange((draft) => {
        const instance = draft.formInstances[formClass]?.find(
          ({ id }) => id === instanceId,
        );
        if (instance) {
          instance.label = label;
        }
      }),
      true,
    );
  },

  moveFormInstance: (formClass, instanceId, direction) => {
    set(
      applyApplicationStateChange((draft) => {
        const instances = draft.formInstances[formClass];
        if (!instances) return;
        const index = instances.findIndex(({ id }) => id === instanceId);
        if (index === -1) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= instances.length) return;
        const [moved] = instances.splice(index, 1);
        instances.splice(newIndex, 0, moved);
      }),
      true,
    );
  },

  moveFormClass: (formClass, direction) => {
    set(
      applyApplicationStateChange((draft) => {
        const index = draft.formClasses.indexOf(formClass);
        if (index === -1) return;
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= draft.formClasses.length) return;
        const [moved] = draft.formClasses.splice(index, 1);
        draft.formClasses.splice(newIndex, 0, moved);
      }),
      true,
    );
  },

  setBoxInput: (formClass, instanceId, boxId, value) => {
    set(
      applyApplicationStateChange((draft) => {
        const instance = draft.formInstances[formClass]?.find(
          ({ id }) => id === instanceId,
        );
        if (instance) {
          instance.inputs[boxId] = value;
        }
      }),
      true,
    );
  },

  updatePreferences: (preferences) => {
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...preferences },
    }));
  },

  undo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      const newFuture = [state.applicationState, ...future];
      return {
        ...state,
        applicationState: previous,
        history: { past: newPast, future: newFuture },
        workbook: computeWorkbook(
          specificationClient.getAllForms(),
          previous.formInstances,
          previous.filingStatus,
          state.workbook,
        ),
      };
    }, true);
  },

  redo: () => {
    set((state) => {
      const { past, future } = state.history;
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, state.applicationState];
      return {
        ...state,
        applicationState: next,
        history: { past: newPast, future: newFuture },
        workbook: computeWorkbook(
          specificationClient.getAllForms(),
          next.formInstances,
          next.filingStatus,
          state.workbook,
        ),
      };
    }, true);
  },
}));
