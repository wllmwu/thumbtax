import type { UserPreferences } from "#src/state/types/userPreferences";

// The versioned wrapper stored under the preferences localStorage key. Mirrors
// PersistedState.
export type PersistedUserPreferences = {
  preferences: UserPreferences;
  schemaVersion: number;
};
