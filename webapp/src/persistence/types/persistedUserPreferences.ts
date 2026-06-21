import type { UserPreferences } from "#src/state/types/userPreferences";

// The versioned wrapper stored under the preferences localStorage key. Mirrors
// PersistedState, but without a tax year (preferences have no tax-year meaning).
export type PersistedUserPreferences = {
  preferences: UserPreferences;
  schemaVersion: number;
};
