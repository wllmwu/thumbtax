import type { UiState } from "#src/state/types/uiState";

// The versioned wrapper stored under the UI-state localStorage key. Mirrors
// PersistedState.
export type PersistedUiState = {
  uiState: UiState;
  schemaVersion: number;
};
