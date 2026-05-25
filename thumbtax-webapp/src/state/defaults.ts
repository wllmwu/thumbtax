import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

export const DEFAULT_APPLICATION_STATE: ApplicationState = {
  filingStatus: "single",
  formClasses: [],
  formInstances: {},
};

export const DEFAULT_UI_STATE: UiState = {
  connectionsGraphNodePositions: {},
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  browserSaveEnabled: true,
  maximumHistorySize: 50,
};
