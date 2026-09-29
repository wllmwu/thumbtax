import { describe, expect, it } from "vitest";

import { CURRENT_SCHEMA_VERSION } from "#src/persistence/config";
import {
  serializePersistedState,
  serializeUiState,
  serializeUserPreferences,
} from "#src/persistence/serialize";
import {
  makeBoxFixture,
  makeLineFixture,
  makeRegistryFixture,
  makeSectionFixture,
  makeSpecificationFixture,
} from "#src/test/specificationFixtures";

import type { ApplicationState } from "#src/state/types/applicationState";
import type { UiState } from "#src/state/types/uiState";
import type { UserPreferences } from "#src/state/types/userPreferences";

describe("serializePersistedState", () => {
  it("wraps the application state with the current schema version", () => {
    const applicationState: ApplicationState = {
      taxYear: 2026,
      filingStatus: "married_filing_separately",
      formClasses: [],
      formInstances: {},
    };
    expect(
      serializePersistedState(applicationState, makeRegistryFixture()),
    ).toEqual({
      applicationState,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });

  it("excludes inputs that the given specifications don't recognize", () => {
    const specifications = makeRegistryFixture({
      f1099INT: makeSpecificationFixture({
        class: "f1099INT",
        sections: [
          makeSectionFixture({
            lines: [
              makeLineFixture({
                box: makeBoxFixture({
                  identifier: "1",
                  value: { type: "number_input", inputKey: "interest" },
                }),
              }),
            ],
          }),
        ],
      }),
    });
    const applicationState: ApplicationState = {
      taxYear: 2025,
      filingStatus: "single",
      formClasses: ["f1099INT"],
      formInstances: {
        f1099INT: [
          {
            id: "int-1",
            class: "f1099INT",
            label: "Bank",
            inputs: {
              interest: { type: "number", value: 88.25 },
              penalty: { type: "number", value: 12 },
            },
          },
        ],
      },
    };

    expect(serializePersistedState(applicationState, specifications)).toEqual({
      applicationState: {
        ...applicationState,
        formInstances: {
          f1099INT: [
            {
              id: "int-1",
              class: "f1099INT",
              label: "Bank",
              inputs: { interest: { type: "number", value: 88.25 } },
            },
          ],
        },
      },
      schemaVersion: CURRENT_SCHEMA_VERSION,
    });
  });
});

describe("serializeUiState", () => {
  it("wraps the ui state with the current schema version", () => {
    const uiState: UiState = {
      connectionsGraphNodePositions: { fW2: { x: 1, y: 2 } },
      formClassExpansion: { fW2: true },
      tableOfContentsExpanded: true,
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
