import type { UiState } from "#src/state/types/uiState";

// The versioned wrapper stored under the UI-state localStorage key. Mirrors
// PersistedState, but without a tax year (UI ephemera has no tax-year meaning).
export type PersistedUiState = {
  uiState: UiState;
  schemaVersion: number;
};
