import type { Workbook } from "#src/common/types/workbook";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

export type StoreState = {
  applicationState: ApplicationState;
  uiState: UiState;
  userPreferences: UserPreferences;
  workbook: Workbook;
  history: { past: ApplicationState[]; future: ApplicationState[] };
};
