import { describe, expect, it } from "vitest";

import {
  CURRENT_SCHEMA_VERSION,
  CURRENT_TAX_YEAR,
} from "#src/persistence/config";
import {
  serializePersistedState,
  serializeUiState,
  serializeUserPreferences,
} from "#src/persistence/serialize";

import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

describe("serializePersistedState", () => {
  it("wraps the application state with the current schema version and tax year", () => {
    const applicationState: ApplicationState = {
      filingStatus: "single",
      formClasses: [],
      formInstances: {},
    };
    expect(serializePersistedState(applicationState)).toEqual({
      applicationState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
      taxYear: CURRENT_TAX_YEAR,
    });
  });
});

describe("serializeUiState", () => {
  it("wraps the ui state with the current schema version", () => {
    const uiState: UiState = {
      connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
    };
    expect(serializeUiState(uiState)).toEqual({
      uiState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });
});

describe("serializeUserPreferences", () => {
  it("wraps the preferences with the current schema version", () => {
    const preferences: UserPreferences = {
      browserSaveEnabled: true,
      maximumHistorySize: 50,
    };
    expect(serializeUserPreferences(preferences)).toEqual({
      preferences,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });
});
