import { type Draft, produce } from "immer";
import { create } from "zustand";

import { computeWorkbook } from "#src/engine/computeWorkbook";
import {
  DEFAULT_APPLICATION_STATE,
  DEFAULT_UI_STATE,
  DEFAULT_USER_PREFERENCES,
} from "#src/state/defaults";
import { FormInstanceBuilder } from "#src/state/formInstanceBuilder";

import type { FilingStatus, FormClass, TaxYear } from "@thumbtax/common";
import type { SpecificationRegistry } from "@thumbtax/forms";
import type { FormInstanceId } from "#src/common/types/formInstanceId";
import type { UserInput } from "#src/common/types/userInput";
import type { Workbook } from "#src/common/types/workbook";
import type { LoadError } from "#src/persistence/types/loadError";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

type StoreState = {
  applicationState: ApplicationState;
  uiState: UiState;
  userPreferences: UserPreferences;
  workbook: Workbook;
  history: { past: ApplicationState[]; future: ApplicationState[] };
  specificationsByYear: Record<TaxYear, SpecificationRegistry> | undefined;
  loadErrors: LoadError[];
  initialize: (
    applicationState: ApplicationState,
    uiState: UiState,
    userPreferences: UserPreferences,
    specificationsByYear: Record<TaxYear, SpecificationRegistry>,
    loadErrors?: LoadError[],
  ) => void;
  setApplicationState: (applicationState: ApplicationState) => void;
  setLoadErrors: (errors: LoadError[]) => void;
  clearLoadErrors: () => void;
  setTaxYear: (taxYear: TaxYear) => void;
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
  setFormClassExpanded: (formClass: FormClass, isExpanded: boolean) => void;
  setTableOfContentsExpanded: (isExpanded: boolean) => void;
  setBoxInput: (
    formClass: FormClass,
    instanceId: FormInstanceId,
    inputKey: string,
    value: UserInput,
  ) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  undo: () => void;
  redo: () => void;
};

export function selectSpecifications(
  state: Pick<StoreState, "applicationState" | "specificationsByYear">,
): SpecificationRegistry | undefined {
  return state.specificationsByYear?.[state.applicationState.taxYear];
}

function computeWorkbookForState(
  specificationsByYear: Record<TaxYear, SpecificationRegistry> | undefined,
  applicationState: ApplicationState,
  currentWorkbook: Workbook,
): Workbook {
  const specifications = selectSpecifications({
    applicationState,
    specificationsByYear,
  });
  if (!specifications) {
    throw new Error("Store not initialized yet");
  }
  return computeWorkbook(
    specifications,
    applicationState.formInstances,
    applicationState.filingStatus,
    currentWorkbook,
  );
}

type ApplicationStateRecipe = (draft: Draft<ApplicationState>) => void;

function applyApplicationStateChange(
  recipe: ApplicationStateRecipe,
): (state: StoreState) => StoreState {
  return (state) => {
    if (!state.specificationsByYear) {
      throw new Error("Store not initialized yet");
    }

    const newApplicationState = produce(state.applicationState, recipe);
    if (newApplicationState === state.applicationState) {
      return state;
    }

    const newPast = [...state.history.past, state.applicationState];
    const maximumSize = state.userPreferences.maximumHistorySize;
    if (newPast.length > maximumSize) {
      newPast.splice(0, newPast.length - maximumSize);
    }

    const newWorkbook = computeWorkbookForState(
      state.specificationsByYear,
      newApplicationState,
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

type UiStateRecipe = (draft: Draft<UiState>) => void;

function applyUiStateChange(
  recipe: UiStateRecipe,
): (state: StoreState) => StoreState {
  return (state) => ({
    ...state,
    uiState: produce(state.uiState, recipe),
  });
}

const useStoreInner = create<StoreState>((set, get) => ({
  applicationState: DEFAULT_APPLICATION_STATE,
  uiState: DEFAULT_UI_STATE,
  userPreferences: DEFAULT_USER_PREFERENCES,
  workbook: {},
  history: {
    past: [],
    future: [],
  },
  specificationsByYear: undefined,
  loadErrors: [],

  initialize: (
    applicationState,
    uiState,
    userPreferences,
    specificationsByYear,
    loadErrors = [],
  ) => {
    set(
      (state) => ({
        ...state,
        applicationState,
        uiState,
        userPreferences,
        history: { past: [], future: [] },
        specificationsByYear,
        loadErrors,
        workbook: computeWorkbookForState(
          specificationsByYear,
          applicationState,
          {},
        ),
      }),
      true,
    );
  },

  setApplicationState: (applicationState) => {
    set(
      (state) => ({
        ...state,
        applicationState,
        history: { past: [], future: [] },
        workbook: computeWorkbookForState(
          state.specificationsByYear,
          applicationState,
          state.workbook,
        ),
      }),
      true,
    );
  },

  setLoadErrors: (errors) => {
    set((state) => ({ ...state, loadErrors: errors }));
  },

  clearLoadErrors: () => {
    set((state) => ({ ...state, loadErrors: [] }));
  },

  setTaxYear: (taxYear) => {
    set(
      applyApplicationStateChange((draft) => {
        draft.taxYear = taxYear;
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
    const newInstance = new FormInstanceBuilder(
      get().applicationState.taxYear,
      formClass,
      "Untitled form",
    ).build();
    set(
      applyApplicationStateChange((draft) => {
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
    return newInstance.id;
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

        for (const remainingInstances of Object.values(draft.formInstances)) {
          for (const instance of remainingInstances) {
            for (const input of Object.values(instance.inputs)) {
              if (input?.type !== "instance_box_selections") continue;
              const remainingSelections = input.selected.filter(
                (address) => address.instance !== instanceId,
              );
              if (remainingSelections.length !== input.selected.length) {
                input.selected = remainingSelections;
              }
            }
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

  setFormClassExpanded: (formClass, isExpanded) => {
    set(
      applyUiStateChange((draft) => {
        draft.formClassExpansion[formClass] = isExpanded;
      }),
    );
  },

  setTableOfContentsExpanded: (isExpanded) => {
    set(
      applyUiStateChange((draft) => {
        draft.tableOfContentsExpanded = isExpanded;
      }),
    );
  },

  setBoxInput: (formClass, instanceId, inputKey, value) => {
    set(
      applyApplicationStateChange((draft) => {
        const instance = draft.formInstances[formClass]?.find(
          ({ id }) => id === instanceId,
        );
        if (instance) {
          instance.inputs[inputKey] = value;
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
      if (!state.specificationsByYear) {
        throw new Error("Store not initialized yet");
      }

      const { past, future } = state.history;
      if (past.length === 0) {
        return state;
      }

      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      const newFuture = [state.applicationState, ...future];

      return {
        ...state,
        applicationState: previous,
        history: { past: newPast, future: newFuture },
        workbook: computeWorkbookForState(
          state.specificationsByYear,
          previous,
          state.workbook,
        ),
      };
    }, true);
  },

  redo: () => {
    set((state) => {
      if (!state.specificationsByYear) {
        throw new Error("Store not initialized yet");
      }

      const { past, future } = state.history;
      if (future.length === 0) {
        return state;
      }

      const next = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, state.applicationState];

      return {
        ...state,
        applicationState: next,
        history: { past: newPast, future: newFuture },
        workbook: computeWorkbookForState(
          state.specificationsByYear,
          next,
          state.workbook,
        ),
      };
    }, true);
  },
}));

export function useStore<U>(selector: (state: StoreState) => U): U {
  return useStoreInner(selector);
}

export function subscribeToStore<U>(
  selector: (state: StoreState) => U,
  listener: (current: U, previous: U) => void,
): () => void {
  return useStoreInner.subscribe((state, previousState) => {
    const current = selector(state);
    const previous = selector(previousState);
    if (!Object.is(current, previous)) {
      listener(current, previous);
    }
  });
}
