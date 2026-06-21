import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";

import type { PersistedState } from "#src/persistence/types/persistedState";
import type { PersistedUiState } from "#src/persistence/types/persistedUiState";
import type { PersistedUserPreferences } from "#src/persistence/types/persistedUserPreferences";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

export function serializePersistedState(
  applicationState: ApplicationState,
): PersistedState {
  return {
    applicationState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    taxYear: CURRENT_TAX_YEAR,
  };
}

export function serializeUiState(uiState: UiState): PersistedUiState {
  return {
    uiState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}

export function serializeUserPreferences(
  preferences: UserPreferences,
): PersistedUserPreferences {
  return {
    preferences,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}
