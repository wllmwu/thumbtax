import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import { filterRecognizedState } from "#src/persistence/filterRecognizedState";

import type { SpecificationRegistry } from "@thumbtax/forms";
import type { PersistedState } from "#src/persistence/types/persistedState";
import type { PersistedUiState } from "#src/persistence/types/persistedUiState";
import type { PersistedUserPreferences } from "#src/persistence/types/persistedUserPreferences";
import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

/**
 * Serializes the application state without the data that the given
 * specifications don't recognize.
 */
export function serializePersistedState(
  applicationState: ApplicationState,
  specifications: SpecificationRegistry,
): PersistedState {
  return {
    applicationState: filterRecognizedState(applicationState, specifications),
    schemaVersion: CURRENT_SCHEMA_VERSION,
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
